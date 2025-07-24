from flask import Blueprint, request, jsonify
from db import db
from models.destino import crear_destino
from bson.objectid import ObjectId

destinos = Blueprint("destinos", __name__)
coleccion = db["destinos"]

# GET - Listar todos los destinos
@destinos.route("/api/destinos", methods=["GET"])
def listar_destinos():
    docs = list(coleccion.find())
    for d in docs:
        d["_id"] = str(d["_id"])
    return jsonify(docs)

# POST - Crear un nuevo destino
@destinos.route("/api/destinos", methods=["POST"])
def crear_nuevo_destino():
    data = request.json

    campos_obligatorios = ["codigo", "nombre_uni", "pais", "requisitos_idioma", "plazas", "meses"]
    for campo in campos_obligatorios:
        if campo not in data:
            return jsonify({ "error": f"Falta el campo obligatorio '{campo}'" }), 400

    # Validar si ya existe un destino con el mismo código
    if coleccion.find_one({ "codigo": data["codigo"] }):
        return jsonify({ "error": "Ya existe un destino con ese código" }), 409

    destino = crear_destino(data)
    resultado = coleccion.insert_one(destino)
    return jsonify({ "message": "Destino creado", "id": str(resultado.inserted_id) })

@destinos.route("/api/destinos/<id>", methods=["PATCH"])
def editar_destino(id):
    if not ObjectId.is_valid(id):
        return jsonify({ "error": "ID inválido" }), 400

    data = request.json
    actualizacion = {}

    campos_simples = [
        "codigo", "nombre_uni", "pais", "requisitos_idioma", 
        "plazas", "meses", "web", "lat", "lng", 
        "descripcion_uni", "descripcion_ciudad", 
        "asignaturas", "tutor_asignado"
    ]

    for campo in campos_simples:
        if campo in data:
            actualizacion[campo] = data[campo]

    if "info_contacto" in data:
        actualizacion["info_contacto"] = {
            "email": data["info_contacto"].get("email", ""),
            "telefono": data["info_contacto"].get("telefono", "")
        }

    coleccion.update_one({ "_id": ObjectId(id) }, { "$set": actualizacion })
    return jsonify({ "message": "Destino actualizado" })

@destinos.route("/api/destinos/<id>", methods=["DELETE"])
def eliminar_destino(id):
    coleccion.delete_one({ "_id": ObjectId(id) })
    return jsonify({ "message": "Destino eliminado" })

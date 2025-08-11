from flask import Blueprint, request, jsonify
from db import db
from models.destino import crear_destino
from bson.objectid import ObjectId
from routes.cloudinary_utils import subir_imagen


destinos = Blueprint("destinos", __name__)
coleccion = db["destinos"]

@destinos.route("/api/destinos", methods=["GET"])
def listar_destinos():
    centro = request.args.get("codigo_centro")
    grado = request.args.get("codigo_grado")
    filtro = {}

    if centro:
        filtro["codigo_centro_ugr"] = centro
    if grado:
        filtro["codigo_grado_ugr"] = grado  

    docs = list(db.destinos.find(filtro))
    for d in docs:
        d["_id"] = str(d["_id"])
    return jsonify(docs)


@destinos.route("/api/destinos/<codigo>/ocupacion", methods=["GET"])
def ocupacion_destino(codigo):
    ocupados = db.usuarios.count_documents({
        "rol": "estudiante",
        "destino_confirmado.codigo": codigo
    })
    return jsonify({"codigo": codigo, "ocupados": int(ocupados)})

@destinos.route("/api/destinos/ocupacion", methods=["GET"])
def ocupacion_todos():
    pipeline = [
        {"$match": {"rol": "estudiante", "destino_confirmado.codigo": {"$exists": True}}},
        {"$group": {"_id": "$destino_confirmado.codigo", "ocupados": {"$sum": 1}}},
    ]
    rows = list(db.usuarios.aggregate(pipeline))
    out = {r["_id"]: int(r["ocupados"]) for r in rows}
    return jsonify(out)

# @destinos.route("/api/destinos", methods=["POST"])
# def crear_nuevo_destino():
#     data = request.json
#     obligatorios = ["codigo", "nombre_uni", "pais", "requisitos_idioma", "plazas", "meses", "codigo_centro_ugr", "codigo_grado_ugr"]
#     for campo in obligatorios:
#         if campo not in data:
#             return jsonify({ "error": f"Falta el campo obligatorio '{campo}'" }), 400

#     if coleccion.find_one({ "codigo": data["codigo"] }):
#         return jsonify({ "error": "Ya existe un destino con ese código" }), 409

#     destino = crear_destino(data)
#     resultado = coleccion.insert_one(destino)
#     return jsonify({ "message": "Destino creado", "id": str(resultado.inserted_id) })

@destinos.route("/api/destinos", methods=["POST"])
def crear_nuevo_destino():
    data = request.json
    obligatorios = ["codigo", "nombre_uni", "pais", "requisitos_idioma", "plazas", "meses", "codigo_centro_ugr", "codigo_grado_ugr"]
    for campo in obligatorios:
        if campo not in data:
            return jsonify({ "error": f"Falta el campo obligatorio '{campo}'" }), 400

    # Permitir mismo codigo si cambia el grado
    if coleccion.find_one({
        "codigo": data["codigo"],
        "codigo_grado_ugr": data["codigo_grado_ugr"]
    }):
        return jsonify({ "error": "Ya existe un destino con ese código para este grado" }), 409

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
        "descripcion_uni", "descripcion_ciudad", "observaciones",
        "asignaturas", "tutor_asignado", "ultimo_anio_reconocimiento",
        "nota_minima", "cursos", "imagenes", "codigo_centro_ugr", "codigo_grado_ugr"
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

@destinos.route("/api/destinos/subir-imagen", methods=["POST"])
def subir_imagen_destino():
    if "imagen" not in request.files:
        return jsonify({"error": "No se ha enviado ninguna imagen"}), 400

    imagen = request.files["imagen"]
    url = subir_imagen(imagen)
    return jsonify({"url": url})

@destinos.route("/api/destinos/codigo/<codigo>", methods=["GET"])
def obtener_destino_por_codigo(codigo):
    destino = db.destinos.find_one({ "codigo": codigo })
    if not destino:
        return jsonify({ "error": "Destino no encontrado" }), 404

    destino["_id"] = str(destino["_id"])
    return jsonify(destino)

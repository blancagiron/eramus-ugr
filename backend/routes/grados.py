from flask import Blueprint, request, jsonify
from db import db
from models.grado import crear_grado
from bson.objectid import ObjectId

grados_api = Blueprint("grados_api", __name__)

@grados_api.route("/grados", methods=["GET"])
def obtener_grados():
    grados = list(db.grados.find())
    for g in grados:
        g["_id"] = str(g["_id"])  
    return jsonify(grados)

@grados_api.route("/grados", methods=["POST"])
def insertar_grado():
    data = request.json
    if db.grados.find_one({"codigo": data["codigo"]}):
        return jsonify({"error": "Ese código ya existe"}), 409

    nuevo = crear_grado(data)
    db.grados.insert_one(nuevo)
    return jsonify({"mensaje": "Grado insertado correctamente"}), 201


@grados_api.route("/grados/<id>", methods=["PATCH"])
def actualizar_grado(id):
    data = request.json
    update = {}

    if "codigo" in data:
        existente = db.grados.find_one({ "codigo": data["codigo"], "_id": { "$ne": ObjectId(id) } })
        if existente:
            return jsonify({ "error": "Ya existe un grado con ese código" }), 409
        update["codigo"] = data["codigo"]

    for campo in ["sigla", "nombre", "codigo_centro"]:
        if campo in data:
            update[campo] = data[campo]

    db.grados.update_one({ "_id": ObjectId(id) }, { "$set": update })
    return jsonify({ "mensaje": "Grado actualizado correctamente" })

@grados_api.route("/grados/<id>", methods=["DELETE"])
def eliminar_grado(id):
    db.grados.delete_one({ "_id": ObjectId(id) })
    return jsonify({ "mensaje": "Grado eliminado correctamente" })
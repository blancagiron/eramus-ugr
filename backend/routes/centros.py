from flask import Blueprint, jsonify, request
from bson.objectid import ObjectId
from db import db

centros_api = Blueprint("centros_api", __name__)

@centros_api.route("/api/centros", methods=["GET"])
def listar_centros():
    centros = list(db.centros.find())
    for c in centros:
        c["_id"] = str(c["_id"])
    return jsonify(centros)

@centros_api.route("/api/centros", methods=["POST"])
def crear_centro():
    data = request.json
    if not data.get("codigo") or not data.get("nombre"):
        return jsonify({"error": "Faltan datos obligatorios"}), 400

    if db.centros.find_one({ "codigo": data["codigo"] }):
        return jsonify({"error": "Ya existe un centro con este código"}), 409

    db.centros.insert_one({ "codigo": data["codigo"], "nombre": data["nombre"], "responsable_academico": data["responsable_academico"] })
    return jsonify({ "message": "Centro creado" }), 201

@centros_api.route("/api/centros/<id>", methods=["PATCH"])
def actualizar_centro(id):
    data = request.json
    update = {}

    if "codigo" in data:
        # Validar duplicado solo si el código ya está usado en otro centro
        existente = db.centros.find_one({
            "codigo": data["codigo"],
            "_id": { "$ne": ObjectId(id) }
        })
        if existente:
            return jsonify({ "error": "Ya existe un centro con ese código" }), 409
        update["codigo"] = data["codigo"]

    if "nombre" in data:
        update["nombre"] = data["nombre"]
    
    if "responsable_academico" in data:
        update["responsable_academico"] = data["responsable_academico"]

    db.centros.update_one({ "_id": ObjectId(id) }, { "$set": update })
    return jsonify({ "message": "Centro actualizado" })

@centros_api.route("/api/centros/<id>", methods=["DELETE"])
def eliminar_centro(id):
    db.centros.delete_one({ "_id": ObjectId(id) })
    return jsonify({ "message": "Centro eliminado" })

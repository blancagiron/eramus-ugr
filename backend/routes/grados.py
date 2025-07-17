from flask import Blueprint, request, jsonify
from db import db
from models.grado import crear_grado

grados_api = Blueprint("grados_api", __name__)

@grados_api.route("/grados", methods=["GET"])
def obtener_grados():
    return jsonify(list(db.grados.find({}, {"_id": 0})))

@grados_api.route("/grados", methods=["POST"])
def insertar_grado():
    data = request.json
    if db.grados.find_one({"codigo": data["codigo"]}):
        return jsonify({"error": "Ese código ya existe"}), 409

    nuevo = crear_grado(data)
    db.grados.insert_one(nuevo)
    return jsonify({"mensaje": "Grado insertado correctamente"}), 201

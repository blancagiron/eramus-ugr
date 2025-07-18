from flask import Blueprint, request, jsonify
from db import db
from models.asignatura import crear_asignatura

asignaturas_api = Blueprint("asignaturas_api", __name__)

@asignaturas_api.route("/api/asignaturas", methods=["GET"])
def obtener_asignaturas():
    grado = request.args.get("grado")
    codigo_grado = request.args.get("codigo_grado")
    centro = request.args.get("centro")

    query = {}
    if grado:
        query["grado"] = grado
    if codigo_grado:
        query["codigo_grado"] = codigo_grado
    if centro:
        query["centro"] = centro

    asignaturas = list(db.asignaturas.find(query, {"_id": 0}))
    return jsonify(asignaturas)

@asignaturas_api.route("/asignaturas", methods=["POST"])
def insertar_asignatura():
    data = request.json
    nueva = crear_asignatura(data)
    db.asignaturas_ugr.insert_one(nueva)
    return jsonify({"mensaje": "Asignatura insertada"}), 201

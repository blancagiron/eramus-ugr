from flask import Blueprint, request, jsonify
from db import db
from models.equivalencia import crear_equivalencia

equivalencias = Blueprint("equivalencias", __name__)
coleccion = db["equivalencias"]

@equivalencias.route("/api/equivalencias", methods=["POST"])
def crear_equivalencia_route():
    data = request.json
    equivalencia = crear_equivalencia(data)
    resultado = coleccion.insert_one(equivalencia)
    return jsonify({ "message": "Equivalencia creada", "id": str(resultado.inserted_id) })

@equivalencias.route("/api/equivalencias", methods=["GET"])
def buscar_equivalencias():
    grado = request.args.get("grado")
    universidad = request.args.get("universidad")
    query = {}
    if grado:
        query["grado"] = grado
    if universidad:
        query["universidad_destino"] = universidad
    resultados = list(coleccion.find(query))
    for r in resultados:
        r["_id"] = str(r["_id"])
    return jsonify(resultados)

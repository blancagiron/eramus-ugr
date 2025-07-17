from flask import Blueprint, request, jsonify
from db import db
from models.destino import crear_destino

destinos = Blueprint("destinos", __name__)
coleccion = db["destinos"]

@destinos.route("/api/destinos", methods=["GET"])
def listar_destinos():
    docs = list(coleccion.find())
    for d in docs:
        d["_id"] = str(d["_id"])
    return jsonify(docs)

@destinos.route("/api/destinos", methods=["POST"])
def crear_nuevo_destino():
    data = request.json
    destino = crear_destino(data)
    resultado = coleccion.insert_one(destino)
    return jsonify({ "message": "Destino creado", "id": str(resultado.inserted_id) })

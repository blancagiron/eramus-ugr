from flask import Blueprint, request, jsonify
from db import db

preguntas_api = Blueprint("preguntas_api", __name__)
coleccion = db["preguntas_frecuentes"]
@preguntas_api.route("/api/preguntas", methods=["GET"])
def obtener_preguntas():
    pagina = int(request.args.get("pagina", 1))
    limite = int(request.args.get("limite", 6))
    buscar = request.args.get("buscar", "").strip()
    categoria = request.args.get("categoria", "").strip()

    filtro = {}

    if categoria:
        filtro["categoria"] = categoria
    if buscar:
        filtro["pregunta"] = { "$regex": buscar, "$options": "i" }

    total = coleccion.count_documents(filtro)

    preguntas = list(
        coleccion.find(filtro)
        .skip((pagina - 1) * limite)
        .limit(limite)
    )

    for p in preguntas:
        p["_id"] = str(p["_id"])

    return jsonify({ "preguntas": preguntas, "total": total })
@preguntas_api.route("/api/categorias", methods=["GET"])
def obtener_categorias():
    categorias = coleccion.distinct("categoria")
    return jsonify({"categorias": categorias})

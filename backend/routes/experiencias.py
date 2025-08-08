from urllib.parse import unquote
import re
from flask import Blueprint, jsonify, request
from db import db
experiencias = Blueprint("experiencias", __name__)


@experiencias.route("/api/experiencias/<codigo_grado>/<codigo_erasmus>", methods=["GET"])
def get_experiencias_destino(codigo_grado, codigo_erasmus):
    # Limpiar y normalizar
    codigo_grado = unquote(codigo_grado).strip()
    codigo_erasmus = unquote(codigo_erasmus).strip()

    # Filtros robustos (ignoran espacios y mayúsculas)
    filtro = {
        "codigo_grado": re.compile(rf"^\s*{re.escape(codigo_grado)}\s*$", re.IGNORECASE),
        "codigo_erasmus": re.compile(rf"^\s*{re.escape(codigo_erasmus)}\s*$", re.IGNORECASE)
    }

    # Buscar
    resultados = list(
        db.experiencias.find(
            filtro,
            {"_id": 0, "codigo_grado": 0, "codigo_erasmus": 0}
        )
    )

    return jsonify(resultados)

@experiencias.route("/api/experiencias/codigo/<codigo_erasmus>", methods=["GET"])
def get_experiencias_por_codigo(codigo_erasmus):
    # Decodificar y limpiar entrada
    codigo_erasmus = unquote(codigo_erasmus).strip()

    # Patrón tolerante: ignora espacios al inicio/fin y mayúsculas/minúsculas
    patron_erasmus = re.compile(rf"^\s*{re.escape(codigo_erasmus)}\s*$", re.IGNORECASE)

    filtro = {
        "codigo_erasmus": patron_erasmus
    }

    experiencias_encontradas = list(
        db.experiencias.find(
            filtro,
            {"_id": 0}  # mostramos todos los campos salvo _id
        )
    )

    return jsonify(experiencias_encontradas)
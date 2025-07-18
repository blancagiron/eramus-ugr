from flask import Blueprint, jsonify
from db import db

centros_api = Blueprint("centros_api", __name__)

@centros_api.route("/api/centros", methods=["GET"])
def listar_centros():
    centros = list(db.centros.find({}, {"_id": 0}))
    return jsonify(centros)
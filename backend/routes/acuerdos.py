from flask import Blueprint, request, jsonify
from models.acuerdo import crear_acuerdo
from db import db
from datetime import datetime

acuerdos = Blueprint("acuerdos", __name__)

# Obtener el acuerdo de un estudiante
@acuerdos.route("/api/acuerdos/<email>", methods=["GET"])
def get_acuerdo(email):
    acuerdo = db.acuerdos.find_one({"email_estudiante": email})
    if not acuerdo:
        return jsonify({"msg": "No hay acuerdo"}), 404
    acuerdo["_id"] = str(acuerdo["_id"])
    return jsonify(acuerdo)

# Crear o actualizar el acuerdo de un estudiante
@acuerdos.route("/api/acuerdos", methods=["POST"])
def crear_o_actualizar_acuerdo():
    data = request.json
    email = data.get("email_estudiante")
    if not email:
        return jsonify({"error": "email_estudiante requerido"}), 400

    acuerdo_existente = db.acuerdos.find_one({"email_estudiante": email})

    data["fecha_ultima_modificacion"] = datetime.utcnow()

    if acuerdo_existente:
        db.acuerdos.update_one(
            {"email_estudiante": email},
            {"$set": data}
        )
        return jsonify({"msg": "Acuerdo actualizado"})
    else:
        nuevo_acuerdo = crear_acuerdo(data)
        db.acuerdos.insert_one(nuevo_acuerdo)
        return jsonify({"msg": "Acuerdo creado"})

# Obtener los acuerdos gestionados por un tutor
@acuerdos.route("/api/acuerdos", methods=["GET"])
def acuerdos_del_tutor():
    email_tutor = request.args.get("email_tutor")
    if not email_tutor:
        return jsonify({"error": "email_tutor requerido"}), 400

    acuerdos = list(db.acuerdos.find({"email_tutor": email_tutor}))
    for a in acuerdos:
        a["_id"] = str(a["_id"])
    return jsonify(acuerdos)

# Enviar el acuerdo al tutor (cambia el estado)
@acuerdos.route("/api/acuerdos/<email>/enviar", methods=["POST"])
def enviar_acuerdo(email):
    acuerdo = db.acuerdos.find_one({"email_estudiante": email})
    if not acuerdo:
        return jsonify({"error": "Acuerdo no encontrado"}), 404

    db.acuerdos.update_one(
        {"email_estudiante": email},
        {"$set": {
            "estado": "enviado",
            "fecha_envio": datetime.utcnow()
        }}
    )
    return jsonify({"msg": "Acuerdo enviado al tutor"})

@acuerdos.route("/api/acuerdos", methods=["POST"])
def crear_nueva_version_acuerdo():
    data = request.json
    email = data.get("email_estudiante")
    if not email:
        return jsonify({"error": "email_estudiante requerido"}), 400

    # Obtener la versión más alta actual
    acuerdos_existentes = list(db.acuerdos.find({"email_estudiante": email}).sort("version", -1))
    nueva_version = 1 if not acuerdos_existentes else acuerdos_existentes[0]["version"] + 1

    acuerdo = crear_acuerdo(data, version=nueva_version)
    db.acuerdos.insert_one(acuerdo)
    return jsonify({"msg": f"Nueva versión {nueva_version} creada", "version": nueva_version})

@acuerdos.route("/api/acuerdos/<email>", methods=["GET"])
def listar_acuerdos_por_estudiante(email):
    acuerdos = list(db.acuerdos.find({"email_estudiante": email}).sort("version", -1))
    for a in acuerdos:
        a["_id"] = str(a["_id"])
    return jsonify(acuerdos)

@acuerdos.route("/api/acuerdos/<email>/ultima", methods=["GET"])
def acuerdo_ultimo(email):
    acuerdo = db.acuerdos.find_one({"email_estudiante": email}, sort=[("version", -1)])
    if not acuerdo:
        return jsonify({"msg": "No hay acuerdo"}), 404
    acuerdo["_id"] = str(acuerdo["_id"])
    return jsonify(acuerdo)
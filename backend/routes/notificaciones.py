from flask import Blueprint, request, jsonify
from datetime import datetime
from bson import ObjectId
from db import db

notificaciones= Blueprint("notificaciones", __name__)

# Obtener todas las notificaciones de un usuario
@notificaciones.route("/api/notificaciones/<email>", methods=["GET"])
def obtener_notificaciones(email):
    notifs = list(db.notificaciones.find({"usuario_email": email}).sort("fecha_creacion", -1))
    for n in notifs:
        n["_id"] = str(n["_id"])
    return jsonify(notifs), 200

# Marcar una notificación como leída
@notificaciones.route("/api/notificaciones/<notif_id>/leer", methods=["PUT"])
def marcar_leida(notif_id):
    db.notificaciones.update_one({"_id": ObjectId(notif_id)}, {"$set": {"leida": True}})
    return jsonify({"msg": "Notificación marcada como leída"}), 200

# Crear una notificación
@notificaciones.route("/api/notificaciones", methods=["POST"])
def crear_notificacion():
    data = request.json
    if not data.get("usuario_email") or not data.get("titulo"):
        return jsonify({"error": "Faltan campos obligatorios"}), 400
    notif = {
        "usuario_email": data["usuario_email"],
        "titulo": data["titulo"],
        "mensaje": data.get("mensaje", ""),
        "tipo": data.get("tipo", "info"),
        "leida": False,
        "enlace": data.get("enlace"),
        "fecha_creacion": datetime.utcnow()
    }
    db.notificaciones.insert_one(notif)
    return jsonify({"msg": "Notificación creada"}), 201

# Limpiar todas las notificaciones de un usuario
@notificaciones.route("/api/notificaciones/<email>/limpiar", methods=["DELETE"])
def limpiar_notificaciones(email):
    db.notificaciones.delete_many({"usuario_email": email})
    return jsonify({"msg": "Todas las notificaciones eliminadas"}), 200

# Marcar todas como leídas
@notificaciones.route("/api/notificaciones/<email>/leer-todas", methods=["PUT"])
def marcar_todas_leidas(email):
    db.notificaciones.update_many({"usuario_email": email}, {"$set": {"leida": True}})
    return jsonify({"msg": "Todas las notificaciones marcadas como leídas"}), 200

from flask import Blueprint, request, jsonify
from db import db  # tu conexión a MongoDB
from models.usuario import crear_usuario
from utils.auth import hash_contraseña, verificar_contraseña

usuarios = Blueprint("usuarios", __name__)

@usuarios.route("/usuarios/registro", methods=["POST"])
def registrar_usuario():
    data = request.json
    if db.usuarios.find_one({"email": data["email"]}):
        return jsonify({"error": "Ya existe un usuario con ese email"}), 409

    data["contraseña"] = hash_contraseña(data["contraseña"])
    nuevo_usuario = crear_usuario(data)
    db.usuarios.insert_one(nuevo_usuario)
    return jsonify({"mensaje": "Registro exitoso"}), 201

@usuarios.route("/usuarios/login", methods=["POST"])
def login_usuario():
    data = request.json
    usuario = db.usuarios.find_one({"email": data["email"]})
    if not usuario:
        return jsonify({"error": "Usuario no encontrado"}), 404

    if not verificar_contraseña(data["contraseña"], usuario["contraseña"]):
        return jsonify({"error": "Contraseña incorrecta"}), 401

    return jsonify({
        "mensaje": "Inicio de sesión exitoso",
        "email": usuario["email"],
        "rol": usuario["rol"],
        "nombre": usuario["nombre"]
    }), 200

@usuarios.route("/usuarios/<email>", methods=["GET"])
def obtener_usuario(email):
    user = db.usuarios.find_one({"email": email}, {"_id": 0})
    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404
    return jsonify(user)

@usuarios.route("/usuarios/<email>", methods=["PATCH"])
def actualizar_usuario(email):
    data = request.json
    update = {}
    if "asignaturas_superadas" in data:
        update["asignaturas_superadas"] = data["asignaturas_superadas"]
    if "creditos_superados" in data:
        update["creditos_superados"] = data["creditos_superados"]
    if "idiomas" in data:
        update["idiomas"] = data["idiomas"]
    db.usuarios.update_one({"email": email}, {"$set": update})
    return jsonify({"mensaje": "Perfil actualizado"}), 200

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

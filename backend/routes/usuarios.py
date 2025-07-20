from flask import Blueprint, request, jsonify, current_app
from db import db  # tu conexión a MongoDB
from models.usuario import crear_usuario
import os
from utils.auth import hash_contraseña, verificar_contraseña
from werkzeug.utils import secure_filename

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

@usuarios.route('/usuarios/foto', methods=['POST'])
def subir_foto_usuario():
    if 'foto' not in request.files or 'email' not in request.form:
        return jsonify({'error': 'Faltan datos'}), 400

    foto = request.files['foto']
    email = request.form['email']

    if not (foto and foto.filename.lower().endswith(('.png', '.jpg', '.jpeg'))):
        return jsonify({'error': 'Tipo de archivo no permitido'}), 400

    filename = secure_filename(email) + ".jpg"
    filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
    foto.save(filepath)

 
    db.usuarios.update_one(
        {"email": email},
        {"$set": {"foto_perfil": filename}}
    )

    return jsonify({"mensaje": "Foto subida correctamente", "archivo": filename})

@usuarios.route('/usuarios/foto', methods=['DELETE'])
def eliminar_foto_usuario():
    email = request.args.get("email")
    if not email:
        return jsonify({"error": "Falta el email"}), 400

    filename = secure_filename(email) + ".jpg"
    filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)

    if os.path.exists(filepath):
        os.remove(filepath)

    # Quita la foto del campo del usuario
    db.usuarios.update_one({"email": email}, {"$unset": {"foto_perfil": ""}})

    return jsonify({"mensaje": "Foto eliminada correctamente"})

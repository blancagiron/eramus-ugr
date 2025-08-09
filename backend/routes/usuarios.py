# from flask import Blueprint, request, jsonify, current_app
# from db import db
# from models.usuario import crear_usuario
# import secrets, uuid
# from utils.email import enviar_correo_verificacion
# import os
# from utils.auth import hash_contraseña, verificar_contraseña
# from werkzeug.utils import secure_filename

# usuarios = Blueprint("usuarios", __name__)


# @usuarios.route("/usuarios/registro", methods=["POST"])
# def registrar_usuario():
#     data = request.json

#     if db.usuarios.find_one({"email": data["email"]}):
#         return jsonify({"error": "Ya existe un usuario con ese email"}), 409

#     if db.usuarios.find_one({
#     "nombre": data.get("nombre"),
#     "primer_apellido": data.get("primer_apellido"),
#     "segundo_apellido": data.get("segundo_apellido")
#     }):       
#         return jsonify({"error": "Ya existe un usuario con ese nombre y apellidos"}), 409

#     rol = data.get("rol", "estudiante")

#     if rol == "tutor":
#         if data.get("codigo_tutor") != os.getenv("CODIGO_TUTOR"):
#             return jsonify({"error": "Código de tutor incorrecto"}), 403

#     # Seguridad
#     data["contraseña"] = hash_contraseña(data["contraseña"])

#     token = str(uuid.uuid4())
#     data["verificado"] = False
#     data["token_verificacion"] = token

#     print("🔐 Token generado para verificación:", token)
#     print("📧 Email destino:", data["email"])

#     # Guardar usuario
#     nuevo_usuario = crear_usuario(data)
#     db.usuarios.insert_one(nuevo_usuario)

#     # Enviar correo
#     enviar_correo_verificacion(data["email"], token)

#     return jsonify({"mensaje": "Registro exitoso, revisa tu correo para verificar tu cuenta"}), 201

# @usuarios.route("/usuarios/login", methods=["POST"])
# def login_usuario():
#     data = request.json
#     usuario = db.usuarios.find_one({"email": data["email"]})
    
#     if not usuario:
#         return jsonify({"error": "Usuario no encontrado"}), 404

#     if not verificar_contraseña(data["contraseña"], usuario["contraseña"]):
#         return jsonify({"error": "Contraseña incorrecta"}), 401

#     if not usuario.get("verificado", False):
#         return jsonify({"error": "Cuenta no verificada. Por favor revisa tu correo para verificar tu cuenta."}), 403

#     return jsonify({
#         "mensaje": "Inicio de sesión exitoso",
#         "email": usuario["email"],
#         "rol": usuario["rol"],
#         "nombre": usuario["nombre"],
#         "codigo_grado": usuario.get("codigo_grado", ""),
#         "asignaturas_superadas": usuario.get("asignaturas_superadas", []),
#         "grado": usuario.get("grado", "")
#     }), 200


# @usuarios.route("/usuarios/<email>", methods=["GET"])
# def obtener_usuario(email):
#     user = db.usuarios.find_one({"email": email}, {"_id": 0})
#     if not user:
#         return jsonify({"error": "Usuario no encontrado"}), 404
#     return jsonify(user)

# @usuarios.route("/usuarios/<email>", methods=["PATCH"])
# def actualizar_usuario(email):
#     data = request.json
#     if not data:
#         return jsonify({"error": "Datos vacíos"}), 400

#     campos_permitidos = {
#         "nombre", "primer_apellido", "segundo_apellido",  "rol", "codigo_centro", "grado", "codigo_grado",
#         "asignaturas_superadas", "creditos_superados", "idiomas", "destinos_asignados",
#         "estado_proceso", "destino_confirmado", "destinos_favoritos"
#     }

#     update_data = {k: v for k, v in data.items() if k in campos_permitidos}

#     if not update_data:
#         return jsonify({"error": "No hay campos válidos para actualizar"}), 400

#     # Estudiantes
#     if update_data.get("rol") == "estudiante":
#         asignados = update_data.get("destinos_asignados", [])
#         if isinstance(asignados, list) and len(asignados) > 1:
#             update_data["destinos_asignados"] = [asignados[0]]
#         if "destinos_asignados" in update_data:
#             if update_data["destinos_asignados"]:
#                 destino_asignado = update_data["destinos_asignados"][0]
#                 codigo_destino = destino_asignado["codigo"]

#                 destino = db.destinos.find_one({"codigo": codigo_destino})
#                 if not destino:
#                     return jsonify({"error": f"Destino {codigo_destino} no encontrado"}), 404

#                 total_asignados = db.usuarios.count_documents({
#                     "rol": "estudiante",
#                     "destinos_asignados.codigo": codigo_destino
#                 })

#                 if total_asignados >= destino.get("plazas", 0):
#                     return jsonify({"error": f"No quedan plazas disponibles para {codigo_destino}"}), 400

#                 update_data["destino_confirmado"] = destino_asignado
#                 update_data["estado_proceso"] = "con destino"
#             else:
#                 update_data["destino_confirmado"] = None
#                 update_data["estado_proceso"] = "sin destino"

#     # Tutores
#     elif update_data.get("rol") == "tutor":
#         usuario_existente = db.usuarios.find_one({"email": email})
#         anteriores = {d["codigo"] for d in usuario_existente.get("destinos_asignados", [])}
#         nuevos = {d["codigo"] for d in update_data.get("destinos_asignados", [])}

#         quitados = anteriores - nuevos
#         añadidos = nuevos - anteriores

#         for cod in quitados:
#             db.destinos.update_one({"codigo": cod}, {"$unset": {"tutor_asignado": ""}})

#         for cod in añadidos:
#             destino = db.destinos.find_one({"codigo": cod})
#             if not destino:
#                 return jsonify({"error": f"Destino {cod} no encontrado"}), 404
#             if destino.get("codigo_centro_ugr") != usuario_existente.get("codigo_centro"):
#                 return jsonify({"error": f"El destino {cod} no pertenece al centro del tutor"}), 400
#             db.destinos.update_one({"codigo": cod}, {"$set": {"tutor_asignado": email}})

#         # También procesar los eliminados que vienen explícitamente desde frontend
#         eliminados = data.get("eliminados", [])
#         for cod in eliminados:
#             db.destinos.update_one({"codigo": cod}, {"$unset": {"tutor_asignado": ""}})

#     resultado = db.usuarios.update_one({"email": email}, {"$set": update_data})

#     if resultado.matched_count == 0:
#         return jsonify({"error": "Usuario no encontrado"}), 404

#     return jsonify({"mensaje": "Usuario actualizado correctamente"}), 200

# @usuarios.route("/usuarios", methods=["GET"])
# def listar_usuarios():
#     docs = list(db.usuarios.find({}, {"_id": 0}))
#     return jsonify(docs)

# @usuarios.route('/usuarios/foto', methods=['POST'])
# def subir_foto_usuario():
#     if 'foto' not in request.files or 'email' not in request.form:
#         return jsonify({'error': 'Faltan datos'}), 400

#     foto = request.files['foto']
#     email = request.form['email']

#     if not (foto and foto.filename.lower().endswith(('.png', '.jpg', '.jpeg'))):
#         return jsonify({'error': 'Tipo de archivo no permitido'}), 400

#     filename = secure_filename(email) + ".jpg"
#     filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
#     foto.save(filepath)

#     db.usuarios.update_one(
#         {"email": email},
#         {"$set": {"foto_perfil": filename}}
#     )

#     return jsonify({"mensaje": "Foto subida correctamente", "archivo": filename})

# @usuarios.route('/usuarios/foto', methods=['DELETE'])
# def eliminar_foto_usuario():
#     email = request.args.get("email")
#     if not email:
#         return jsonify({"error": "Falta el email"}), 400

#     filename = secure_filename(email) + ".jpg"
#     filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)

#     if os.path.exists(filepath):
#         os.remove(filepath)

#     db.usuarios.update_one({"email": email}, {"$unset": {"foto_perfil": ""}})

#     return jsonify({"mensaje": "Foto eliminada correctamente"})

# @usuarios.route("/usuarios/verificar", methods=["POST"])
# def verificar_email():
#     token = request.json.get("token")
#     if not token:
#         return jsonify({"error": "Token faltante"}), 400

#     resultado = db.usuarios.update_one(
#         {"token_verificacion": token},
#         {"$set": {"verificado": True}, "$unset": {"token_verificacion": ""}}
#     )

#     if resultado.modified_count == 0:
#         return jsonify({"error": "Token inválido"}), 400

#     return jsonify({"mensaje": "Cuenta verificada correctamente"}), 200

# @usuarios.route("/usuarios/email/<path:email>")
# def obtener_usuario_por_email(email):
#     usuario = db.usuarios.find_one({"email": email})
#     if usuario:
#         usuario["_id"] = str(usuario["_id"])
#         return jsonify(usuario)
#     else:
#         return jsonify({}), 404
from flask import Blueprint, request, jsonify
from db import db
from models.usuario import crear_usuario
import secrets, uuid
from utils.email import enviar_correo_verificacion
import os
from utils.auth import hash_contraseña, verificar_contraseña
from routes.cloudinary_utils import subir_imagen, eliminar_imagen, sanitize_folder

usuarios = Blueprint("usuarios", __name__)

@usuarios.route("/usuarios/registro", methods=["POST"])
def registrar_usuario():
    data = request.json

    if db.usuarios.find_one({"email": data["email"]}):
        return jsonify({"error": "Ya existe un usuario con ese email"}), 409

    if db.usuarios.find_one({
        "nombre": data.get("nombre"),
        "primer_apellido": data.get("primer_apellido"),
        "segundo_apellido": data.get("segundo_apellido")
    }):
        return jsonify({"error": "Ya existe un usuario con ese nombre y apellidos"}), 409

    rol = data.get("rol", "estudiante")

    if rol == "tutor":
        if data.get("codigo_tutor") != os.getenv("CODIGO_TUTOR"):
            return jsonify({"error": "Código de tutor incorrecto"}), 403

    # Seguridad
    data["contraseña"] = hash_contraseña(data["contraseña"])

    token = str(uuid.uuid4())
    data["verificado"] = False
    data["token_verificacion"] = token

    print("🔐 Token generado para verificación:", token)
    print("📧 Email destino:", data["email"])

    # Guardar usuario
    nuevo_usuario = crear_usuario(data)
    db.usuarios.insert_one(nuevo_usuario)

    # Enviar correo
    enviar_correo_verificacion(data["email"], token)

    return jsonify({"mensaje": "Registro exitoso, revisa tu correo para verificar tu cuenta"}), 201


@usuarios.route("/usuarios/login", methods=["POST"])
def login_usuario():
    data = request.json
    usuario = db.usuarios.find_one({"email": data["email"]})
    
    if not usuario:
        return jsonify({"error": "Usuario no encontrado"}), 404

    if not verificar_contraseña(data["contraseña"], usuario["contraseña"]):
        return jsonify({"error": "Contraseña incorrecta"}), 401

    if not usuario.get("verificado", False):
        return jsonify({"error": "Cuenta no verificada. Por favor revisa tu correo para verificar tu cuenta."}), 403

    return jsonify({
        "mensaje": "Inicio de sesión exitoso",
        "email": usuario["email"],
        "rol": usuario["rol"],
        "nombre": usuario["nombre"],
        "codigo_grado": usuario.get("codigo_grado", ""),
        "asignaturas_superadas": usuario.get("asignaturas_superadas", []),
        "grado": usuario.get("grado", ""),
        "foto_url": usuario.get("foto_url", "")
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
    if not data:
        return jsonify({"error": "Datos vacíos"}), 400

    campos_permitidos = {
        "nombre", "primer_apellido", "segundo_apellido", "rol", "codigo_centro", "grado", "codigo_grado",
        "asignaturas_superadas", "creditos_superados", "idiomas", "destinos_asignados",
        "estado_proceso", "destino_confirmado", "destinos_favoritos"
    }

    update_data = {k: v for k, v in data.items() if k in campos_permitidos}

    if not update_data:
        return jsonify({"error": "No hay campos válidos para actualizar"}), 400

    # Estudiantes
    if update_data.get("rol") == "estudiante":
        asignados = update_data.get("destinos_asignados", [])
        if isinstance(asignados, list) and len(asignados) > 1:
            update_data["destinos_asignados"] = [asignados[0]]
        if "destinos_asignados" in update_data:
            if update_data["destinos_asignados"]:
                destino_asignado = update_data["destinos_asignados"][0]
                codigo_destino = destino_asignado["codigo"]

                destino = db.destinos.find_one({"codigo": codigo_destino})
                if not destino:
                    return jsonify({"error": f"Destino {codigo_destino} no encontrado"}), 404

                total_asignados = db.usuarios.count_documents({
                    "rol": "estudiante",
                    "destinos_asignados.codigo": codigo_destino
                })

                if total_asignados >= destino.get("plazas", 0):
                    return jsonify({"error": f"No quedan plazas disponibles para {codigo_destino}"}), 400

                update_data["destino_confirmado"] = destino_asignado
                update_data["estado_proceso"] = "con destino"
            else:
                update_data["destino_confirmado"] = None
                update_data["estado_proceso"] = "sin destino"

    # Tutores
    elif update_data.get("rol") == "tutor":
        usuario_existente = db.usuarios.find_one({"email": email})
        anteriores = {d["codigo"] for d in usuario_existente.get("destinos_asignados", [])}
        nuevos = {d["codigo"] for d in update_data.get("destinos_asignados", [])}

        quitados = anteriores - nuevos
        añadidos = nuevos - anteriores

        for cod in quitados:
            db.destinos.update_one({"codigo": cod}, {"$unset": {"tutor_asignado": ""}})

        for cod in añadidos:
            destino = db.destinos.find_one({"codigo": cod})
            if not destino:
                return jsonify({"error": f"Destino {cod} no encontrado"}), 404
            if destino.get("codigo_centro_ugr") != usuario_existente.get("codigo_centro"):
                return jsonify({"error": f"El destino {cod} no pertenece al centro del tutor"}), 400
            db.destinos.update_one({"codigo": cod}, {"$set": {"tutor_asignado": email}})

        # También procesar los eliminados que vienen explícitamente desde frontend
        eliminados = data.get("eliminados", [])
        for cod in eliminados:
            db.destinos.update_one({"codigo": cod}, {"$unset": {"tutor_asignado": ""}})

    resultado = db.usuarios.update_one({"email": email}, {"$set": update_data})

    if resultado.matched_count == 0:
        return jsonify({"error": "Usuario no encontrado"}), 404

    return jsonify({"mensaje": "Usuario actualizado correctamente"}), 200


@usuarios.route("/usuarios", methods=["GET"])
def listar_usuarios():
    docs = list(db.usuarios.find({}, {"_id": 0}))
    return jsonify(docs)


@usuarios.route('/usuarios/foto', methods=['POST'])
def subir_foto_usuario():
    if 'foto' not in request.files or 'email' not in request.form:
        return jsonify({'error': 'Faltan datos: foto o email'}), 400

    foto = request.files['foto']
    email = request.form['email']

    if not (foto and foto.filename.lower().endswith(('.png', '.jpg', '.jpeg', '.webp'))):
        return jsonify({'error': 'Tipo de archivo no permitido'}), 400

    usuario = db.usuarios.find_one({"email": email})
    if not usuario:
        return jsonify({"error": "Usuario no encontrado"}), 404

    carpeta = f"usuarios/{sanitize_folder(email)}"

    # borrar anterior si existe (y limpiar campo viejo foto_perfil)
    antiguo_public_id = usuario.get("foto_public_id")
    if antiguo_public_id:
        try:
            eliminar_imagen(antiguo_public_id)
        except Exception:
            pass

    try:
        res = subir_imagen(foto, carpeta=carpeta)  # -> {"url": ..., "public_id": ...}
    except Exception as e:
        return jsonify({"error": f"No se pudo subir la imagen: {str(e)}"}), 500

    if not res.get("url"):
        return jsonify({"error": "Cloudinary no devolvió URL"}), 502

    db.usuarios.update_one(
        {"email": email},
        {"$set": {
            "foto_url": res["url"],
            "foto_public_id": res.get("public_id", "")
        },
         "$unset": {
            "foto_perfil": ""   # ⚠️ limpia el campo antiguo, por si un componente lo sigue leyendo
         }}
    )

    # devuelve el usuario actualizado
    actualizado = db.usuarios.find_one({"email": email}, {"_id": 0})
    return jsonify({"url": res["url"], "usuario": actualizado}), 200


@usuarios.route('/usuarios/foto', methods=['DELETE'])
def eliminar_foto_usuario():
    email = request.args.get("email")
    if not email:
        return jsonify({"error": "Falta el email"}), 400

    usuario = db.usuarios.find_one({"email": email})
    if not usuario:
        return jsonify({"error": "Usuario no encontrado"}), 404

    public_id = usuario.get("foto_public_id")
    ok = True
    if public_id:
        try:
            ok = eliminar_imagen(public_id)
        except Exception:
            ok = False

    db.usuarios.update_one(
        {"email": email},
        {"$unset": {
            "foto_url": "",
            "foto_public_id": "",
            "foto_perfil": ""  # ⚠️ limpia también el viejo
        }}
    )

    actualizado = db.usuarios.find_one({"email": email}, {"_id": 0})
    return jsonify({
        "mensaje": "Foto eliminada correctamente" if ok else "Foto no encontrada en Cloudinary, campos limpiados",
        "usuario": actualizado
    }), 200



@usuarios.route("/usuarios/verificar", methods=["POST"])
def verificar_email():
    token = request.json.get("token")
    if not token:
        return jsonify({"error": "Token faltante"}), 400

    resultado = db.usuarios.update_one(
        {"token_verificacion": token},
        {"$set": {"verificado": True}, "$unset": {"token_verificacion": ""}}
    )

    if resultado.modified_count == 0:
        return jsonify({"error": "Token inválido"}), 400

    return jsonify({"mensaje": "Cuenta verificada correctamente"}), 200


@usuarios.route("/usuarios/email/<path:email>")
def obtener_usuario_por_email(email):
    usuario = db.usuarios.find_one({"email": email})
    if usuario:
        usuario["_id"] = str(usuario["_id"])
        return jsonify(usuario)
    else:
        return jsonify({}), 404

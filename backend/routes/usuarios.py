from flask import Blueprint, request, jsonify
from db import db
from models.usuario import crear_usuario
from datetime import datetime
from models.usuario import _notif, _notificar_admins
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


# @usuarios.route("/usuarios/<email>", methods=["PATCH"])
# def actualizar_usuario(email):
#     data = request.json
#     if not data:
#         return jsonify({"error": "Datos vacíos"}), 400

#     campos_permitidos = {
#         "nombre", "primer_apellido", "segundo_apellido", "rol", "codigo_centro", "grado", "codigo_grado",
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
@usuarios.route("/usuarios/<email>", methods=["PATCH"])
def actualizar_usuario(email):
    data = request.json
    if not data:
        return jsonify({"error": "Datos vacíos"}), 400

    # --- helper para crear notificaciones ---
    def crear_notificacion(usuario_email, titulo, mensaje="", tipo="info", enlace=None):
        db.notificaciones.insert_one({
            "usuario_email": usuario_email,
            "titulo": titulo,
            "mensaje": mensaje or "",
            "tipo": tipo,                       # p.ej. "destino", "renuncia", "info"
            "leida": False,
            "enlace": enlace,                   # ruta del front a la que quieres llevarlos
            "fecha_creacion": datetime.utcnow()
        })

    campos_permitidos = {
        "nombre", "primer_apellido", "segundo_apellido", "rol", "codigo_centro", "grado", "codigo_grado",
        "asignaturas_superadas", "creditos_superados", "idiomas", "destinos_asignados",
        "estado_proceso", "destino_confirmado", "destinos_favoritos"
    }

    update_data = {k: v for k, v in data.items() if k in campos_permitidos}
    if not update_data and not data.get("renunciar_destino"):
        return jsonify({"error": "No hay campos válidos para actualizar"}), 400

    # Guarda el documento actual para comparar y notificar con contexto
    usuario_actual = db.usuarios.find_one({"email": email})
    if not usuario_actual:
        return jsonify({"error": "Usuario no encontrado"}), 404

    # ---------------------------
    # CASO ESTUDIANTE
    # ---------------------------
    if (update_data.get("rol") or usuario_actual.get("rol")) == "estudiante":
        # 1) RENUNCIA explícita
        #    Front debería mandar: {"renunciar_destino": true}
        if data.get("renunciar_destino") is True:
            # Limpiar vínculo de destino
            update_data["destinos_asignados"] = []
            update_data["destino_confirmado"] = None
            update_data["estado_proceso"] = "sin destino"

            # Eliminar acuerdos del estudiante (opcional pero solicitado)
            db.acuerdos.delete_many({"email_estudiante": email})

            # Notificar al propio estudiante
            crear_notificacion(
                usuario_email=email,
                titulo="Has renunciado a tu destino",
                mensaje="Tu renuncia se ha registrado y se ha liberado tu plaza. Si fue un error, contacta con tu oficina internacional.",
                tipo="renuncia"
            )

            # Notificar al tutor asignado (si lo había) y a admins
            tutor_mail = usuario_actual.get("destino_confirmado", {}).get("tutor_asignado")
            if not tutor_mail and usuario_actual.get("destino_confirmado", {}).get("codigo"):
                # intenta mirar el destino en BD para obtener tutor
                dest = db.destinos.find_one({"codigo": usuario_actual["destino_confirmado"]["codigo"]})
                tutor_mail = dest.get("tutor_asignado") if dest else None

            if tutor_mail:
                crear_notificacion(
                    usuario_email=tutor_mail,
                    titulo=f"Renuncia de {usuario_actual.get('nombre','Un/a estudiante')}",
                    mensaje=f"El/la estudiante {usuario_actual.get('nombre','')} {usuario_actual.get('primer_apellido','')} ha renunciado a su destino.",
                    tipo="renuncia",
                    enlace=None  # puedes poner una ruta de panel de tutor si quieres
                )

            # Notificar a admins
            for admin in db.usuarios.find({"rol": "admin"}):
                crear_notificacion(
                    usuario_email=admin["email"],
                    titulo=f"Renuncia de destino: {usuario_actual.get('email')}",
                    mensaje="Se ha liberado una plaza por renuncia del estudiante.",
                    tipo="renuncia"
                )

        # 2) ASIGNACIÓN/CONFIRMACIÓN de destino por admin
        #    Se detecta si llega destinos_asignados y no estaba antes
        asignados = update_data.get("destinos_asignados", usuario_actual.get("destinos_asignados", []))
        if isinstance(asignados, list) and len(asignados) > 1:
            update_data["destinos_asignados"] = [asignados[0]]
            asignados = update_data["destinos_asignados"]

        if "destinos_asignados" in update_data:
            if asignados:
                destino_asignado = asignados[0]
                codigo_destino = destino_asignado.get("codigo")

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

                # Si antes no tenía destino confirmado, entendemos que es asignación nueva -> notifica
                antes_tenia_destino = bool(usuario_actual.get("destino_confirmado"))
                if not antes_tenia_destino:
                    # Notificar al estudiante
                    crear_notificacion(
                        usuario_email=email,
                        titulo="Se te ha asignado un destino",
                        mensaje=f"Universidad: {destino.get('nombre_uni','')} ({destino.get('codigo','')}). Revisa los detalles y comienza tu Acuerdo de Estudios.",
                        tipo="destino",
                        enlace=f"/destinos/{destino.get('nombre_uni','')}".replace(" ", "%20")
                    )
                    # Notificar al tutor asignado (si lo hay)
                    tutor_mail = destino.get("tutor_asignado")
                    if tutor_mail:
                        crear_notificacion(
                            usuario_email=tutor_mail,
                            titulo="Nuevo/a estudiante asignado/a a tu destino",
                            mensaje=f"Estudiante: {usuario_actual.get('nombre','')} {usuario_actual.get('primer_apellido','')} – Destino {destino.get('codigo','')}.",
                            tipo="destino"
                        )
            else:
                # Se envían destinos_asignados vacío (limpieza sin renuncia explícita)
                update_data["destino_confirmado"] = None
                update_data["estado_proceso"] = "sin destino"

    # ---------------------------
    # CASO TUTOR (ya lo tenías)
    # ---------------------------
    elif (update_data.get("rol") or usuario_actual.get("rol")) == "tutor":
        anteriores = {d["codigo"] for d in usuario_actual.get("destinos_asignados", [])}
        nuevos = {d["codigo"] for d in update_data.get("destinos_asignados", [])}

        quitados = anteriores - nuevos
        añadidos = nuevos - anteriores

        for cod in quitados:
            db.destinos.update_one({"codigo": cod}, {"$unset": {"tutor_asignado": ""}})

        for cod in añadidos:
            destino = db.destinos.find_one({"codigo": cod})
            if not destino:
                return jsonify({"error": f"Destino {cod} no encontrado"}), 404
            if destino.get("codigo_centro_ugr") != usuario_actual.get("codigo_centro"):
                return jsonify({"error": f"El destino {cod} no pertenece al centro del tutor"}), 400
            db.destinos.update_one({"codigo": cod}, {"$set": {"tutor_asignado": email}})

        # También procesar eliminados explícitos
        eliminados = data.get("eliminados", [])
        for cod in eliminados:
            db.destinos.update_one({"codigo": cod}, {"$unset": {"tutor_asignado": ""}})

    # --- aplicar cambios ---
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

@usuarios.route("/usuarios/<email>/renunciar-destino", methods=["POST"])
def renunciar_destino(email):
    usuario = db.usuarios.find_one({"email": email})
    if not usuario:
        return jsonify({"error": "Usuario no encontrado"}), 404
    if usuario.get("rol") != "estudiante":
        return jsonify({"error": "Solo estudiantes pueden renunciar al destino"}), 403

    dest_conf = usuario.get("destino_confirmado")
    if not dest_conf:
        return jsonify({"error": "No tienes destino confirmado"}), 400

    motivo = (request.json or {}).get("motivo", "").strip()

    # Traer destino completo (para tutor y nombre)
    destino = db.destinos.find_one({"codigo": dest_conf.get("codigo")}) or {}

    # Limpiar info del usuario relacionada con el destino
    db.usuarios.update_one(
        {"email": email},
        {"$set": {"estado_proceso": "sin destino"},
         "$unset": {"destino_confirmado": "", "destinos_asignados": ""}}
    )

    # (Opcional y recomendable) limpiar acuerdos de estudios del estudiante
    try:
        db.acuerdos.delete_many({"email_estudiante": email})
    except Exception:
        pass

    # Notificar al propio estudiante (confirmación)
    _notif(
        email,
        "Has renunciado a tu destino",
        f"Se ha registrado tu renuncia a {destino.get('nombre_uni','')}.",
        tipo="cambio",
        enlace="/estudiante/estado"
    )

    # Notificar a admins
    _notificar_admins(
        "Renuncia de destino",
        f"El estudiante {usuario.get('nombre','')} ({email}) ha renunciado a su destino {destino.get('nombre_uni','')} ({dest_conf.get('codigo','')})." + (f" Motivo: {motivo}" if motivo else "")
    )

    # Notificar al tutor si existía
    tutor_email = destino.get("tutor_asignado")
    if tutor_email:
        _notif(
            tutor_email,
            "Un estudiante ha renunciado al destino",
            f"El estudiante {usuario.get('nombre','')} ({email}) renuncia al destino {destino.get('nombre_uni','')} ({dest_conf.get('codigo','')}).",
            tipo="cambio",
            enlace="/tutor"
        )

    return jsonify({"mensaje": "Renuncia registrada y notificada"}), 200

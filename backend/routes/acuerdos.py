# from flask import Blueprint, request, jsonify, send_file
# from models.acuerdo import crear_acuerdo
# from db import db
# from datetime import datetime
# from utils.pdf import generar_pdf_acuerdo

# acuerdos = Blueprint("acuerdos", __name__)

# @acuerdos.route("/api/acuerdos", methods=["POST"])
# def crear_o_actualizar_acuerdo():
#     data = request.json
#     email = data.get("email_estudiante")
#     if not email:
#         return jsonify({"error": "email_estudiante requerido"}), 400

#     acuerdos_existentes = list(db.acuerdos.find({"email_estudiante": email}).sort("version", -1))
#     if acuerdos_existentes:
#         data["fecha_ultima_modificacion"] = datetime.utcnow()
#         db.acuerdos.update_one(
#             {"_id": acuerdos_existentes[0]["_id"]},
#             {"$set": data}
#         )
#         return jsonify({"msg": "Acuerdo actualizado"})
#     else:
#         data["version"] = 1
#         data["fecha_ultima_modificacion"] = datetime.utcnow()
#         db.acuerdos.insert_one(data)
#         return jsonify({"msg": "Acuerdo creado"})

# @acuerdos.route("/api/acuerdos/<email>", methods=["GET"])
# def listar_acuerdos_por_estudiante(email):
#     acuerdos = list(db.acuerdos.find({"email_estudiante": email}).sort("version", -1))
#     for a in acuerdos:
#         a["_id"] = str(a["_id"])
#     return jsonify(acuerdos)

# @acuerdos.route("/api/acuerdos/<email>/ultima", methods=["GET"])
# def acuerdo_ultimo(email):
#     acuerdo = db.acuerdos.find_one({"email_estudiante": email}, sort=[("version", -1)])
#     if not acuerdo:
#         return jsonify({"msg": "No hay acuerdo"}), 404
#     acuerdo["_id"] = str(acuerdo["_id"])
#     return jsonify(acuerdo)

# @acuerdos.route("/api/acuerdos/<email>", methods=["PUT"])
# def actualizar_acuerdo_existente(email):
#     data = request.json
#     data["fecha_ultima_modificacion"] = datetime.utcnow()

#     acuerdo_actual = db.acuerdos.find_one({"email_estudiante": email}, sort=[("version", -1)])
#     if not acuerdo_actual:
#         return jsonify({"error": "No hay acuerdo que actualizar"}), 404

#     db.acuerdos.update_one(
#         {"_id": acuerdo_actual["_id"]},
#         {"$set": data}
#     )
#     return jsonify({"msg": "Acuerdo actualizado"})

# @acuerdos.route("/api/acuerdos", methods=["PUT"])
# def crear_nueva_version_acuerdo():
#     data = request.json
#     email = data.get("email_estudiante")
#     if not email:
#         return jsonify({"error": "email_estudiante requerido"}), 400

#     acuerdos_existentes = list(db.acuerdos.find({"email_estudiante": email}).sort("version", -1))
#     nueva_version = 1 if not acuerdos_existentes else acuerdos_existentes[0]["version"] + 1

#     data["version"] = nueva_version
#     data["fecha_ultima_modificacion"] = datetime.utcnow()

#     db.acuerdos.insert_one(data)
#     return jsonify({"msg": f"Nueva versión {nueva_version} creada", "version": nueva_version})

# @acuerdos.route("/api/acuerdos/<email>/exportar", methods=["GET"])
# def exportar_pdf_acuerdo(email):
#     acuerdo = db.acuerdos.find_one({"email_estudiante": email}, sort=[("version", -1)])
#     if not acuerdo:
#         return jsonify({"error": "No hay acuerdo"}), 404

#     path = generar_pdf_acuerdo(acuerdo)
#     return send_file(path, as_attachment=True, download_name=f"AcuerdoEstudios_{email}.pdf")
from flask import Blueprint, request, jsonify, send_file
from db import db
from datetime import datetime
from models.acuerdo import crear_acuerdo
from utils.pdf import generar_pdf_acuerdo

acuerdos = Blueprint("acuerdos", __name__)

@acuerdos.route("/api/acuerdos", methods=["POST"])
def crear_o_actualizar_acuerdo():
    data = request.json
    email = data.get("email_estudiante")
    if not email:
        return jsonify({"error": "email_estudiante requerido"}), 400

    acuerdos_existentes = list(db.acuerdos.find({"email_estudiante": email}).sort("version", -1))
    if acuerdos_existentes:
        acuerdo = acuerdos_existentes[0]
        data["fecha_ultima_modificacion"] = datetime.utcnow()
        db.acuerdos.update_one(
            {"_id": acuerdo["_id"]},
            {"$set": {
                "bloques": data.get("bloques", []),
                "datos_personales": data.get("datos_personales", {}),
                "datos_movilidad": data.get("datos_movilidad", {}),
                "estado": data.get("estado", "borrador"),
                "fecha_ultima_modificacion": data["fecha_ultima_modificacion"]
            }}
        )
        return jsonify({"msg": "Acuerdo actualizado"})
    else:
        nuevo = crear_acuerdo(data)
        db.acuerdos.insert_one(nuevo)
        return jsonify({"msg": "Acuerdo creado"})

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

@acuerdos.route("/api/acuerdos/<email>", methods=["PUT"])
def actualizar_acuerdo_existente(email):
    data = request.json
    acuerdo_actual = db.acuerdos.find_one({"email_estudiante": email}, sort=[("version", -1)])
    if not acuerdo_actual:
        return jsonify({"error": "No hay acuerdo que actualizar"}), 404

    db.acuerdos.update_one(
        {"_id": acuerdo_actual["_id"]},
        {"$set": {
            "bloques": data.get("bloques", []),
            "datos_personales": data.get("datos_personales", {}),
            "datos_movilidad": data.get("datos_movilidad", {}),
            "estado": data.get("estado", "borrador"),
            "fecha_ultima_modificacion": datetime.utcnow()
        }}
    )
    return jsonify({"msg": "Acuerdo actualizado"})

@acuerdos.route("/api/acuerdos", methods=["PUT"])
def crear_nueva_version_acuerdo():
    data = request.json
    email = data.get("email_estudiante")
    if not email:
        return jsonify({"error": "email_estudiante requerido"}), 400

    acuerdos_existentes = list(db.acuerdos.find({"email_estudiante": email}).sort("version", -1))
    nueva_version = 1 if not acuerdos_existentes else acuerdos_existentes[0]["version"] + 1
    nuevo = crear_acuerdo(data, version=nueva_version)
    db.acuerdos.insert_one(nuevo)
    return jsonify({"msg": f"Nueva versión {nueva_version} creada", "version": nueva_version})

@acuerdos.route("/api/acuerdos/<email>/comentario", methods=["POST"])
def comentar_acuerdo(email):
    data = request.json
    comentario = data.get("comentarios_tutor", "")
    bloques_comentados = data.get("bloques", [])  # [{index, comentario}]
    nuevo_estado = data.get("estado", "comentado")

    acuerdo = db.acuerdos.find_one({"email_estudiante": email}, sort=[("version", -1)])
    if not acuerdo:
        return jsonify({"error": "Acuerdo no encontrado"}), 404

    for bloque in bloques_comentados:
        index = bloque.get("index")
        texto = bloque.get("comentario")
        if index is not None and 0 <= index < len(acuerdo["bloques"]):
            acuerdo["bloques"][index]["comentario_tutor"] = texto

    acuerdo["comentarios_tutor"] = comentario

    db.acuerdos.update_one(
        {"_id": acuerdo["_id"]},
        {"$set": {
            "bloques": acuerdo["bloques"],
            "comentarios_tutor": comentario,
            "estado": nuevo_estado,
            "fecha_ultima_modificacion": datetime.utcnow()
        }}
    )
    return jsonify({"msg": "Comentarios guardados"})

@acuerdos.route("/api/acuerdos/<email>/exportar", methods=["GET"])
def exportar_pdf_acuerdo(email):
    acuerdo = db.acuerdos.find_one({"email_estudiante": email}, sort=[("version", -1)])
    if not acuerdo:
        return jsonify({"error": "No hay acuerdo"}), 404
    path = generar_pdf_acuerdo(acuerdo)
    return send_file(path, as_attachment=True, download_name=f"AcuerdoEstudios_{email}.pdf")

@acuerdos.route("/api/tutor/<email>/dashboard", methods=["GET"])
def dashboard_tutor(email):
    tutor = db.usuarios.find_one({"email": email, "rol": "tutor"})
    if not tutor:
        return jsonify({"error": "Tutor no encontrado"}), 404

    codigos_destinos = [d["codigo"] for d in tutor.get("destinos_asignados", [])]

    estudiantes = list(db.usuarios.find({
        "rol": "estudiante",
        "destino_confirmado.codigo": {"$in": codigos_destinos}
    }))

    resultado = []

    for est in estudiantes:
        email_estudiante = est["email"]
        acuerdo = db.acuerdos.find_one(
            {"email_estudiante": email_estudiante},
            sort=[("version", -1)]
        )
        resultado.append({
            "nombre": est["nombre"],
            "email": est["email"],
            "apellido1": est.get("primer_apellido", ""),
            "apellido2": est.get("segundo_apellido", ""),
            "destino": est["destino_confirmado"]["nombre_uni"],
            "acuerdo": acuerdo["estado"] if acuerdo else "no enviado"
        })

    return jsonify({
        "destinos": tutor.get("destinos_asignados", []),
        "estudiantes": resultado
    })

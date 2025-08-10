from flask import Blueprint, request, jsonify, send_file
from db import db
from datetime import datetime
from models.acuerdo import crear_acuerdo
from utils.pdf import generar_pdf_acuerdo

acuerdos = Blueprint("acuerdos", __name__)


@acuerdos.route("/api/acuerdos", methods=["POST"])
def crear_version_nueva_o_primera():
    data = request.json
    email = data.get("email_estudiante")
    if not email:
        return jsonify({"error": "email_estudiante requerido"}), 400

    acuerdos_existentes = list(db.acuerdos.find({"email_estudiante": email}).sort("version", -1))
    nueva_version = 1 if not acuerdos_existentes else acuerdos_existentes[0]["version"] + 1

    nuevo_doc = crear_acuerdo(data, version=nueva_version)
    db.acuerdos.insert_one(nuevo_doc)
    return jsonify({"msg": f"Nueva versión {nueva_version} creada", "version": nueva_version})

@acuerdos.route("/api/acuerdos/<email>/versiones/<int:version>", methods=["GET"])
def obtener_version_concreta(email, version):
    doc = db.acuerdos.find_one({"email_estudiante": email, "version": version})
    if not doc:
        return jsonify({"error": "Versión no encontrada"}), 404
    doc["_id"] = str(doc["_id"])
    return jsonify(doc)

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

@acuerdos.route("/api/acuerdos/<email>/versiones/<int:version>", methods=["DELETE"])
def eliminar_version(email, version):
    doc = db.acuerdos.find_one({"email_estudiante": email, "version": version})
    if not doc:
        return jsonify({"error": "Versión no encontrada"}), 404

    # (Opcional) Evitar borrar si es la única versión
    restantes = db.acuerdos.count_documents({"email_estudiante": email})
    if restantes <= 1:
        return jsonify({"error": "No puedes borrar la única versión existente"}), 400

    db.acuerdos.delete_one({"_id": doc["_id"]})
    return jsonify({"msg": f"Versión {version} eliminada"}), 200


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

@acuerdos.route("/api/acuerdos/<email>/enviar", methods=["POST"])
def enviar_a_revision(email):
    doc = db.acuerdos.find_one({"email_estudiante": email}, sort=[("version", -1)])
    if not doc:
        return jsonify({"error": "Acuerdo no encontrado"}), 404
    db.acuerdos.update_one(
        {"_id": doc["_id"]},
        {"$set": {
            "estado": "enviado",
            "fecha_ultima_modificacion": datetime.utcnow()
        },
         "$push": {
            "historial": {
                "evento": "enviar",
                "por": email,
                "rol": "estudiante",
                "ts": datetime.utcnow(),
                "meta": {"version": doc["version"]}
            }
         }
        }
    )
    return jsonify({"msg": "Acuerdo enviado a revisión"})

# Tutor aprueba
@acuerdos.route("/api/acuerdos/<email>/aprobar", methods=["POST"])
def aprobar_acuerdo(email):
    tutor_email = request.args.get("tutor") or request.json.get("tutor")
    doc = db.acuerdos.find_one({"email_estudiante": email}, sort=[("version", -1)])
    if not doc:
        return jsonify({"error": "Acuerdo no encontrado"}), 404
    db.acuerdos.update_one(
        {"_id": doc["_id"]},
        {"$set": {
            "estado": "aprobado",
            "fecha_ultima_modificacion": datetime.utcnow(),
            "aprobado_en": datetime.utcnow(),
            "revisado_por": tutor_email
        },
         "$push": {
            "historial": {
                "evento": "aprobar",
                "por": tutor_email,
                "rol": "tutor",
                "ts": datetime.utcnow(),
                "meta": {"version": doc["version"]}
            }
         }
        }
    )
    return jsonify({"msg": "Acuerdo aprobado"})

# Tutor pide cambios (también podrías reciclar /comentario)
@acuerdos.route("/api/acuerdos/<email>/pedir-cambios", methods=["POST"])
def pedir_cambios(email):
    data = request.json or {}
    comentario = data.get("comentario", "")
    bloques_comentados = data.get("bloques", [])  # [{index, comentario}]
    doc = db.acuerdos.find_one({"email_estudiante": email}, sort=[("version", -1)])
    if not doc:
        return jsonify({"error": "Acuerdo no encontrado"}), 404

    # guardar comentarios por bloque
    bloques = doc.get("bloques", [])
    for b in bloques_comentados:
        i, txt = b.get("index"), b.get("comentario")
        if i is not None and 0 <= i < len(bloques):
            bloques[i]["comentario_tutor"] = txt

    db.acuerdos.update_one(
        {"_id": doc["_id"]},
        {"$set": {
            "estado": "comentado",
            "bloques": bloques,
            "comentarios_tutor": comentario,
            "fecha_ultima_modificacion": datetime.utcnow()
        },
         "$push": {
            "historial": {
                "evento": "pedir_cambios",
                "por": data.get("tutor"),
                "rol": "tutor",
                "ts": datetime.utcnow(),
                "meta": {"version": doc["version"]}
            }
         }
        }
    )
    return jsonify({"msg": "Cambios solicitados"})

# Hilo de mensajes (no tiempo real)
@acuerdos.route("/api/acuerdos/<email>/mensajes", methods=["GET"])
def listar_mensajes(email):
    doc = db.acuerdos.find_one({"email_estudiante": email}, sort=[("version", -1)], projection={"mensajes": 1, "estado":1, "version":1})
    if not doc:
        return jsonify({"error":"Acuerdo no encontrado"}), 404
    return jsonify({"version": doc["version"], "estado": doc["estado"], "mensajes": doc.get("mensajes", [])})

@acuerdos.route("/api/acuerdos/<email>/mensajes", methods=["POST"])
def crear_mensaje(email):
    data = request.json or {}
    texto = data.get("texto", "").strip()
    autor = data.get("autor")          # email autor
    rol = data.get("rol")              # "estudiante" | "tutor"
    if not texto or not autor or rol not in ("estudiante","tutor"):
        return jsonify({"error":"texto, autor y rol requeridos"}), 400

    doc = db.acuerdos.find_one({"email_estudiante": email}, sort=[("version", -1)])
    if not doc:
        return jsonify({"error":"Acuerdo no encontrado"}), 404

    evento = {
        "texto": texto,
        "autor": autor,
        "rol": rol,
        "ts": datetime.utcnow(),
        "version": doc["version"]
    }
    db.acuerdos.update_one(
        {"_id": doc["_id"]},
        {"$push": {
            "mensajes": evento,
            "historial": {"evento":"mensaje", "por": autor, "rol": rol, "ts": datetime.utcnow(), "meta": {"version": doc["version"]}}
        },
         "$set": {"fecha_ultima_modificacion": datetime.utcnow()}}
    )
    return jsonify({"msg":"Mensaje guardado"})

# Estado compacto (para badge)
@acuerdos.route("/api/acuerdos/<email>/estado", methods=["GET"])
def estado_compacto(email):
    doc = db.acuerdos.find_one({"email_estudiante": email}, sort=[("version", -1)], projection={"estado":1,"version":1})
    if not doc:
        return jsonify({"estado":"no_enviado"}), 200
    return jsonify({"estado": doc["estado"], "version": doc["version"]})


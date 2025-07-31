from datetime import datetime

def crear_acuerdo(data, version=1):
    return {
        "email_estudiante": data["email_estudiante"],
        "email_tutor": data.get("email_tutor"),
        "destino_codigo": data.get("destino_codigo"),
        "estado": data.get("estado", "borrador"),
        "version": version,
        "fecha_creacion": datetime.utcnow(),
        "fecha_ultima_modificacion": datetime.utcnow(),

        "datos_personales": {
            "dni": data.get("datos_personales", {}).get("dni", ""),
            "nombre": data.get("datos_personales", {}).get("nombre", ""),
            "apellidos": data.get("datos_personales", {}).get("apellidos", ""),
            "email": data.get("datos_personales", {}).get("email", "")
        },

        "datos_movilidad": {
            "curso_academico": data.get("datos_movilidad", {}).get("curso_academico", ""),
            "programa": data.get("datos_movilidad", {}).get("programa", ""),
            "periodo_estudios": data.get("datos_movilidad", {}).get("periodo_estudios", ""),
            "responsable": data.get("datos_movilidad", {}).get("responsable", ""),
            "tutor": data.get("datos_movilidad", {}).get("tutor", ""),
            "email_tutor": data.get("datos_movilidad", {}).get("email_tutor", ""),
            "nombre_universidad": data.get("datos_movilidad", {}).get("nombre_universidad", ""),
            "codigo_universidad": data.get("datos_movilidad", {}).get("codigo_universidad", ""),
            "pais": data.get("datos_movilidad", {}).get("pais", "")
        },

        "bloques": data.get("bloques", []),
        "comentarios_tutor": data.get("comentarios_tutor", "")
    }

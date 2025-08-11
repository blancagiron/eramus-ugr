from datetime import date, datetime
from db import db



def _notif(to_email, titulo, mensaje="", tipo="info", enlace=None):
    try:
        db.notificaciones.insert_one({
            "usuario_email": to_email,
            "titulo": titulo,
            "mensaje": mensaje or "",
            "tipo": tipo,
            "leida": False,
            "enlace": enlace,
            "fecha_creacion": datetime.utcnow(),
        })
    except Exception:
        pass

def _notificar_admins(titulo, mensaje="", tipo="info", enlace=None):
    for admin in db.usuarios.find({"rol": "admin"}, {"email": 1, "_id": 0}):
        _notif(admin["email"], titulo, mensaje, tipo=tipo, enlace=enlace)

def crear_usuario(data):
    return {
        "email": data["email"],
        "contraseña": data["contraseña"],
        "nombre": data["nombre"],
        "primer_apellido": data.get("primer_apellido", ""),
        "segundo_apellido": data.get("segundo_apellido", ""),
        "rol": data["rol"],
        "codigo_centro": data.get("codigo_centro"),
        "grado": data.get("grado"),
        "codigo_grado": data.get("codigo_grado"),
        "asignaturas_superadas": data.get("asignaturas_superadas", []),
        "creditos_superados": data.get("creditos_superados", 0),
        "idiomas": data.get("idiomas", []),
        "destinos_asignados": data.get("destinos_asignados", []),
        "foto_perfil": data.get("foto_perfil", None),
        "destinos_favoritos": data.get("destinos_favoritos", []),
        "estado_proceso": data.get("estado_proceso", "Proceso no iniciado"),
        "verificado": False,
        "token_verificacion": data.get("token_verificacion")
    }

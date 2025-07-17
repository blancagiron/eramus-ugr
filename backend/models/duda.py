from datetime import datetime

def crear_duda(data):
    return {
        "nombre": data.get("nombre", "").strip(),
        "apellidos": data.get("apellidos", "").strip(),
        "email": data.get("email", "").strip(),
        "mensaje": data.get("mensaje", "").strip(),
        "fecha_envio": datetime.utcnow().isoformat(),
        "respondida": False
    }

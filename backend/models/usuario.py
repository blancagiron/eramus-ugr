from datetime import date

def crear_usuario(data):
    return {
        "email": data["email"],
        "contraseña": data["contraseña"],
        "nombre": data["nombre"],
        "apellidos": data["apellidos"],
        "rol": data["rol"],
        "codigo_centro": data.get("codigo_centro"),
        "grado": data.get("grado"),
        "codigo_grado": data.get("codigo_grado"),
        "asignaturas_superadas": data.get("asignaturas_superadas", []),
        "creditos_superados": data.get("creditos_superados", 0),
        "idiomas": data.get("idiomas", []),
        "destinos_asignados": data.get("destinos_asignados", []),
        "foto_perfil": data.get("foto_perfil", None),
    }

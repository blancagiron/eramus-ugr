from datetime import date

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

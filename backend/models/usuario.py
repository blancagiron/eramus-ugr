from datetime import date

def crear_usuario(data):
    return {
        "email": data["email"],
        "contraseña": data["contraseña"],  
        "nombre": data["nombre"],
        "apellidos": data["apellidos"],
        "rol": data.get("rol", "estudiante"),
        "grado": data["grado"],
        "codigo_centro": data["codigo_centro"],
        "idiomas": [],
        "asignaturas_superadas": [],
        "grado": data["grado"],
        "codigo_grado": data["codigo_grado"],
        "creditos_superados": 0,
        "estado_proceso": "sin_destino",
        "destino_confirmado": None,
        "fecha_registro": data.get("fecha_registro", date.today().isoformat()),
        "destinos_asignados": [] 
    }

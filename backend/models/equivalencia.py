def crear_equivalencia(data):
    return {
        "grado": data["grado"],  # nombre completo
        "universidad_destino": data["universidad_destino"],
        "asignatura_destino": {
            "nombre": data["asignatura_destino"]["nombre"],
            "creditos": data["asignatura_destino"]["creditos"],
            "codigo": data["asignatura_destino"].get("codigo")
        },
        "asignaturas_ugr": data["asignaturas_ugr"],  # lista de dicts
        "tipo_reconocimiento": data["tipo_reconocimiento"]
    }

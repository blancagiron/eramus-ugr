def crear_destino(data):
    return {
        "nombre_uni": data["nombre_uni"],
        "pais": data["pais"],
        "requisitos_idioma": data["requisitos_idioma"],
        "plazas": data["plazas"],
        "asignaturas": data.get("asignaturas", [])  # Lista de dicts
    }

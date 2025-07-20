def crear_destino(data):
    return {
        "codigo": data["codigo"],
        "nombre_uni": data["nombre_uni"],
        "pais": data["pais"],
        "requisitos_idioma": data["requisitos_idioma"],
        "plazas": data["plazas"],
        "meses": data["meses"],
        "asignaturas": data.get("asignaturas", []),
        "web": data.get("web", ""),
        "lat": data.get("lat", None),
        "lng": data.get("lng", None),
        "observaciones": data.get("observaciones", "")
    }

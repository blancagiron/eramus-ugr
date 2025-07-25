def crear_destino(data):
    return {
        "codigo": data["codigo"],  # Código único del destino
        "nombre_uni": data["nombre_uni"],
        "pais": data["pais"],
        "requisitos_idioma": data["requisitos_idioma"],
        "plazas": data["plazas"],
        "meses": data["meses"],
        "web": data.get("web", ""),
        "lat": data.get("lat"),
        "lng": data.get("lng"),
        "descripcion_uni": data.get("descripcion_uni", ""),
        "descripcion_ciudad": data.get("descripcion_ciudad", ""),
        "info_contacto": {
            "email": data.get("info_contacto", {}).get("email", ""),
            "telefono": data.get("info_contacto", {}).get("telefono", "")
        },
        "asignaturas": data.get("asignaturas", []) , # Lista de dicts con código, nombre, créditos
        "tutor_asignado": data.get("tutor_asignado", None),
        "nota_minima": data.get("nota_minima", None),
        "observaciones": data.get("observaciones", ""),
        "cursos": data.get("cursos", [])
    }

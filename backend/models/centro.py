def crear_centro(data):
    return {
        "codigo": data["codigo"],
        "nombre": data["nombre"],
        "responsable_academico": data.get("responsable_academico", "")
    }
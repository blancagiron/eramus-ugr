def crear_asignatura(data):
    return {
        "codigo": data["codigo"],
        "nombre": data["nombre"],
        "creditos": data["creditos"],
        "curso": data["curso"],
        "centro": data["centro"],
        "grado": data["grado"],
        "codigo_grado": data["codigo_grado"],
        "tipo": data.get("tipo", "OPT"),
        "enlace": data.get("enlace", ""),
        "semestre": data.get("semestre", 1),
    }

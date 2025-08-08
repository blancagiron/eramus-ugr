from datetime import datetime

def to_float(value):
    try:
        return float(value)
    except (ValueError, TypeError):
        return None

def crear_experiencia(data):
    return {
        "codigo_grado": data.get("codigo_grado"),
        "codigo_erasmus": data.get("codigo_erasmus"),
        
        # Numéricas
        "valoracion_profesorado": to_float(data.get("valoracion_profesorado")),
        "facilidad_materia": to_float(data.get("facilidad_materia")),
        "dificultad_linguistica_apoyo": to_float(data.get("Dificultad lingüística y apoyo en su aprendizaje")),
        "coste_vida": to_float(data.get("coste_vida")),
        "alojamiento": to_float(data.get("Alojamiento")),
        "transporte": to_float(data.get("Transporte")),
        "seguridad": to_float(data.get("Seguridad")),
        "ocio": to_float(data.get("ocio")),
        "valoracion_instalaciones": to_float(data.get("valoracion_instalaciones")),
        "puntuacion_general": to_float(data.get("puntuacion_general")),

        # Textuales
        "evaluacion": data.get("Evaluación"),
        "lenguaje": data.get("Lenguaje"),
        "experiencia_academica": data.get("experiencia_académica"),
        "experiencia_ocio_alojamiento": data.get("experiencia_ocio_alojamiento"),
        "opinion_general": data.get("opinion general"),

        # Boolean
        "recomendado": str(data.get("recomendado", "")).strip().lower() in ["1", "true", "sí", "si"],

        # Fecha de inserción
        "fecha_registro": datetime.utcnow()
    }

from datetime import datetime
from bson import ObjectId

class Notificacion:
    def __init__(self, usuario_email, titulo, mensaje, tipo="info", leida=False, enlace=None):
        self.usuario_email = usuario_email  # a quién va dirigida
        self.titulo = titulo                # título breve
        self.mensaje = mensaje              # descripción
        self.tipo = tipo                    # info | warning | success | error
        self.leida = leida                   # boolean
        self.enlace = enlace                 # opcional (p.e. link a /estudiante/comunicacion)
        self.fecha_creacion = datetime.utcnow()

    def to_dict(self):
        return {
            "_id": str(ObjectId()),
            "usuario_email": self.usuario_email,
            "titulo": self.titulo,
            "mensaje": self.mensaje,
            "tipo": self.tipo,
            "leida": self.leida,
            "enlace": self.enlace,
            "fecha_creacion": self.fecha_creacion.isoformat()
        }

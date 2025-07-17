from flask import Blueprint, request, jsonify
import smtplib
from email.mime.text import MIMEText
from dotenv import load_dotenv
import os
import re

load_dotenv()
dudas_api = Blueprint("dudas", __name__)

EMAIL_ORIGEN = os.getenv("EMAIL_ORIGEN")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")
EMAIL_DESTINO = os.getenv("EMAIL_DESTINO")

@dudas_api.route("/api/dudas", methods=["POST"])
def enviar_duda():
    data = request.json
    nombre = data.get("nombre", "").strip()
    apellidos = data.get("apellidos", "").strip()
    email = data.get("email", "").strip()
    mensaje = data.get("mensaje", "").strip()

    if not all([nombre, apellidos, email, mensaje]):
        return jsonify({ "error": "Todos los campos son obligatorios." }), 400

    if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        return jsonify({ "error": "Correo electrónico no válido." }), 400

    contenido = f"""
Duda enviada desde el formulario de FAQ:

Nombre: {nombre} {apellidos}
Correo: {email}

Mensaje:
{mensaje}
    """

    msg = MIMEText(contenido)
    msg["Subject"] = f"Duda FAQ - {nombre} {apellidos}"
    msg["From"] = EMAIL_ORIGEN
    msg["To"] = EMAIL_DESTINO

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
            smtp.login(EMAIL_ORIGEN, EMAIL_PASSWORD)
            smtp.send_message(msg)
        return jsonify({ "message": "Duda enviada correctamente." }), 200
    except Exception as e:
        return jsonify({ "error": f"Error al enviar el mensaje: {str(e)}" }), 500

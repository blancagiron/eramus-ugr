import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def enviar_correo_verificacion(destinatario, token):
    email_user = os.getenv("EMAIL_ORIGEN")
    email_pass = os.getenv("EMAIL_PASSWORD")
    email_from = os.getenv("EMAIL_FROM")
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")

    enlace = f"{frontend_url}/verificar-email?token={token}"

    mensaje = MIMEMultipart("alternative")
    mensaje["Subject"] = "Verifica tu cuenta"
    mensaje["From"] = email_from
    mensaje["To"] = destinatario

    html = f"""
    <html>
        <body>
            <p>Hola,<br>
            Haz clic en el siguiente enlace para verificar tu correo electrónico:<br>
            <a href="{enlace}">Verificar cuenta</a>
            </p>
        </body>
    </html>
    """
    parte_html = MIMEText(html, "html")
    mensaje.attach(parte_html)

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as servidor:
            servidor.login(email_user, email_pass)
            servidor.sendmail(email_from, destinatario, mensaje.as_string())
        return True
    except Exception as e:
        print("Error al enviar correo:", e)
        return False

def enviar_correo_recuperacion(destinatario, enlace):
    email_user = os.getenv("EMAIL_ORIGEN")
    email_pass = os.getenv("EMAIL_PASSWORD")
    email_from = os.getenv("EMAIL_FROM")
    # FRONTEND_URL ya se resuelve al construir el enlace en el backend; aquí no hace falta

    mensaje = MIMEMultipart("alternative")
    mensaje["Subject"] = "Recupera tu contraseña"
    mensaje["From"] = email_from
    mensaje["To"] = destinatario

    html = f"""
    <html>
        <body>
            <p>Has solicitado restablecer tu contraseña.</p>
            <p>Haz clic en el siguiente enlace (válido 1 hora):</p>
            <p><a href="{enlace}">{enlace}</a></p>
            <p>Si no has sido tú, ignora este mensaje.</p>
        </body>
    </html>
    """
    parte_html = MIMEText(html, "html")
    mensaje.attach(parte_html)

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as servidor:
            servidor.login(email_user, email_pass)
            servidor.sendmail(email_from, destinatario, mensaje.as_string())
        return True
    except Exception as e:
        print("Error al enviar correo de recuperación:", e)
        return False
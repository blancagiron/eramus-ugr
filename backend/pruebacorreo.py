import smtplib
from email.mime.text import MIMEText

EMAIL_ORIGEN = "bgironricoy15@gmail.com"
EMAIL_FROM = "Erasmus Verificaciones <bgironricoy15@gmail.com>"
EMAIL_PASSWORD = "pxnpoqllfxndiqaj"  # sin espacios
EMAIL_DESTINO = "blaanca.giroon@gmail.com"

msg = MIMEText("Mensaje de prueba desde Flask")
msg["Subject"] = "Prueba SMTP"
msg["From"] = EMAIL_ORIGEN
msg["To"] = EMAIL_DESTINO

with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
    smtp.login(EMAIL_ORIGEN, EMAIL_PASSWORD)
    smtp.send_message(msg)

print("✅ Enviado")

from flask import Flask
from flask_cors import CORS
from flask import send_from_directory

from routes.usuarios import usuarios
from routes.destinos import destinos
from routes.equivalencias import equivalencias
from routes.dudas import dudas_api
from routes.preguntas import preguntas_api
from routes.grados import grados_api
from routes.asignaturas import asignaturas_api
from routes.centros import centros_api
from routes.acuerdos import acuerdos
from routes.experiencias import experiencias
import os

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads/perfiles'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/uploads/perfiles/<filename>')
def obtener_foto(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

app.register_blueprint(usuarios)
app.register_blueprint(destinos)
app.register_blueprint(equivalencias)
app.register_blueprint(dudas_api)
app.register_blueprint(preguntas_api)
app.register_blueprint(grados_api)
app.register_blueprint(asignaturas_api)
app.register_blueprint(centros_api)
app.register_blueprint(experiencias)
app.register_blueprint(acuerdos)


if __name__ == "__main__":
    app.run(debug=True)


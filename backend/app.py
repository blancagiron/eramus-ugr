from flask import Flask
from flask_cors import CORS
from routes.usuarios import usuarios
from routes.destinos import destinos
from routes.equivalencias import equivalencias
from routes.dudas import dudas_api
from routes.preguntas import preguntas_api
from routes.grados import grados_api
from routes.asignaturas import asignaturas_api
from routes.centros import centros_api

app = Flask(__name__)
CORS(app)

app.register_blueprint(usuarios)
app.register_blueprint(destinos)
app.register_blueprint(equivalencias)
app.register_blueprint(dudas_api)
app.register_blueprint(preguntas_api)
app.register_blueprint(grados_api)
app.register_blueprint(asignaturas_api)
app.register_blueprint(centros_api)


if __name__ == "__main__":
    app.run(debug=True)


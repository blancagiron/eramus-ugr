from flask import Blueprint, request, jsonify
from db import db
from models.asignatura import crear_asignatura
import csv

asignaturas_api = Blueprint("asignaturas_api", __name__)

# GET - Listar asignaturas con filtros
@asignaturas_api.route("/api/asignaturas", methods=["GET"])
def obtener_asignaturas():
    grado = request.args.get("codigo_grado")
    centro = request.args.get("centro")
    query = {}

    if grado:
        query["codigo_grado"] = grado
    if centro:
        query["centro"] = centro

    docs = list(db.asignaturas.find(query))
    for d in docs:
        d["_id"] = str(d["_id"])
    return jsonify(docs)

# POST - Crear asignatura individual
@asignaturas_api.route("/asignaturas", methods=["POST"])
def insertar_asignatura():
    data = request.json
    existente = db.asignaturas.find_one({"codigo": data["codigo"]})
    if existente:
        return jsonify({ "error": "Ya existe una asignatura con ese código" }), 409

    nueva = crear_asignatura(data)
    db.asignaturas.insert_one(nueva)
    return jsonify({ "mensaje": "Asignatura creada correctamente" }), 201

# PATCH - Editar asignatura por código
@asignaturas_api.route("/asignaturas/<codigo>", methods=["PATCH"])
def actualizar_asignatura(codigo):
    data = request.json
    update = {}

    campos = ["nombre", "creditos", "curso", "grado", "codigo_grado", "centro"]
    for campo in campos:
        if campo in data:
            update[campo] = data[campo]

    resultado = db.asignaturas.update_one({ "codigo": codigo }, { "$set": update })

    if resultado.matched_count == 0:
        return jsonify({ "error": "Asignatura no encontrada" }), 404

    return jsonify({ "mensaje": "Asignatura actualizada correctamente" })

# DELETE - Eliminar asignatura por código
@asignaturas_api.route("/asignaturas/<codigo>", methods=["DELETE"])
def eliminar_asignatura(codigo):
    resultado = db.asignaturas.delete_one({ "codigo": codigo })
    if resultado.deleted_count == 0:
        return jsonify({ "error": "Asignatura no encontrada" }), 404
    return jsonify({ "mensaje": "Asignatura eliminada correctamente" })

# DELETE - Eliminar todas las asignaturas por centro y/o grado
@asignaturas_api.route("/asignaturas", methods=["DELETE"])
def eliminar_asignaturas_en_lote():
    grado = request.args.get("codigo_grado")
    centro = request.args.get("centro")

    query = {}
    if grado:
        query["codigo_grado"] = grado
    if centro:
        query["centro"] = centro

    if not query:
        return jsonify({ "error": "Se requiere al menos centro o grado" }), 400

    resultado = db.asignaturas.delete_many(query)
    return jsonify({ "mensaje": f"{resultado.deleted_count} asignaturas eliminadas" })

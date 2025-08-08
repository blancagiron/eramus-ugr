# insertar_experiencias.py
import pandas as pd
from pymongo import MongoClient
import sys
from models.experiencia import crear_experiencia
import math

if len(sys.argv) != 2:
    print("Uso: python insertar_experiencias.py <archivo.csv>")
    sys.exit(1)

archivo = sys.argv[1]

# Conexión a MongoDB
client = MongoClient("mongodb://root:example@localhost:27017")
db = client["erasmus"]
coleccion = db["experiencias"]

# Cargar CSV
df = pd.read_csv(archivo)

# Lista de columnas numéricas
columnas_numericas = [
    "valoracion_profesorado",
    "facilidad_materia",
    "dificultad_linguistica_apoyo",
    "coste_vida",
    "alojamiento",
    "transporte",
    "seguridad",
    "ocio",
    "valoracion_instalaciones",
    "puntuacion_general"
]

# Función para limpiar NaN → None (numérico) o "N/A" (texto)
def limpiar_valor(columna, valor):
    if isinstance(valor, float) and math.isnan(valor):
        return None if columna in columnas_numericas else "N/A"
    return valor

# Procesar e insertar
documentos = []
for _, row in df.iterrows():
    row_limpia = {col: limpiar_valor(col, val) for col, val in row.items()}
    doc = crear_experiencia(row_limpia)
    documentos.append(doc)

if documentos:
    coleccion.insert_many(documentos)
    print(f"✅ {len(documentos)} experiencias insertadas desde {archivo}.")
else:
    print("⚠ No se encontraron experiencias en el CSV.")

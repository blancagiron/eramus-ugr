import pandas as pd
from pymongo import MongoClient
import sys

# Uso esperado:
# python insertar_asignaturas.py archivo.csv GII 296 015

if len(sys.argv) != 5:
    print("Uso: python insertar_asignaturas.py <archivo.csv> <sigla_grado> <codigo_grado> <codigo_centro>")
    sys.exit(1)

archivo = sys.argv[1]
sigla_grado = sys.argv[2]
codigo_grado = sys.argv[3]
codigo_centro = sys.argv[4]

# Conexión a MongoDB
client = MongoClient("mongodb://root:example@localhost:27017")
db = client["erasmus"]
coleccion = db["asignaturas"]

# Cargar CSV
df = pd.read_csv(archivo)

# Procesar e insertar
documentos = []
for _, row in df.iterrows():
    documentos.append({
        "codigo": row["Código"],
        "nombre": row["Nombre"],
        "creditos": row["Créditos"],
        "curso": int(row["Curso"]),
        "grado": sigla_grado,
        "codigo_grado": codigo_grado,
        "centro": codigo_centro
    })

coleccion.insert_many(documentos)
print(f"{len(documentos)} asignaturas insertadas para {sigla_grado} ({codigo_grado}) en centro {codigo_centro}.")

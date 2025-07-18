import sys
from pymongo import MongoClient

# Uso: python insertar_grado.py <codigo> <sigla> "<nombre>"

if len(sys.argv) != 5:
    print("Uso: python insertar_grado.py <codigo> <sigla> \"<nombre del grado>\" <codigo_centro>")
    sys.exit(1)

codigo = sys.argv[1]
sigla = sys.argv[2]
nombre = sys.argv[3]
codigo_centro = sys.argv[4]

# Conexión a MongoDB
client = MongoClient("mongodb://root:example@localhost:27017")
db = client["erasmus"]
coleccion = db["grados"]

# Verificar si ya existe
if coleccion.find_one({"codigo": codigo}):
    print(f"❌ Ya existe un grado con el código {codigo}")
else:
    doc = {
        "codigo": codigo,
        "sigla": sigla,
        "nombre": nombre,
        "codigo_centro": codigo_centro
    }
    coleccion.insert_one(doc)
    print(f"✅ Grado insertado: {sigla} ({codigo}) - {nombre} - Centro: {codigo_centro}")

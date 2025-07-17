from pymongo import MongoClient

# Conexión local
client = MongoClient("mongodb://root:example@localhost:27017")

# Base de datos y colección
db = client["erasmus"]
coleccion = db["preguntas_frecuentes"]

# Preguntas a insertar
preguntas = [
    {
        "pregunta": "¿Qué es el programa Erasmus?",
        "respuesta": "Es una iniciativa europea para promover la movilidad estudiantil.",
        "categoria": "general",
        "importante": True
    },
    {
        "pregunta": "¿Qué requisitos debo cumplir para solicitar una beca Erasmus?",
        "respuesta": "Debes estar matriculado en la UGR, haber superado un número mínimo de créditos y tener un nivel de idioma adecuado para el destino elegido.",
        "categoria": "solicitudes",
        "importante": True
    },
    {
        "pregunta": "¿Dónde puedo consultar los destinos disponibles para mi titulación?",
        "respuesta": "En la plataforma Erasmus-UGR puedes buscar destinos filtrando por idioma, país, curso y asignaturas disponibles.",
        "categoria": "general",
        "importante": False
    },
    {
        "pregunta": "¿Qué documentos debo presentar antes de irme de Erasmus?",
        "respuesta": "Debes presentar el Acuerdo de Estudios aprobado, la solicitud de movilidad y el compromiso de calidad, entre otros.",
        "categoria": "documentación",
        "importante": False
    },
    {
        "pregunta": "¿Puedo modificar mi acuerdo de estudios una vez aprobado?",
        "respuesta": "Sí, puedes solicitar una modificación, pero debe ser aprobada por tu tutor antes de hacerse efectiva.",
        "categoria": "acuerdo",
        "importante": True
    },
    {
        "pregunta": "¿Qué asignaturas puedo convalidar en mi destino Erasmus?",
        "respuesta": "Puedes buscar convalidaciones ya aprobadas o proponer nuevas asignaturas para su revisión por parte del tutor.",
        "categoria": "convalidaciones",
        "importante": True
    },
    {
        "pregunta": "¿Qué ocurre si una asignatura no aparece en la base de datos de convalidaciones?",
        "respuesta": "Puedes incluirla en tu acuerdo de estudios y será revisada por el tutor correspondiente.",
        "categoria": "convalidaciones",
        "importante": False
    },
    {
        "pregunta": "¿Cuándo se realiza la convocatoria Erasmus en la UGR?",
        "respuesta": "Suele abrirse en noviembre o diciembre para el curso siguiente. Debes consultar la web oficial o la plataforma.",
        "categoria": "solicitudes",
        "importante": True
    },
    {
        "pregunta": "¿Qué nivel de idioma necesito para ir a una universidad extranjera?",
        "respuesta": "Depende del destino. Cada universidad tiene sus propios requisitos, que puedes consultar en su ficha dentro de la plataforma.",
        "categoria": "idiomas",
        "importante": True
    },
    {
        "pregunta": "¿Puedo hacer prácticas Erasmus además de estudios?",
        "respuesta": "Sí, puedes optar a ambas modalidades, pero debes presentar solicitudes separadas y cumplir los requisitos específicos.",
        "categoria": "general",
        "importante": False
    }
]

# Inserción
result = coleccion.insert_many(preguntas)
print(f"✅ Se insertaron {len(result.inserted_ids)} preguntas correctamente.")

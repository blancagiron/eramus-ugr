# import cloudinary
# import cloudinary.uploader
# import os

# cloudinary.config(
#     cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
#     api_key=os.getenv("CLOUDINARY_API_KEY"),
#     api_secret=os.getenv("CLOUDINARY_API_SECRET")
# )

# def subir_imagen(file, carpeta="destinos"):
#     resultado = cloudinary.uploader.upload(
#         file,
#         folder=carpeta,
#         use_filename=False,
#         unique_filename=True,
#         overwrite=False,
#         resource_type="image"
#     )
#     return resultado.get("secure_url")
import cloudinary
import cloudinary.uploader
import os
import re

# Configuración de Cloudinary desde variables de entorno
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)

def sanitize_folder(name: str) -> str:
    """
    Devuelve un nombre seguro para usar como parte de la ruta/carpeta
    en Cloudinary (solo [a-zA-Z0-9/_-], en minúsculas).
    """
    return re.sub(r'[^a-zA-Z0-9/_-]+', '_', (name or '').lower())

def subir_imagen(file, carpeta: str = "destinos", public_id: str | None = None) -> dict:
    """
    Sube una imagen a Cloudinary en la carpeta indicada.
    - Si 'public_id' se pasa, Cloudinary guardará con ese ID (sin incluir la carpeta).
    - Devuelve {'url': secure_url, 'public_id': public_id_completo}
    """
    carpeta = sanitize_folder(carpeta)

    options = {
        "folder": carpeta,
        "use_filename": False,     # que NO use el nombre original
        "unique_filename": True,   # que SÍ genere nombre único
        "overwrite": False,        # no sobrescribir
        "resource_type": "image"
    }

    if public_id:
        # public_id NO debe incluir la carpeta
        options["public_id"] = public_id

    res = cloudinary.uploader.upload(file, **options)

    return {
        "url": res.get("secure_url"),
        "public_id": res.get("public_id")  # p.ej. usuarios/juan_perez/xyz123
    }

def eliminar_imagen(public_id: str) -> bool:
    """
    Elimina una imagen por su public_id completo (incluida la carpeta).
    Devuelve True si Cloudinary responde 'ok' o 'not found'.
    """
    if not public_id:
        return False
    try:
        out = cloudinary.uploader.destroy(public_id, resource_type="image")
        return out.get("result") in ("ok", "not found")
    except Exception:
        return False

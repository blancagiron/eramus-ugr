import cloudinary
import cloudinary.uploader
import os

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)

def subir_imagen(file, carpeta="destinos"):
    resultado = cloudinary.uploader.upload(
        file,
        folder=carpeta,
        use_filename=True,
        unique_filename=False,
        overwrite=True,
        resource_type="image"
    )
    return resultado.get("secure_url")

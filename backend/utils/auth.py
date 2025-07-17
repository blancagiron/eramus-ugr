import bcrypt

def hash_contraseña(password):
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def verificar_contraseña(password, hashed):
    return bcrypt.checkpw(password.encode(), hashed.encode())

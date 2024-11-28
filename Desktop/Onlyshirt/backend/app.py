from flask import Flask, request, jsonify
from flask_cors import CORS
import pymysql
from werkzeug.security import generate_password_hash, check_password_hash
from dotenv import load_dotenv
import os
import openai

# Cargar variables de entorno
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configurar conexión a la base de datos
def get_db_connection():
    connection = pymysql.connect(
        host='localhost',
        user='root',
        password='',
        database='onlyshirt',
        cursorclass=pymysql.cursors.DictCursor
    )
    return connection

# Configurar la clave API de OpenAI
openai.api_key = os.getenv("OPENAI_API_KEY")

# Rutas de prueba
@app.route('/api/test', methods=['GET'])
def test():
    return jsonify({"message": "Flask está funcionando correctamente."}), 200

# Ruta para registro de usuarios
@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            hashed_password = generate_password_hash(data['password'])
            sql = """
                INSERT INTO users (name, email, phone, dob, password, role)
                VALUES (%s, %s, %s, %s, %s, %s)
            """
            cursor.execute(sql, (
                data['name'],
                data['email'],
                data['phone'],
                data['dob'],
                hashed_password,
                'client'  # Por defecto, los nuevos usuarios son clientes
            ))
        connection.commit()
        return jsonify({"message": "Usuario registrado exitosamente"}), 201
    except Exception as e:
        print(f"Error en registro: {str(e)}")  # Log del error en servidor
        return jsonify({"error": str(e)}), 400
    finally:
        connection.close()

# Ruta para inicio de sesión
@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            sql = "SELECT * FROM users WHERE email = %s"
            cursor.execute(sql, (data['email'],))
            user = cursor.fetchone()
            if user and check_password_hash(user['password'], data['password']):
                return jsonify({
                    "message": "Inicio de sesión exitoso",
                    "role": user['role']
                }), 200
            return jsonify({"error": "Correo o contraseña incorrectos"}), 401
    except Exception as e:
        print(f"Error en login: {str(e)}")  # Log del error en servidor
        return jsonify({"error": str(e)}), 400
    finally:
        connection.close()

# Ruta para generar imágenes con OpenAI
@app.route('/api/generate-image', methods=['POST'])
def generate_image():
    data = request.json
    prompt = data.get('prompt', '')
    if not prompt:
        return jsonify({"error": "El prompt es obligatorio"}), 400
    try:
        # Llama a la API de OpenAI para generar una imagen
        response = openai.Image.create(
            prompt=prompt,
            n=1,
            size="512x512"  # Tamaño de la imagen
        )
        return jsonify({"image_url": response['data'][0]['url']}), 200
    except Exception as e:
        print(f"Error en generación de imagen: {str(e)}")  # Log del error en servidor
        return jsonify({"error": str(e)}), 500



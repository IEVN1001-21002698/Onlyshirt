from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import os
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configurar la clave API de OpenAI desde el archivo .env
openai.api_key = os.getenv("OPENAI_API_KEY")

# Ruta de prueba
@app.route('/test', methods=['GET'])
def test():
    return jsonify({"message": "Flask está funcionando correctamente."})

# Ruta para generar imágenes
@app.route('/generate-image', methods=['POST'])
def generate_image():
    data = request.json
    prompt = data.get('prompt', '')
    try:
        # Llama a la API de OpenAI para generar la imagen
        response = openai.Image.create(
            prompt=prompt,
            n=1,
            size="512x512"  # Tamaño de la imagen
        )
        return jsonify({"image_url": response['data'][0]['url']})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)

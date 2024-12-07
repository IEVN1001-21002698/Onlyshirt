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



""" --------------------------------------------------------------- """


@app.route('/api/ventas_por_producto', methods=['GET'])
def ventas_por_producto():
    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            # Consulta para obtener el resumen de ventas
            sql = """
                SELECT 
                    p.nombre_producto,
                    COALESCE(SUM(vp.cantidad), 0) AS cantidad_vendida,
                    COALESCE(SUM(vp.subtotal), 0) AS total_generado
                FROM productos p
                LEFT JOIN venta_productos vp ON p.producto_id = vp.producto_id
                GROUP BY p.producto_id, p.nombre_producto
                ORDER BY total_generado DESC;
            """
            cursor.execute(sql)
            resultados = cursor.fetchall()
            
            # Verificar si hay datos
            if not resultados:
                return jsonify({"message": "No hay datos de ventas registrados"}), 404

        return jsonify(resultados), 200

    except Exception as e:
        print(f"Error en ventas_por_producto: {str(e)}")  # Log del error
        return jsonify({"error": "Ocurrió un error al procesar la solicitud", "details": str(e)}), 500

    finally:
        connection.close()

""" --------------------------------------------------------------- """


@app.route('/api/registro_usuarios_diario', methods=['GET'])
def registro_usuarios_diario():
    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            # Consulta para obtener la cantidad de usuarios registrados por día
            sql = """
        SELECT 
            dob AS fecha,
            COUNT(id) AS cantidad_registrados
        FROM users
        WHERE role = 'client'  -- Filtrar solo usuarios con rol cliente
        GROUP BY dob
        ORDER BY fecha DESC;
    """

            cursor.execute(sql)
            resultados = cursor.fetchall()
            
            # Verificar si hay datos
            if not resultados:
                return jsonify({"message": "No hay registros de usuarios"}), 404

        return jsonify(resultados), 200

    except Exception as e:
        print(f"Error en registro_usuarios_diario: {str(e)}")  # Log del error
        return jsonify({"error": "Ocurrió un error al procesar la solicitud", "details": str(e)}), 500

    finally:
        connection.close()
""" ------------------------------------------------------------------ """

@app.route('/api/ventas_diarias_cliente', methods=['GET'])
def ventas_diarias_cliente():
    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            # Consulta para obtener las ventas por día, solo para clientes
            sql = """
                SELECT 
                    DATE(v.fecha_venta) AS fecha,  -- Convertir la fecha a formato de solo día
                    SUM(v.total) AS total_ventas
                FROM ventas v
                JOIN users u ON v.cliente_id = u.id
                WHERE u.role = 'client'  -- Filtrar solo clientes
                GROUP BY DATE(v.fecha_venta)
                ORDER BY fecha DESC;
            """
            
            cursor.execute(sql)
            resultados = cursor.fetchall()
            
            # Verificar si hay datos
            if not resultados:
                return jsonify({"message": "No hay ventas de clientes en los registros"}), 404

        return jsonify(resultados), 200

    except Exception as e:
        print(f"Error en ventas_diarias_cliente: {str(e)}")  # Log del error
        return jsonify({"error": "Ocurrió un error al procesar la solicitud", "details": str(e)}), 500

    finally:
        connection.close()

        """ ---------------------------------------------------------------------------------------------- """

@app.route('/api/reporte_general', methods=['GET'])
def reporte_general():
    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            # Consulta para obtener datos generales de la base de datos
            sql = """
                SELECT
                    (SELECT COUNT(*) FROM users WHERE role = 'client') AS total_clientes,  -- Número de clientes
                    (SELECT COUNT(*) FROM productos) AS total_productos,  -- Número de productos registrados
                    (SELECT COUNT(*) FROM ventas) AS total_ventas,  -- Total de ventas realizadas
                    (SELECT SUM(total) FROM ventas) AS total_ventas_acumuladas,  -- Total acumulado de ventas
                    (SELECT COUNT(*) FROM venta_productos) AS total_productos_vendidos,  -- Cantidad total de productos vendidos
                    (SELECT COUNT(DISTINCT cliente_id) FROM ventas) AS total_clientes_ventas  -- Número de clientes que han realizado compras
            """
            
            cursor.execute(sql)
            resultados = cursor.fetchall()
            
            # Verificar si hay datos
            if not resultados:
                return jsonify({"message": "No se pudieron obtener los datos generales"}), 404

        return jsonify(resultados[0]), 200

    except Exception as e:
        print(f"Error en reporte_general: {str(e)}")  # Log del error
        return jsonify({"error": "Ocurrió un error al procesar la solicitud", "details": str(e)}), 500

    finally:
        connection.close()


        """ ---------------------------------------------------------------------------------------------- """


@app.route('/api/clientes_ventas', methods=['GET'])
def clientes_ventas():
    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            # Consulta para obtener los datos del total de clientes y clientes con ventas
            sql = """
                SELECT
                    (SELECT COUNT(*) FROM users WHERE role = 'client') AS total_clientes,  -- Número total de clientes
                    (SELECT COUNT(DISTINCT cliente_id) FROM ventas) AS total_clientes_ventas  -- Clientes que han realizado compras
            """
            
            cursor.execute(sql)
            resultados = cursor.fetchall()
            
            # Verificar si se obtuvieron los resultados correctamente
            if not resultados:
                return jsonify({"message": "No se pudieron obtener los datos de clientes con ventas"}), 404

        return jsonify(resultados[0]), 200

    except Exception as e:
        print(f"Error en clientes_ventas: {str(e)}")  # Log del error
        return jsonify({"error": "Ocurrió un error al procesar la solicitud", "details": str(e)}), 500

    finally:
        connection.close()


        """ ---------------------------------------------------------------------------------------------- """
@app.route('/api/productos_mas_vendidos', methods=['GET'])
def productos_mas_vendidos():
    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            sql = """
                SELECT 
                    p.nombre_producto,
                    SUM(vp.cantidad) AS total_vendido
                FROM venta_productos vp
                JOIN productos p ON vp.producto_id = p.producto_id
                GROUP BY vp.producto_id
                ORDER BY total_vendido DESC;
            """
            cursor.execute(sql)
            resultados = cursor.fetchall()

            if not resultados:
                return jsonify({"message": "No se encontraron datos de productos vendidos"}), 404

        return jsonify(resultados), 200

    except Exception as e:
        print(f"Error en productos_mas_vendidos: {str(e)}")
        return jsonify({"error": "Ocurrió un error al procesar la solicitud", "details": str(e)}), 500

    finally:
        connection.close()


        """ ---------------------------------------------------------------------------------------------- """

# Ruta para obtener usuarios con rol de 'client'
@app.route('/api/usuarios_clientes', methods=['GET'])
def usuarios_clientes():
    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            # Consulta para obtener los usuarios con rol de 'client'
            sql = """
                SELECT id, name, email, phone, dob
                FROM users
                WHERE role = 'client'
                ORDER BY name;
            """
            cursor.execute(sql)
            resultados = cursor.fetchall()

            # Verificar si se obtuvieron datos
            if not resultados:
                return jsonify({"message": "No hay usuarios con el rol de cliente"}), 404

        return jsonify(resultados), 200

    except Exception as e:
        print(f"Error en usuarios_clientes: {str(e)}")  # Log del error
        return jsonify({"error": "Ocurrió un error al procesar la solicitud", "details": str(e)}), 500

    finally:
        connection.close()

        
        """ ---------------------------------------------------------------------------------------------- """

# Ruta para obtener usuarios con rol de 'client'
@app.route('/api/usuarios_admin', methods=['GET'])
def usuarios_admin():
    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            # Consulta para obtener los usuarios con rol de 'client'
            sql = """
                SELECT id, name, email, phone, dob
                FROM users
                WHERE role = 'admin'
                ORDER BY name;
            """
            cursor.execute(sql)
            resultados = cursor.fetchall()

            # Verificar si se obtuvieron datos
            if not resultados:
                return jsonify({"message": "No hay usuarios con el rol de admin"}), 404

        return jsonify(resultados), 200

    except Exception as e:
        print(f"Error en usuarios_admin: {str(e)}")  # Log del error
        return jsonify({"error": "Ocurrió un error al procesar la solicitud", "details": str(e)}), 500

    finally:
        connection.close()
        """ ---------------------------------------------------------------------------------------------- """

@app.route('/api/productos_sin_ventas', methods=['GET'])
def productos_sin_ventas():
    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            sql = """
                SELECT p.producto_id, p.nombre_producto
                FROM productos p
                LEFT JOIN venta_productos vp ON p.producto_id = vp.producto_id
                WHERE vp.venta_id IS NULL;
            """
            cursor.execute(sql)
            resultados = cursor.fetchall()

            # Verificar si se obtuvieron productos sin ventas
            if not resultados:
                return jsonify({"message": "No hay productos sin ventas"}), 404

        return jsonify(resultados), 200

    except Exception as e:
        print(f"Error en productos_sin_ventas: {str(e)}")
        return jsonify({"error": "Ocurrió un error al procesar la solicitud", "details": str(e)}), 500

    finally:
        connection.close()









if __name__ == '__main__':
    app.run(debug=True)


import pymysql

# Configuración de la conexión a la base de datos
connection = pymysql.connect(
    host='localhost',
    user='root',  # Cambia esto si tu usuario de MySQL es diferente
    password='',  # Cambia esto si tienes una contraseña configurada
    database='onlyshirt',  # Reemplaza con el nombre de tu base de datos
    cursorclass=pymysql.cursors.DictCursor
)

# Probar la conexión
try:
    with connection.cursor() as cursor:
        cursor.execute("SELECT 1")
        print("Conexión exitosa a la base de datos.")
except Exception as e:
    print("Error al conectar a la base de datos:", str(e))
finally:
    connection.close()

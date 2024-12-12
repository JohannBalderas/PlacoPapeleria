Algunos componentes del proyecto tienen nombres peculiares, como adopta y adopciones.service.ts,
esto se debe a que para la realización del proyecto se tomó como base la interfaz de un proyecto llamado refugioDIJK realizado por nosotros anteriormente .

A la tabla de Venta se le agregó una columna para registrar el id de la sucursal donde se hizo la venta, esto con el fin de hacer un manejo correcto de los inventarios.
Si en la tabla de venta hay columnas con id de sucursal 0, es porque la columna se agregó después de llenar las tablas con el faker.

La tabla forma_pago es la única que no tiene 10 registros ya que consideramos redundante e innecesario agregar 10 métodos de pago.

Para iniciar el servidor abrir una terminal y ejecutar: cd Backend, y después ejecutar: node server.js.
Para iniciar la pagina web abrir otra terminal y ejecutar: ng serve --o.

Antes de ejecutar el sistema, considere que debe hacer una modificación en el archivo server.js,
en las líneas 9 a la 15 debemos asegurar que estén presentes las credenciales válidas, ejemplo:
Host: ‘mi_direccion’ 
User: ‘mi_usuario’
Password: ‘mi_contraseña’
Database: ‘papeleria’
El usuario y la contraseña son las de MySQL.

Dentro del mismo archivo server.js en las líneas 724 a 727 se realiza la asignación del puerto para hacer la conexión,el puerto por defecto es el 3000. 
El valor del puerto debe ser el mismo en este archivo (server.js) y en el archivo adopciones.services.ts (línea 9).

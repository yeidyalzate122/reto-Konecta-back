# Reto Konecta - Back-End Node.js

## Breve Descripción

Este proyecto fue desarrollado para el reto de Konecta. La aplicación presenta una pantalla de inicio de sesión donde se requiere ingresar las credenciales de correo electrónico y contraseña, junto con la verificación de un Hcaptcha. Para acceder al sistema, es necesario estar registrado previamente; de lo contrario, no será posible iniciar sesión, ya que el usuario no será encontrado en la base de datos.

El sistema implementa la validación mediante tokens JWT, los cuales se generan al iniciar sesión y se utilizan para autorizar cualquier otra acción dentro de la plataforma.

El proyecto está dividido en dos módulos principales: "Gestión de Usuarios" y "Radicar Venta". La visibilidad de cada módulo dependerá del perfil asignado al usuario durante el registro.

Toda la información persistente se almacena en una base de datos PostgreSQL.

## Programas y sus versiones

* **Node.js:** v20.11.1
* **PostgreSQL:** 17.4-1

## Pasos para ejecutar el proyecto

1.  **Descarga el proyecto:** Clona o descarga el repositorio en una carpeta local llamada `node`.
2.  **Navega a la carpeta del proyecto:** Abre tu terminal y dirígete a la carpeta `node` donde se encuentra el proyecto.
3.  **Instala las dependencias:** Ejecuta el siguiente comando para instalar todas las dependencias listadas en el archivo `package.json`:

    ```bash
    npm install
    ```

    Espera a que el proceso de instalación finalice.
4.  **Ejecuta el proyecto:** Una vez que las dependencias estén instaladas, ejecuta el siguiente comando para iniciar el servidor de desarrollo:

    ```bash
    npm run dev
    ```

    Después de unos momentos, se ejecuta el servidor en tu terminal.
    `http://localhost:5000`.

## Base de datos

Para ejecutar la base de datos, debes tener PostgreSQL instalado previamente.

1.  **Crea la base de datos:** Crea una base de datos con el nombre `Konecta`.
2.  **Configura las credenciales:** Asegúrate de que las siguientes credenciales coincidan con la configuración de tu base de datos:

    ```
    DB_USER=postgres
    DB_PASSWORD=123
    DB_HOST=localhost
    DB_PORT=5432
    DB_DATABASE=Konecta
    ```

3.  **Ejecuta las consultas SQL:** Ejecuta las consultas SQL que se encuentran en el archivo `BD.sql` en la carpeta raíz del proyecto (`reto-Konecta-back`).

## Importante

* Para que la comunicación entre los *endpoints* sea exitosa y el sistema pueda validar las acciones del usuario, ambos proyectos (front-end y back-end) deben estar ejecutándose simultáneamente.
* Es esencial ejecutar los `INSERT` que se encuentran en el archivo `BD.sql`, especialmente los de la tabla `usuario`.
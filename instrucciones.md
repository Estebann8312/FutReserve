# Instrucciones de Ejecución - FutReserve

Sigue estos pasos detallados para ejecutar el proyecto FutReserve en tu computadora de forma local. El proyecto consta de dos partes principales: el Backend (API) y el Frontend (Web).

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalados los siguientes programas en tu equipo:

1.  **Java Development Kit (JDK) 17 o superior.**
2.  **Maven** (para la gestión de dependencias del backend).
3.  **Node.js v18 o superior** (para ejecutar el frontend).
4.  **Git** (opcional, pero recomendado para el control de versiones).

*Nota: La conexión a la base de datos de MongoDB Atlas ya viene configurada en el archivo `backend/src/main/resources/application.properties`, por lo que no es necesario instalar MongoDB localmente.*

---

## 1. Ejecutar el Backend (Spring Boot)

El backend expone la API REST en el puerto `8080`.

1.  Abre una terminal o línea de comandos.
2.  Navega hacia la carpeta del backend del proyecto:
    ```bash
    cd backend
    ```
3.  Ejecuta la aplicación utilizando el plugin de Spring Boot de Maven:
    ```bash
    mvn spring-boot:run
    ```
4.  Espera a que descargue las dependencias (solo la primera vez) y verás un mensaje indicando que la aplicación ha iniciado (algo similar a `Started FutReserveApplication...`).
5.  El servidor estará escuchando peticiones en: `http://localhost:8080`

---

## 2. Ejecutar el Frontend (Vite + React)

El frontend se comunica con el backend. Es altamente recomendable tener el backend corriendo antes de interactuar con la aplicación web.

1.  Abre una **nueva ventana** o pestaña en tu terminal (deja la del backend corriendo).
2.  Navega hacia la carpeta del frontend:
    ```bash
    cd frontend
    ```
3.  Instala las dependencias necesarias de Node.js:
    ```bash
    npm install
    ```
4.  Inicia el servidor de desarrollo local:
    ```bash
    npm run dev
    ```
5.  La terminal te indicará la ruta local donde está corriendo la aplicación. Generalmente es: `http://localhost:5173`
6.  Abre esa URL en tu navegador web para usar FutReserve.

---

## 3. Notas Adicionales y Buenas Prácticas

*   **Evitar subir archivos temporales:** Si vas a contribuir al repositorio, asegúrate de no modificar ni borrar los archivos `.gitignore`. Estos previenen que se suban a GitHub archivos generados automáticamente (como las carpetas `target/` de Maven o `node_modules/` de Node.js).
*   **Problemas de Puertos:** Si al ejecutar el backend o el frontend te da un error de "puerto en uso" (Port in use), asegúrate de no tener otro programa corriendo en los puertos `8080` o `5173`, y si lo tienes, cierra ese programa antes de volver a intentarlo.

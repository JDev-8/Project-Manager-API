# 🚀 Project Manager API (SaaS Edition)

![CI Status](https://github.com/JDev-8/Project-Manager-API.git/actions/workflows/ci.yml/badge.svg)

Una API RESTful robusta y escalable para la gestión de proyectos colaborativos estilo Kanban (similar a Trello o Jira), construida con **NestJS** y **TypeScript**.

## ✨ Características Principales

Este sistema no es un simple CRUD. Incluye lógica de negocio avanzada y patrones de diseño profesional:

- ### 🔐 Autenticación & Seguridad:
  - Registro e Inicio de Sesión seguro con **JWT (JSON Web Tokens)**.

  - Hashing de contraseñas con **Bcrypt**.

  - Protección de rutas con **Guards** y Estrategias Passport.

- ### 📊 Gestión de Proyectos (Kanban):
  - Creación de Proyectos, Columnas (Stages) y Tareas.

  - Movimiento de tareas entre columnas (Drag & Drop logic).

  - Validación de integridad: No puedes mover una tarea a una columna de otro proyecto.

- ### 🤝 Colaboración en Tiempo Real:
  - Sistema de **Invitaciones**: Los dueños pueden invitar a otros usuarios por correo.

  - **Permisos Granulares**: Validación de acceso para Dueños y Miembros.

- ### kylin: Auditoría de Datos (Audit Logs):
  - Registro automático de cambios críticos (ej: mover una tarea).

  - Almacenamiento de detalles en formato JSON (Previous State vs New State).

- ### 📚 Documentación:
  - API totalmente documentada con **Swagger (OpenAPI)**.

## 🛠️ Stack Tecnológico

- **Framework**: NestJS (Node.js)

- **Lenguaje**: TypeScript

- **Base de Dato**s: PostgreSQL

- **ORM**: TypeORM

- **Validación**: class-validator & class-transformer

- **Testing**: Jest & Supertest (E2E)

## 🚀 Instalación y Configuración

1.  **Clonar el repositorio**:

    ```
    git clone [https://github.com/JDev-8/Project-Manager-API.git](https://github.com/JDev-8/Project-Manager-API.git)
    cd project-manager-api
    ```

1.  **Instalar dependencias**:

    ```
    npm install
    ```

1.  **Configurar Variables de Entorno**:
    Crea un archivo .env en la raíz del proyecto basándote en el siguiente ejemplo:

        ```
        PORT=3000

        # Base de Datos (PostgreSQL)

        DB_HOST=localhost
        DB_PORT=5432
        DB_USERNAME=postgres
        DB_PASSWORD=root
        DB_NAME=project_manager_db
        DB_SYNC=true # Solo para desarrollo

        # Seguridad

        JWT_SECRET=ClaveSecreta
        ```

## ▶️ Ejecución

```
# Modo desarrollo (con hot-reload)

npm run start:dev

# Modo producción

npm run build
npm run start:prod
```

La API estará corriendo en: `http://localhost:3000/api`

## 📚 Documentación de la API (Swagger)

Una vez iniciada la aplicación, puedes acceder a la documentación interactiva y probar los endpoints directamente desde el navegador:

👉 URL: `http://localhost:3000/docs`

## 🧪 Testing

El proyecto cuenta con pruebas End-to-End (E2E) que cubren el flujo crítico del usuario (Registro -> Login -> Crear Proyecto -> Mover Tarea -> Auditoría).

```
# Ejecutar los tests E2E

npm run test:e2e
```

## 📂 Estructura del Proyecto

El proyecto sigue una arquitectura modular escalable:

```
src/
├── auth/ # Login, Registro y Estrategias JWT
├── users/ # Gestión de usuarios
├── projects/ # Lógica de Proyectos y Miembros
├── stages/ # Columnas del tablero (To Do, In Progress...)
├── tasks/ # Tareas y lógica de movimiento
├── audit/ # Sistema de Logs y Auditoría
└── main.ts # Punto de entrada
```

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - siéntete libre de usarlo para tu portafolio o proyectos personales.

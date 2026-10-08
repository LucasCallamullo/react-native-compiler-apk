# Mara App — Bóveda Digital Oculta

> Una bóveda digital personal que guarda capturas, audios, videos y textos de forma privada, con la posibilidad de compartirlos de manera segura y temporal con personas de confianza.

---

## Introducción

**Mara App** nace de una necesidad concreta: tener un espacio **oculto y privado** dentro del sistema operativo donde guardar capturas de pantalla, audios, videos y notas de texto sin que queden expuestas en la galería o en el almacenamiento público del dispositivo.

A diferencia de una carpeta oculta común, la bóveda está pensada como un **sistema con capas de confianza**:

- El **usuario** guarda archivos en su bóveda personal, invisible para el resto del sistema.
- El usuario puede designar **cuidadores de confianza** (*caregivers*): otras personas registradas en la app que, tras aceptar un código de invitación, pueden recibir avisos y acceder a ciertos recursos cuando el usuario lo autorice.
- El usuario puede generar **links temporales de compartición** (*share links*) para compartir archivos específicos — o todo su historial filtrado por tipo — con una política de visibilidad configurable: público, solo autenticados, o exclusivamente sus cuidadores aceptados.

La app está pensada **mobile-first** (Expo + React Native), con una futura extensión web para la parte de links públicos, y un backend en **Spring Boot** que centraliza la lógica de negocio, la seguridad y el almacenamiento.

---

## Módulos del sistema

| Módulo | Estado | Descripción |
| :--- | :--- | :--- |
| **Auth & Users** | ✅ Implementado | Registro, login, JWT, roles (USER, ADMIN, CAREGIVER). |
| **Files (StoredFile)** | ✅ Implementado | Subida y metadata de archivos, con clasificación por `TypeFile`. |
| **Contacts** | ✅ Implementado | Libreta de contactos externos (sin cuenta en la app). |
| **Caregiver Links** | 🚧 En diseño | Vinculación protegido ↔ cuidador mediante código UUID. |
| **Share Links** | 🚧 En diseño | Links temporales para compartir archivos con visibilidad configurable. |
| **Notificaciones** | 🔜 Próximamente | Avisos entre protegido y cuidador. |
| **Web Frontend** | 🔜 Próximamente | Consumo de share links públicos desde el navegador. |

---

## Stack Tecnológico

### Backend
![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![Spring Cloud](https://img.shields.io/badge/Spring_Cloud-6DB33F?style=for-the-badge&logo=spring&logoColor=white)

### Frontend Web
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

### Mobile
![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![NativeWind](https://img.shields.io/badge/NativeWind-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

### Base de Datos & ORM
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![H2 Database](https://img.shields.io/badge/H2_Database-0040CA?style=for-the-badge&logo=h2&logoColor=white)
![Hibernate](https://img.shields.io/badge/Hibernate-59666C?style=for-the-badge&logo=hibernate&logoColor=white)

### Seguridad & Autenticación
![Spring Security](https://img.shields.io/badge/Spring_Security-6DB33F?style=for-the-badge&logo=spring-security&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white)
![BCrypt](https://img.shields.io/badge/BCrypt-000000?style=for-the-badge&logo=bcrypt&logoColor=white)

### Tools & DevOps
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Docker Compose](https://img.shields.io/badge/Docker_Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05033?style=for-the-badge&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)

### Testing
![JUnit5](https://img.shields.io/badge/JUnit5-25A162?style=for-the-badge&logo=junit5&logoColor=white)
![Mockito](https://img.shields.io/badge/Mockito-78A641?style=for-the-badge&logo=mockito&logoColor=white)
![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white)

---

## Arquitectura (C4 Model)

### Nivel 2 — Contenedores (estado actual + planificado)

A medida que agregamos la parte web (para consumir share links públicos desde el navegador), se suma un **Nginx** como reverse proxy que servirá tanto el frontend web como la API.

```mermaid
C4Container
    title Diagrama de Contenedores — Mara App (estado actual y planificado)

    Person(user, "Usuario", "Dueño de la bóveda.")
    Person(caregiver, "Cuidador", "Persona de confianza.")
    Person(visitor, "Visitante", "Alguien que recibe un share link.")

    System_Boundary(device, "Dispositivo del usuario") {
        Container(mobileApp, "Mobile App (APK)", "React Native + Expo + NativeWind", "Cliente principal de la bóveda.")
    }

    System_Boundary(server, "Servidor (Docker Compose)") {
        Container(nginx, "Nginx", "Reverse Proxy", "Enruta el tráfico: /api → backend, / → web frontend.")
        Container(webApp, "Web Frontend", "React + Tailwind CSS", "Consumo de share links públicos. [Planificado]")
        Container(api, "API REST", "Spring Boot + Spring Security + JWT", "Lógica de negocio, auth, archivos, links.")
    }

    System_Boundary(data, "Persistencia") {
        ContainerDb(db, "PostgreSQL", "Base de datos relacional", "Users, roles, files, links, caregivers.")
        ContainerDb(files, "Almacenamiento de archivos", "Sistema de archivos / volumen Docker", "Archivos subidos por los usuarios.")
    }

    Rel(user, mobileApp, "Usa", "HTTPS")
    Rel(caregiver, mobileApp, "Usa", "HTTPS")
    Rel(user, nginx, "Abre share links", "HTTPS")
    Rel(visitor, nginx, "Abre share links", "HTTPS")

    Rel(mobileApp, nginx, "Consume API", "HTTPS / JSON")
    Rel(webApp, nginx, "Consume API", "HTTPS / JSON")
    Rel(nginx, api, "Redirige /api", "HTTP interno")
    Rel(nginx, webApp, "Sirve assets", "HTTP interno")

    Rel(api, db, "Lee y escribe", "JDBC")
    Rel(api, files, "Lee y escribe", "Filesystem")
```

> **Nota:** el contenedor **Web Frontend** y el enrutamiento de **Nginx** hacia él todavía no existen. Están modelados para anticipar la arquitectura objetivo.

---

## Modelo de Datos (DER)

```mermaid
erDiagram
    USER ||--o{ USER_ROLES : tiene
    ROL  ||--o{ USER_ROLES : asignado
    USER ||--o{ CONTACT : posee
    USER ||--o{ STORED_FILES : sube
    USER ||--o{ CAREGIVER_LINK : "es protegido"
    USER ||--o{ CAREGIVER_LINK : "es cuidador"
    USER ||--o{ SHARE_LINK : crea

    USER {
        uuid id PK
        string firstName
        string lastName
        string email UK
        string password
        string dni UK
        string phone
        datetime createdAt
        datetime updatedAt
    }

    ROL {
        long id PK
        string name UK
        string description
        datetime createdAt
    }

    USER_ROLES {
        uuid user_id PK, FK
        long role_id PK, FK
        datetime assignedAt
    }

    CONTACT {
        long id PK
        string name
        string email
        string phone
        uuid user_id FK
        datetime created_at
        datetime updated_at
    }

    STORED_FILES {
        long id PK
        string originalName
        string storedName UK
        string contentType
        string typeFile "AUDIO | IMAGE | VIDEO | TEXT | DOCUMENT | OTHER"
        long size
        string relativePath
        datetime uploadedAt
        uuid user_id FK
    }

    CAREGIVER_LINK {
        uuid id PK "código de invitación"
        uuid protected_id FK
        uuid caregiver_id FK "nullable hasta aceptar"
        string status "PENDING | ACCEPTED | REVOKED"
        datetime createdAt
        datetime acceptedAt
        datetime revokedAt
        uuid revoked_by FK
    }

    SHARE_LINK {
        uuid id PK "el uuid del link"
        uuid owner_id FK
        string visibility "PUBLIC | AUTHENTICATED | CAREGIVERS_ONLY"
        string file_types "CSV: AUDIO,IMAGE,VIDEO. Vacío = todos"
        datetime created_at
        datetime expires_at
        string status "ACTIVE | REVOKED | EXPIRED"
        datetime revoked_at
        uuid revoked_by FK
    }
```

---

## 🚀 Roadmap

### Fase 1 — Núcleo (completado)
- [x] Autenticación con JWT y roles.
- [x] Gestión de usuarios y contactos.
- [x] Subida y almacenamiento de archivos con clasificación `TypeFile`.

### Fase 2 — Confianza y compartición (en curso)
- [ ] Módulo **Caregiver Links** (vinculación protegido ↔ cuidador).
- [ ] Módulo **Share Links** (links temporales con visibilidad configurable).
- [ ] Validación en vivo de `CAREGIVERS_ONLY` contra `CaregiverLink`.

### Fase 3 — Expansión web
- [ ] Frontend web en React + Tailwind para consumir share links públicos.
- [ ] Nginx como reverse proxy dentro del `docker-compose`.
- [ ] Enrutamiento: `/api` → Spring Boot, `/` → React.

### Fase 4 — Notificaciones y extras
- [ ] Notificaciones push entre protegido y cuidador.
- [ ] Panel de administración.
- [ ] Estadísticas de uso por tipo de archivo.

---

## Documentación adicional

- [`docs/SPRINT_2/typefile-enum.md`](docs/SPRINT_2/AGREGAR_enum_TypeFile.html) — Clasificación de archivos.
- [`docs/SPRINT_3/MODULO_CUIDADORES.html`](docs/SPRINT_3/MODULO_CUIDADORES.html) — Diseño del módulo Caregiver.
- [`docs/SPRINT_3/MODULO_COMPARTIR_LINKS.html`](docs/SPRINT_3/MODULO_COMPARTIR_LINKS.html) — Diseño del módulo ShareLink.

---

## 👥 Equipo

Proyecto académico/portfolio desarrollado por el equipo de Vault App.

---

## Licencia

Por definir.






















``` mermaid
erDiagram
    USER ||--o{ USER_ROLES : tiene
    ROL  ||--o{ USER_ROLES : asignado
    USER ||--o{ CONTACT : posee
    USER ||--o{ STORED_FILES : sube

    USER {
        uuid id PK
        string firstName
        string lastName
        string email UK
        string password
        string dni UK
        string phone
        datetime createdAt
        datetime updatedAt
    }

    ROL {
        long id PK
        string name UK
        string description
        datetime createdAt
    }

    USER_ROLES {
        uuid user_id PK, FK
        long role_id PK, FK
        datetime assignedAt
    }

    CONTACT {
        long id PK
        string name
        string email
        string phone
        uuid user_id FK
        datetime created_at
        datetime updated_at
    }

    STORED_FILES {
        long id PK
        string originalName
        string storedName UK
        string contentType
        long size
        string relativePath
        datetime uploadedAt
        uuid user_id FK
    }

```

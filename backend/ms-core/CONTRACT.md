# Contract - Módulo Contact

**Versión:** 2.0
**Base URL:** `http://localhost:8080`
**Prefijo:** `/api/v1/contacts`
**Content-Type:** `application/json`

---

## Convenciones generales

- Todas las respuestas (éxito y error) vienen envueltas en un objeto JSON estándar.
- El **`id`** del contacto es un **Long** autogenerado (número entero).
- El **`userId`** es un **UUID** con guiones: `f9e8d7c6-b5a4-3210-fedc-ba9876543210`.
- Las **fechas** se devuelven en formato ISO-8601: `2026-09-30T10:50:00`.
- El **`userId`** es el UUID del usuario dueño del contacto (se obtiene de `/api/v1/auth/register` o `/api/v1/auth/login`).
- Todos los endpoints son **públicos** actualmente (no requieren JWT).

---

## Doble factor de seguridad (id + userId)

Los endpoints de **lectura individual**, **actualización** y **eliminación** requieren **dos identificadores** que deben coincidir para el mismo registro:

- `id` (**Long**): ID interno autogenerado por la base de datos.
- `userId` (**UUID**): UUID del usuario dueño del contacto.

El repositorio expone un método JPQL dedicado:

```java
@Query("SELECT c FROM Contact c WHERE c.id = :id AND c.user.id = :userId")
Optional<Contact> findByIdAndUserId(@Param("id") Long id, @Param("userId") UUID userId);
```

**Beneficio:** un atacante no puede acceder a un contacto ajeno adivinando el `id` secuencial. Debe conocer también el `userId` del dueño.

---

## Estructura de respuestas

### Respuesta exitosa

```json
{
  "timestamp": "2026-09-30T10:50:00",
  "status": 200,
  "detail": "Success",
  "data": { },
  "success": true
}
```

### Respuesta de error

```json
{
  "timestamp": "2026-09-30T10:50:00",
  "status": 404,
  "detail": "Contact not found with id: 1 for user: a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "path": "/api/v1/contacts/1/user/a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "success": false
}
```

---

## Endpoints

### 1. POST - Crear contacto

**URL:** `POST /api/v1/contacts`

**Request body:**

```json
{
  "name": "María López",
  "email": "maria@example.com",
  "phone": "1123456789",
  "userId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

**Validaciones:**

| Campo | Tipo | Requerido | Reglas |
|---|---|---|---|
| name | string | Sí | Entre 2 y 100 caracteres |
| email | string | Sí | Formato email válido, máx 100 caracteres |
| phone | string | Sí | Solo dígitos, entre 7 y 15 caracteres |
| userId | UUID | Sí | Debe existir en la base de datos |

**Response 201 Created:**

```json
{
  "timestamp": "2026-09-30T10:52:00",
  "status": 201,
  "detail": "Success",
  "data": {
    "id": 1,
    "name": "María López",
    "email": "maria@example.com",
    "phone": "1123456789",
    "userId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "createdAt": "2026-09-30T10:52:00"
  },
  "success": true
}
```

**Nota:** El campo `id` es un **Long autogenerado**. Lo devuelve la API en la respuesta y debe usarse en los siguientes requests.

**Errores:**

| Status | Causa |
|---|---|
| 400 | Body inválido |
| 404 | userId no existe |
| 409 | Ya existe un contacto con ese email para ese userId |

---

### 2. GET - Obtener contacto por Id y UserId

**URL:** `GET /api/v1/contacts/{id}/user/{userId}`

**Path params:**

| Param | Tipo | Descripción |
|---|---|---|
| id | Long | ID interno del contacto |
| userId | UUID | UUID del usuario dueño |

**Ejemplo:** `GET /api/v1/contacts/1/user/a1b2c3d4-e5f6-7890-abcd-ef1234567890`

**Response 200 OK:**

```json
{
  "timestamp": "2026-09-30T10:53:00",
  "status": 200,
  "detail": "Success",
  "data": {
    "id": 1,
    "name": "María López",
    "email": "maria@example.com",
    "phone": "1123456789",
    "userId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "createdAt": "2026-09-30T10:52:00"
  },
  "success": true
}
```

**Errores:**

| Status | Causa |
|---|---|
| 400 | El `id` no es un Long válido, o el `userId` no es un UUID válido |
| 404 | No existe un contacto con esa combinación id + userId |

---

### 3. GET - Listar contactos por usuario

**URL:** `GET /api/v1/contacts/user/{userId}`

**Ejemplo:** `GET /api/v1/contacts/user/a1b2c3d4-e5f6-7890-abcd-ef1234567890`

**Response 200 OK:**

```json
{
  "timestamp": "2026-09-30T10:54:00",
  "status": 200,
  "detail": "Success",
  "data": [
    {
      "id": 1,
      "name": "María López",
      "email": "maria@example.com",
      "phone": "1123456789",
      "userId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "createdAt": "2026-09-30T10:52:00"
    },
    {
      "id": 2,
      "name": "Juan Pérez",
      "email": "juan@example.com",
      "phone": "1187654321",
      "userId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "createdAt": "2026-09-30T10:53:00"
    }
  ],
  "success": true
}
```

**Nota:** Si el usuario existe pero no tiene contactos, `data` será `[]` (array vacío) y el status seguirá siendo 200.

**Errores:**

| Status | Causa |
|---|---|
| 400 | El userId no es un UUID válido |
| 404 | El userId no existe |

---

### 4. PUT - Actualizar contacto

**URL:** `PUT /api/v1/contacts/{id}/user/{userId}`

**Path params:**

| Param | Tipo | Descripción |
|---|---|---|
| id | Long | ID interno del contacto |
| userId | UUID | UUID del usuario dueño |

**Ejemplo:** `PUT /api/v1/contacts/1/user/a1b2c3d4-e5f6-7890-abcd-ef1234567890`

**Request body:**

```json
{
  "name": "María López Actualizada",
  "email": "maria.nueva@example.com",
  "phone": "1199999999",
  "userId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

**Validaciones:** Idénticas al POST.

**Response 200 OK:**

```json
{
  "timestamp": "2026-09-30T10:55:00",
  "status": 200,
  "detail": "Success",
  "data": {
    "id": 1,
    "name": "María López Actualizada",
    "email": "maria.nueva@example.com",
    "phone": "1199999999",
    "userId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "createdAt": "2026-09-30T10:52:00"
  },
  "success": true
}
```

**Errores:**

| Status | Causa |
|---|---|
| 400 | El id no es Long válido, o el body no cumple validaciones |
| 404 | El contacto no existe, o el nuevo userId no existe |
| 409 | El nuevo email ya está en uso por otro contacto del mismo usuario |

---

### 5. DELETE - Eliminar contacto

**URL:** `DELETE /api/v1/contacts/{id}/user/{userId}`

**Path params:**

| Param | Tipo | Descripción |
|---|---|---|
| id | Long | ID interno del contacto |
| userId | UUID | UUID del usuario dueño |

**Ejemplo:** `DELETE /api/v1/contacts/1/user/a1b2c3d4-e5f6-7890-abcd-ef1234567890`

**Response 204 No Content:**

Sin body.

**Errores:**

| Status | Causa |
|---|---|
| 400 | El id no es un Long válido, o el userId no es un UUID válido |
| 404 | No existe un contacto con esa combinación id + userId |

---

## Tipos de datos

### ContactResponseDTO

```typescript
{
  id: number;         // Long autogenerado (ej: 1, 2, 3...)
  name: string;
  email: string;
  phone: string;
  userId: string;     // UUID del usuario dueño
  createdAt: string;  // ISO-8601 (ej: "2026-09-30T10:52:00")
}
```

### ContactRequestDTO

```typescript
{
  name: string;    // 2-100 chars (requerido)
  email: string;   // email válido (requerido)
  phone: string;   // 7-15 dígitos (requerido)
  userId: string;  // UUID del dueño (requerido)
}
```

---

## Códigos de estado HTTP

| Código | Significado | Cuándo ocurre |
|---|---|---|
| 200 | OK | GET y PUT exitosos |
| 201 | Created | POST exitoso |
| 204 | No Content | DELETE exitoso |
| 400 | Bad Request | Validación fallida, Long o UUID mal formados |
| 404 | Not Found | Recurso (contacto o usuario) no existe |
| 409 | Conflict | Duplicado (email ya existe para ese user) |
| 500 | Internal Server Error | Error inesperado del servidor |

---

## Casos de error comunes

### Body inválido (400)

```json
{
  "timestamp": "2026-09-30T10:56:00",
  "status": 400,
  "detail": "Email is required, Phone must contain only numbers and be between 7 and 15 digits",
  "path": "/api/v1/contacts",
  "success": false
}
```

Los múltiples errores de validación se concatenan con comas en `detail`.

### Recurso no encontrado (404)

```json
{
  "timestamp": "2026-09-30T10:56:00",
  "status": 404,
  "detail": "Contact not found with id: 1 for user: a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "path": "/api/v1/contacts/1/user/a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "success": false
}
```

### Long mal formado (400)

```json
{
  "timestamp": "2026-09-30T10:56:00",
  "status": 400,
  "detail": "Invalid parameter 'id' with value 'abc'. Expected type: Long",
  "path": "/api/v1/contacts/abc/user/a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "success": false
}
```

### UUID mal formado (400)

```json
{
  "timestamp": "2026-09-30T10:56:00",
  "status": 400,
  "detail": "Invalid parameter 'userId' with value 'abc-123'. Expected type: UUID",
  "path": "/api/v1/contacts/1/user/abc-123",
  "success": false
}
```

### Email duplicado (409)

```json
{
  "timestamp": "2026-09-30T10:56:00",
  "status": 409,
  "detail": "Contact already exists with email: maria@example.com for this user",
  "path": "/api/v1/contacts",
  "success": false
}
```

---

## Notas para el frontend

1. Siempre revisar `success` antes de acceder a `data`.
2. El `userId` se obtiene del login/registro: campo `data.user.id`.
3. Los errores 400 de validación devuelven los mensajes concatenados con comas en `detail`.
4. Al eliminar un contacto, esperar un 204 y no parsear el body.
5. Al actualizar con PUT, enviar todos los campos.
6. **El `id` del contacto es un `number` (Long), no un `string`.** En TypeScript, tipar como `number`.
7. **Los endpoints de GET individual, PUT y DELETE requieren `id` + `userId` en el path:** `/{id}/user/{userId}`.

---

## Endpoints relacionados (módulo auth)

Para obtener un userId válido:

- `POST /api/v1/auth/register` → devuelve `data.user.id`
- `POST /api/v1/auth/login` → devuelve `data.user.id`

---

## Colección de Postman

En la carpeta `postman/` está la colección completa con los casos de prueba (felices + error + doble factor).

**Archivo:** `postman/VG-Contacts-API.postman_collection.json`

### Cómo importarla en Postman

1. Abrir Postman.
2. Click en **File → Import** (o `Ctrl + O`).
3. Seleccionar el archivo `VG-Contacts-API.postman_collection.json`.
4. Se importa la colección completa con todos los requests listos para ejecutar.

### Environment requerido

La colección usa variables de entorno. Antes de ejecutar, crear un environment llamado `VG Local` con estas variables:

| Variable | Valor |
|---|---|
| `baseUrl` | `http://localhost:8080` |
| `userId` | UUID del usuario registrado (se obtiene del request `00 - Register User`) |
| `contactId` | ID numérico del contacto creado (se obtiene del request `01 - Create Contact`) |

### Orden sugerido de ejecución

1. Ejecutar `00 - Register User` → copiar `data.user.id` y guardarlo en la variable `userId`.
2. Ejecutar `01 - Create Contact` → copiar `data.id` (numérico) y guardarlo en la variable `contactId`.
3. Ejecutar el resto de los requests en orden.

### Casos de prueba cubiertos

| # | Nombre | Método | Status esperado |
|---|---|---|---|
| 00 | Register User | POST | 201 / 409 |
| 01 | Create Contact | POST | 201 |
| 02 | Get Contact By Id + UserId | GET | 200 |
| 03 | List Contacts By User | GET | 200 |
| 03b | List Contacts (usuario inexistente) | GET | 404 |
| 04 | Update Contact | PUT | 200 |
| 05 | Delete Contact | DELETE | 204 |
| 06 | Get Deleted Contact | GET | 404 |
| 07 | POST sin name | POST | 400 |
| 08 | POST email inválido | POST | 400 |
| 09 | POST userId inexistente | POST | 404 |
| 10 | POST email duplicado | POST | 409 |
| 11 | GET Long mal formado | GET | 400 |
| 12 | DELETE Id inexistente | DELETE | 404 |
| 13 | Get Contact - id OK, userId FALSO | GET | 404 |
| 14 | Delete Contact - id FALSO, userId OK | DELETE | 404 |

---

## Pruebas rápidas con REST Client (VS Code)

Además de la colección de Postman, se incluye un archivo `contact.http` para
probar los endpoints directamente desde VS Code con la extensión
**REST Client**.

**Archivo:** `requests/contact/contact.http`

**Cómo usarlo:**
1. Instalar la extensión "REST Client" en VS Code (si no está).
2. Levantar el backend (`mvn spring-boot:run`).
3. Abrir `requests/contact/contact.http`.
4. Ejecutar los requests con el botón "Send Request" (uno por uno) o con
   "REST Client: Run All" (todos en cascada).

El archivo usa `# @name` para capturar valores dinámicamente (`userId`,
`contactId`) y evitar copiar/pegar IDs manualmente.

---

**Fin del contrato.**
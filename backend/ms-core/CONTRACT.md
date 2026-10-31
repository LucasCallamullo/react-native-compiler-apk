# Contract - Módulo Contact

**Versión:** 4.0
**Base URL:** `http://localhost:8080`
**Prefijo:** `/api/v1/contacts`
**Content-Type:** `application/json`
**Autenticación:** JWT (Bearer token en header `Authorization`)

---

## Convenciones generales

- Todas las respuestas (éxito y error) vienen envueltas en un objeto JSON estándar.
- El **`id`** del contacto es un **Long** autogenerado.
- El **`userId`** es un **UUID** con guiones: `00000000-0000-0000-0000-000000000001`.
- Las **fechas** se devuelven en formato ISO-8601: `2026-10-31T12:50:00`.
- **El `userId` NUNCA se envía por URL ni por body.** Se extrae del JWT.
- **Todos los endpoints requieren autenticación.** Enviar el token en el header:
  ```
  Authorization: Bearer <accessToken>
  ```

---

## Seguridad

- **JWT obligatorio:** todos los endpoints requieren un token válido.
- **El `userId` se extrae del token** (claim `sub` → `UUID.fromString(subject)`).
- **Doble factor:** en operaciones sobre un contacto puntual (GET/PUT/DELETE), se valida que el `id` del contacto **pertenezca** al `userId` del token.
- **Sin acceso cruzado:** un usuario no puede ver/modificar/borrar contactos de otro usuario.
- **ADMIN ve todos:** si el user es ADMIN, `GET /contacts` devuelve los de todos los usuarios.

---

## Endpoints

### 1. GET - Listar contactos

**URL:** `GET /api/v1/contacts`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Comportamiento:**
- **USER:** devuelve solo sus propios contactos.
- **ADMIN:** devuelve los contactos de **todos** los usuarios.

**Response 200 OK (usuario normal):**

```json
{
  "timestamp": "2026-10-31T12:50:00",
  "status": 200,
  "detail": "Success",
  "data": [
    {
      "id": 1,
      "name": "Maria Lopez",
      "email": "maria@example.com",
      "phone": "1123456789",
      "userId": "00000000-0000-0000-0000-000000000001",
      "createdAt": "2026-10-31T12:45:00"
    }
  ],
  "success": true
}
```

**Response 200 OK (ADMIN):** array con contactos de todos los usuarios.

**Errores:**

| Status | Causa |
|---|---|
| 401 | Sin token o token inválido |

---

### 2. POST - Crear contacto

**URL:** `POST /api/v1/contacts`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Request body:**

```json
{
  "name": "Maria Lopez",
  "email": "maria@example.com",
  "phone": "1123456789"
}
```

> ⚠️ **Importante:** el `userId` **NO** va en el body. Se extrae del JWT.

**Validaciones:**

| Campo | Tipo | Requerido | Reglas |
|---|---|---|---|
| name | string | Sí | 2-100 caracteres |
| email | string | Sí | Formato email válido, máx 100 |
| phone | string | Sí | Solo dígitos, 7-15 caracteres |

**Response 201 Created:**

```json
{
  "timestamp": "2026-10-31T12:52:00",
  "status": 201,
  "detail": "Success",
  "data": {
    "id": 1,
    "name": "Maria Lopez",
    "email": "maria@example.com",
    "phone": "1123456789",
    "userId": "00000000-0000-0000-0000-000000000001",
    "createdAt": "2026-10-31T12:52:00"
  },
  "success": true
}
```

**Errores:**

| Status | Causa |
|---|---|
| 400 | Body inválido |
| 401 | Sin token |
| 404 | El usuario del token no existe en la BD |
| 409 | Ya existe un contacto con ese email para ese usuario |

---

### 3. GET - Obtener contacto por Id

**URL:** `GET /api/v1/contacts/{id}`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Path param:**

| Param | Tipo | Descripción |
|---|---|---|
| id | Long | ID interno del contacto |

**Ejemplo:** `GET /api/v1/contacts/1`

**Response 200 OK:**

```json
{
  "timestamp": "2026-10-31T12:53:00",
  "status": 200,
  "detail": "Success",
  "data": {
    "id": 1,
    "name": "Maria Lopez",
    "email": "maria@example.com",
    "phone": "1123456789",
    "userId": "00000000-0000-0000-0000-000000000001",
    "createdAt": "2026-10-31T12:52:00"
  },
  "success": true
}
```

**Errores:**

| Status | Causa |
|---|---|
| 400 | El `id` no es un Long válido |
| 401 | Sin token |
| 404 | No existe un contacto con ese `id` **para el usuario autenticado** |

> **Nota:** si el contacto existe pero pertenece a otro usuario, devuelve **404**, no 403. Esto evita filtrar la existencia de contactos ajenos.

---

### 4. PUT - Actualizar contacto

**URL:** `PUT /api/v1/contacts/{id}`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Path param:**

| Param | Tipo | Descripción |
|---|---|---|
| id | Long | ID interno del contacto |

**Ejemplo:** `PUT /api/v1/contacts/1`

**Request body:**

```json
{
  "name": "Maria Lopez Actualizada",
  "email": "maria.nueva@example.com",
  "phone": "1199999999"
}
```

**Response 200 OK:**

```json
{
  "timestamp": "2026-10-31T12:55:00",
  "status": 200,
  "detail": "Success",
  "data": {
    "id": 1,
    "name": "Maria Lopez Actualizada",
    "email": "maria.nueva@example.com",
    "phone": "1199999999",
    "userId": "00000000-0000-0000-0000-000000000001",
    "createdAt": "2026-10-31T12:52:00"
  },
  "success": true
}
```

**Errores:**

| Status | Causa |
|---|---|
| 400 | El `id` no es Long válido, o el body no cumple validaciones |
| 401 | Sin token |
| 404 | No existe el contacto para el usuario autenticado |

---

### 5. DELETE - Eliminar contacto

**URL:** `DELETE /api/v1/contacts/{id}`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Path param:**

| Param | Tipo | Descripción |
|---|---|---|
| id | Long | ID interno del contacto |

**Ejemplo:** `DELETE /api/v1/contacts/1`

**Response 204 No Content:**

Sin body.

**Errores:**

| Status | Causa |
|---|---|
| 400 | El `id` no es un Long válido |
| 401 | Sin token |
| 404 | No existe el contacto para el usuario autenticado |

---

## Tipos de datos

### ContactResponseDTO

```typescript
{
  id: number;          // Long autogenerado
  name: string;
  email: string;
  phone: string;
  userId: string;      // UUID del dueño
  createdAt: string;   // ISO-8601
}
```

### ContactRequestDTO

```typescript
{
  name: string;   // 2-100 chars
  email: string;  // email válido
  phone: string;  // 7-15 dígitos
  // ❌ NO incluye userId (se saca del JWT)
}
```

---

## Códigos de estado HTTP

| Código | Significado | Cuándo ocurre |
|---|---|---|
| 200 | OK | GET y PUT exitosos |
| 201 | Created | POST exitoso |
| 204 | No Content | DELETE exitoso |
| 400 | Bad Request | Validación fallida o Long mal formado |
| 401 | Unauthorized | Sin token o token inválido/expirado |
| 403 | Forbidden | (no aplica en contact, salvo futuros roles) |
| 404 | Not Found | Contacto no existe O no pertenece al usuario |
| 409 | Conflict | Duplicado (email ya existe para ese user) |
| 500 | Internal Server Error | Error inesperado |

---

## Casos de error comunes

### 401 Unauthorized (sin token)

```json
{
  "status": 401,
  "detail": "Authentication required",
  "success": false
}
```

### 400 Bad Request (body inválido)

```json
{
  "timestamp": "2026-10-31T12:56:00",
  "status": 400,
  "detail": "Email is required, Phone must contain only numbers and be between 7 and 15 digits",
  "path": "/api/v1/contacts",
  "success": false
}
```

Los múltiples errores de validación se concatenan con comas en `detail`.

### 404 Not Found (contacto ajeno o inexistente)

```json
{
  "timestamp": "2026-10-31T12:56:00",
  "status": 404,
  "detail": "Contact not found with id: 1 for user: 00000000-0000-0000-0000-000000000001",
  "path": "/api/v1/contacts/1",
  "success": false
}
```

### 409 Conflict (email duplicado)

```json
{
  "timestamp": "2026-10-31T12:56:00",
  "status": 409,
  "detail": "Contact already exists with email: maria@example.com for this user",
  "path": "/api/v1/contacts",
  "success": false
}
```

---

## Notas para el frontend

1. Siempre revisar `success` antes de acceder a `data`.
2. El `userId` **NO se envía nunca** desde el cliente. El backend lo obtiene del JWT.
3. Al eliminar un contacto, esperar un **204** y no parsear el body.
4. Al actualizar con PUT, enviar todos los campos (`name`, `email`, `phone`).
5. El `id` del contacto es un **`number`** (Long), no un string.
6. **Todas las requests deben incluir el header:**
   ```
   Authorization: Bearer <accessToken>
   ```
7. Si el backend devuelve **401**, el token expiró. El cliente debe hacer refresh o redirigir a login.

---

## Pruebas con REST Client (VS Code)

**Archivo:** `requests/contact/contact.http`

**Cómo usarlo:**
1. Levantar el backend (`mvn spring-boot:run`).
2. Los usuarios seedeados ya existen:
   - `test@gmail.com` / `123456` (USER)
   - `admin@gmail.com` / `123456` (ADMIN)
3. Abrir `contact.http` y ejecutar los requests con "Send Request".

El archivo hace login automático y captura los tokens con `# @name`.

---

## Colección de Postman

**Archivo:** `postman/VG-Contacts-API.postman_collection.json`

### Environment requerido

| Variable | Valor |
|---|---|
| `baseUrl` | `http://localhost:8080` |
| `userToken` | (se obtiene del request `00 - Login User`) |
| `adminToken` | (se obtiene del request `00b - Login Admin`) |
| `contactId` | ID numérico del contacto creado |

---

**Fin del contrato.**
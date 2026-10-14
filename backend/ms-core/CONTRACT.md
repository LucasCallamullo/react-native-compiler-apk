# Contract - Módulo Contact

**Versión:** 3.0
**Base URL:** `http://localhost:8080`
**Prefijo:** `/api/v1/contacts`
**Content-Type:** `application/json`
**Autenticación:** JWT (Bearer token en header `Authorization`)

---

## Convenciones generales

- Todas las respuestas (éxito y error) vienen envueltas en un objeto JSON estándar.
- El **`id`** del contacto es un **Long** autogenerado (número entero).
- El **`userId`** es un **UUID** con guiones: `f9e8d7c6-b5a4-3210-fedc-ba9876543210`.
- Las **fechas** se devuelven en formato ISO-8601: `2026-10-14T10:50:00`.
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

---

## Endpoints

### 1. GET - Listar contactos

Devuelve los contactos del usuario autenticado. Si el usuario es ADMIN, devuelve los de todos.

**URL:** `GET /api/v1/contacts`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Response 200 OK (usuario normal):**

```json
{
  "timestamp": "2026-10-14T10:54:00",
  "status": 200,
  "detail": "Success",
  "data": [
    {
      "id": 1,
      "name": "Maria Lopez",
      "email": "maria@example.com",
      "phone": "1123456789",
      "userId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "createdAt": "2026-10-14T10:52:00"
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
| 403 | (no aplica) |

---

### 2. POST - Crear contacto

Crea un contacto para el usuario autenticado. **No se envía `userId` en el body.**

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

**Validaciones:**

| Campo | Tipo | Requerido | Reglas |
|---|---|---|---|
| name | string | Sí | 2-100 caracteres |
| email | string | Sí | Formato email válido, máx 100 |
| phone | string | Sí | Solo dígitos, 7-15 caracteres |

**Response 201 Created:**

```json
{
  "timestamp": "2026-10-14T10:52:00",
  "status": 201,
  "detail": "Success",
  "data": {
    "id": 1,
    "name": "Maria Lopez",
    "email": "maria@example.com",
    "phone": "1123456789",
    "userId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "createdAt": "2026-10-14T10:52:00"
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

**Path param:**

| Param | Tipo | Descripción |
|---|---|---|
| id | Long | ID interno del contacto |

**Ejemplo:** `GET /api/v1/contacts/1`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Response 200 OK:**

```json
{
  "timestamp": "2026-10-14T10:53:00",
  "status": 200,
  "detail": "Success",
  "data": {
    "id": 1,
    "name": "Maria Lopez",
    "email": "maria@example.com",
    "phone": "1123456789",
    "userId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "createdAt": "2026-10-14T10:52:00"
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

**Path param:**

| Param | Tipo | Descripción |
|---|---|---|
| id | Long | ID interno del contacto |

**Ejemplo:** `PUT /api/v1/contacts/1`

**Headers:**
```
Authorization: Bearer <accessToken>
```

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
  "timestamp": "2026-10-14T10:55:00",
  "status": 200,
  "detail": "Success",
  "data": {
    "id": 1,
    "name": "Maria Lopez Actualizada",
    "email": "maria.nueva@example.com",
    "phone": "1199999999",
    "userId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "createdAt": "2026-10-14T10:52:00"
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

**Path param:**

| Param | Tipo | Descripción |
|---|---|---|
| id | Long | ID interno del contacto |

**Ejemplo:** `DELETE /api/v1/contacts/1`

**Headers:**
```
Authorization: Bearer <accessToken>
```

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
  id: number;         // Long autogenerado (ej: 1, 2, 3...)
  name: string;
  email: string;
  phone: string;
  userId: string;     // UUID del dueño
  createdAt: string;  // ISO-8601
}
```

### ContactRequestDTO

```typescript
{
  name: string;    // 2-100 chars
  email: string;   // email válido
  phone: string;   // 7-15 dígitos
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
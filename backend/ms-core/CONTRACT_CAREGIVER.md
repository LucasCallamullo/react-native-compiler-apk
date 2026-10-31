# Contract - Módulo CaregiverLink

**Versión:** 1.0
**Base URL:** `http://localhost:8080`
**Prefijo:** `/api/v1/caregiver-links`
**Content-Type:** `application/json`
**Autenticación:** JWT (Bearer token en header `Authorization`)

---

## Convenciones generales

- Todas las respuestas (éxito y error) vienen envueltas en un objeto JSON estándar.
- El **`id`** del `CaregiverLink` es un **UUID** que **también funciona como código de invitación**.
- Las **fechas** se devuelven en formato ISO-8601: `2026-10-31T12:51:51`.
- **Todos los endpoints requieren autenticación.** Enviar el token en el header:
  ```
  Authorization: Bearer <accessToken>
  ```

---

## Flujo general

1. **Protegido** → genera un código UUID (`PENDING`).
2. **Protegido** → le pasa el código al cuidador por un canal externo (WhatsApp, email, etc.).
3. **Cuidador** → se loguea y "acepta" el código (`ACCEPTED`).
4. **Cuidador** → obtiene automáticamente el rol `CAREGIVER`.
5. **Protegido** → puede revocar el link en cualquier momento (`REVOKED`).
6. Los links **nunca se borran**: solo cambian de estado (soft delete).

---

## Estados del link

| Estado | Descripción |
|---|---|
| `PENDING` | El protegido generó el código, pero nadie lo aceptó todavía. |
| `ACCEPTED` | El cuidador aceptó el código. El vínculo está activo. |
| `REVOKED` | El protegido revocó el vínculo. El cuidador ya no tiene acceso. |

---

## Endpoints

### 1. POST - Generar código de invitación

**URL:** `POST /api/v1/caregiver-links`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Body:** *(sin body, no requiere parámetros)*

**Response 201 Created:**

```json
{
  "timestamp": "2026-10-31T12:51:51",
  "status": 201,
  "detail": "Success",
  "data": {
    "code": "8d440360-c3a3-4d7a-b35c-c42f58b5dd04"
  },
  "success": true
}
```

**Errores:**

| Status | Causa |
|---|---|
| 401 | Sin token o token inválido |
| 404 | El usuario del token no existe en la BD |

---

### 2. POST - Aceptar código de invitación

**URL:** `POST /api/v1/caregiver-links/{code}/accept`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Path param:**

| Param | Tipo | Descripción |
|---|---|---|
| code | UUID | Código de invitación (el `id` del `CaregiverLink`) |

**Ejemplo:** `POST /api/v1/caregiver-links/8d440360-c3a3-4d7a-b35c-c42f58b5dd04/accept`

**Response 200 OK:**

```json
{
  "timestamp": "2026-10-31T12:52:44",
  "status": 200,
  "detail": "Success",
  "data": {
    "id": "8d440360-c3a3-4d7a-b35c-c42f58b5dd04",
    "protectedUserId": "00000000-0000-0000-0000-000000000001",
    "protectedUserName": "Test User",
    "caregiverId": "00000000-0000-0000-0000-000000000003",
    "caregiverName": "Mara Caregiver",
    "status": "ACCEPTED",
    "createdAt": "2026-10-31T12:51:51",
    "acceptedAt": "2026-10-31T12:52:44"
  },
  "success": true
}
```

**Errores:**

| Status | Causa |
|---|---|
| 400 | El usuario intentó aceptar su propio código |
| 401 | Sin token o token inválido |
| 404 | El código no existe o ya no está en estado `PENDING` |
| 409 | Ya existe un link `ACCEPTED` entre estos dos usuarios |

**Nota:** Al aceptar el código, el cuidador **recibe automáticamente el rol `CAREGIVER`** (si no lo tenía ya).

---

### 3. PATCH - Revocar vínculo

**URL:** `PATCH /api/v1/caregiver-links/{id}/revoke`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Path param:**

| Param | Tipo | Descripción |
|---|---|---|
| id | UUID | ID del `CaregiverLink` a revocar |

**Ejemplo:** `PATCH /api/v1/caregiver-links/8d440360-c3a3-4d7a-b35c-c42f58b5dd04/revoke`

**Response 204 No Content:**

Sin body.

**Errores:**

| Status | Causa |
|---|---|
| 401 | Sin token o token inválido |
| 403 | Solo el protegido dueño del link puede revocarlo |
| 404 | El link no existe |
| 409 | El link ya está en estado `REVOKED` |

---

### 4. GET - Listar mis cuidadores (como protegido)

**URL:** `GET /api/v1/caregiver-links`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Response 200 OK:**

```json
{
  "timestamp": "2026-10-31T12:53:30",
  "status": 200,
  "detail": "Success",
  "data": [
    {
      "id": "8d440360-c3a3-4d7a-b35c-c42f58b5dd04",
      "protectedUserId": "00000000-0000-0000-0000-000000000001",
      "protectedUserName": "Test User",
      "caregiverId": "00000000-0000-0000-0000-000000000003",
      "caregiverName": "Mara Caregiver",
      "status": "ACCEPTED",
      "createdAt": "2026-10-31T12:51:51",
      "acceptedAt": "2026-10-31T12:52:44"
    }
  ],
  "success": true
}
```

**Nota:** Devuelve **todos** los links del protegido (en cualquier estado: `PENDING`, `ACCEPTED`, `REVOKED`).

---

### 5. GET - Listar a quiénes cuido (como cuidador)

**URL:** `GET /api/v1/caregiver-links/caring`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Response 200 OK:**

```json
{
  "timestamp": "2026-10-31T12:53:53",
  "status": 200,
  "detail": "Success",
  "data": [
    {
      "id": "8d440360-c3a3-4d7a-b35c-c42f58b5dd04",
      "protectedUserId": "00000000-0000-0000-0000-000000000001",
      "protectedUserName": "Test User",
      "caregiverId": "00000000-0000-0000-0000-000000000003",
      "caregiverName": "Mara Caregiver",
      "status": "ACCEPTED",
      "createdAt": "2026-10-31T12:51:51",
      "acceptedAt": "2026-10-31T12:52:44"
    }
  ],
  "success": true
}
```

**Nota:** Devuelve **todos** los links en los que el usuario autenticado es el caregiver.

---

## Tipos de datos

### CaregiverCodeResponseDTO

```typescript
{
  code: string;  // UUID del link (código de invitación)
}
```

### CaregiverLinkResponseDTO

```typescript
{
  id: string;               // UUID del link
  protectedUserId: string;  // UUID del protegido
  protectedUserName: string; // Nombre completo o email
  caregiverId: string | null; // UUID del cuidador (null si PENDING)
  caregiverName: string | null; // Nombre completo o email (null si PENDING)
  status: "PENDING" | "ACCEPTED" | "REVOKED";
  createdAt: string;        // ISO-8601
  acceptedAt: string | null; // ISO-8601 (null si PENDING)
}
```

---

## Códigos de estado HTTP

| Código | Significado | Cuándo ocurre |
|---|---|---|
| 200 | OK | GET y POST (`accept`) exitosos |
| 201 | Created | POST (`generate`) exitoso |
| 204 | No Content | PATCH (`revoke`) exitoso |
| 400 | Bad Request | Self-accept, o UUID mal formado |
| 401 | Unauthorized | Sin token, token inválido o expirado |
| 403 | Forbidden | Intento de revocar un link ajeno |
| 404 | Not Found | Código no existe, o ya no está PENDING, o user no existe |
| 409 | Conflict | Ya existe un link ACCEPTED entre estos dos usuarios, o el link ya está revocado |
| 500 | Internal Server Error | Error inesperado del servidor |

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

### 403 Forbidden (token válido sin permisos)

```json
{
  "status": 403,
  "detail": "Access denied",
  "success": false
}
```

### 403 Forbidden (intento de revocar link ajeno)

```json
{
  "timestamp": "2026-10-31T13:08:49",
  "status": 403,
  "detail": "Only the protected user can revoke this link",
  "path": "/api/v1/caregiver-links/26138dac-.../revoke",
  "success": false
}
```

### 404 Not Found (código inválido)

```json
{
  "timestamp": "2026-10-31T12:55:12",
  "status": 404,
  "detail": "Invitation code not found or no longer valid",
  "path": "/api/v1/caregiver-links/00000000-.../accept",
  "success": false
}
```

### 409 Conflict (ya vinculados)

```json
{
  "timestamp": "2026-10-31T13:10:00",
  "status": 409,
  "detail": "This caregiver is already linked to that protected user",
  "path": "/api/v1/caregiver-links/8d440360-.../accept",
  "success": false
}
```

---

## Notas para el frontend

1. **Siempre revisar `success`** antes de acceder a `data`.
2. **El `code` es el `id` del link.** No hay diferencia entre ambos.
3. **Al aceptar un código**, el cuidador recibe automáticamente el rol `CAREGIVER`.
4. **El `caregiverId` es `null` mientras el link está `PENDING`.** Después de aceptar, tiene valor.
5. **Al revocar**, esperar un **204** y no parsear el body.
6. **Todos los requests requieren `Authorization: Bearer <token>`.**
7. **Si el backend devuelve 401**, el token expiró. El cliente debe hacer refresh o redirigir a login.

---

## Pruebas con REST Client (VS Code)

**Archivo:** `requests/caregiver/caregiver.http`

**Cómo usarlo:**
1. Levantar el backend (`mvn spring-boot:run`).
2. Los usuarios seedeados ya existen:
   - `test@gmail.com` / `123456` (USER, protegido)
   - `caregiver@gmail.com` / `123456` (CAREGIVER + USER, cuidador)
   - `admin@gmail.com` / `123456` (ADMIN)
3. Abrir `caregiver.http` y ejecutar los requests en orden.

El archivo hace login automático y captura los tokens con `# @name`.

---

**Fin del contrato.**
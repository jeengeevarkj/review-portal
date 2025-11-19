# Review Portal API Documentation

The Review Portal provides a REST API for external systems to create and manage tasks.

## Authentication

All API requests must include the `x-api-key` header. The value must match the `API_SECRET` environment variable configured on the server.

```http
x-api-key: YOUR_API_SECRET
```

## Endpoints

### Create a Task

Creates a new task in the system.

- **URL**: `/api/tasks`
- **Method**: `POST`
- **Content-Type**: `application/json`

#### Request Body

| Field | Type | Description |
| :--- | :--- | :--- |
| `title` | `string` | **Required**. The title of the task. |
| `content` | `any` | **Required**. The content to be reviewed. Can be a string, object, or array. |

#### Example Request

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -H "x-api-key: secret" \
  -d '{
    "title": "Review New User Registration Flow",
    "content": {
      "userId": "12345",
      "email": "user@example.com",
      "registrationDate": "2023-10-27"
    }
  }'
```

#### Success Response

- **Code**: `201 Created`
- **Content**:

```json
{
  "id": "cm3...",
  "status": "PENDING"
}
```

### Delete a Task

Deletes an existing task.

- **URL**: `/api/tasks/:id`
- **Method**: `DELETE`

#### Example Request

```bash
curl -X DELETE http://localhost:3000/api/tasks/cm3... \
  -H "x-api-key: secret"
```

#### Success Response

- **Code**: `200 OK`
- **Content**:

```json
{
  "message": "Task deleted successfully"
}
```

#### Error Responses

- **401 Unauthorized**: Invalid or missing API key.
- **400 Bad Request**: Missing required fields.
- **500 Internal Server Error**: Server-side error.

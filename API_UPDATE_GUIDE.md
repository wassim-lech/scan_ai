# Updating User Data via API

## Authentication

First, you need to authenticate and get a JWT token:

```
POST http://localhost:5001/api/auth/login
Content-Type: application/json

{
  "email": "your-email@example.com",
  "password": "your-password"
}
```

Response will contain a token:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Update User Profile

Use the token to update your profile:

```
PUT http://localhost:5001/api/auth/profile
Content-Type: application/json
x-auth-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "first_name": "New First Name",
  "last_name": "New Last Name",
  "phone": "+12345678901",
  "address": "123 New Street, City, State 12345"
}
```

You can include any combination of these fields. Fields not included will remain unchanged.

## Sample cURL Commands

### Login to get token:
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"your-email@example.com","password":"your-password"}'
```

### Update profile with token:
```bash
curl -X PUT http://localhost:5001/api/auth/profile \
  -H "Content-Type: application/json" \
  -H "x-auth-token: YOUR_TOKEN_HERE" \
  -d '{"first_name":"New First Name","last_name":"New Last Name","phone":"+12345678901","address":"123 New Street, City, State 12345"}'
```

## Using Postman or Similar Tools

1. Create a POST request to http://localhost:5001/api/auth/login
2. In the request body (JSON format), enter your email and password
3. From the response, copy the token
4. Create a PUT request to http://localhost:5001/api/auth/profile
5. Add a header: x-auth-token with your copied token value
6. In the request body, add the fields you want to update
7. Send the request

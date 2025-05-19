# ScanAI User Credentials Management

This directory contains scripts to manage user credentials in the ScanAI application.

## Default Credentials

The system comes with several predefined users:

| User Type | Email | Default Password | Access Level |
|-----------|-------|------------------|--------------|
| Admin | admin@gmail.com | Admin123! | Full system access |
| Doctor | doctor@gmail.com | Doctor123! | Medical review access |
| Test User | test@example.com | Test123! | Basic user access |

## Password Reset

### Reset All Passwords

To reset admin, doctor and test user passwords to defaults, run:

```powershell
.\reset-all-passwords.ps1
```

To set custom passwords during the reset:

```powershell
.\reset-all-passwords.ps1 -CustomPasswords
```

### Reset Admin Password Only

To reset just the admin password:

```powershell
.\reset-admin-password.ps1
```

## User Management

### Create New User

To create a new user:

```powershell
node create-user.js <username> <email> <password> <role>
```

Example:
```powershell
node create-user.js newuser user@example.com Password123! free
```

Valid roles are:
- `free` (default): Basic user with limited scans
- `premium`: Paid user with more scans
- `doctor`: Medical professional with review capabilities
- `admin`: Full system administrator access

### List Users

To view all users in the system:

```powershell
node list-users.js
```

### Advanced User Management

For a complete user management interface:

```powershell
.\manage-users.ps1
```

This provides an interactive menu for all user operations.

## Security Notes

- All passwords are hashed in the database using bcrypt
- Default passwords should be changed in production environments
- Use strong passwords (min 8 chars, mix of letters, numbers, and special chars)
- Admin credentials should be carefully protected

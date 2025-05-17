# Scan AI Scripts

This directory contains utility scripts for managing the Scan AI application.

## Available Scripts

### User Management

1. **`create-admin.js`** - Create the first admin user
   ```
   node create-admin.js [username] [email] [password]
   ```
   Default: admin, admin@scanai.com, Admin123!

2. **`create-user.js`** - Create a user with a specific role
   ```
   node create-user.js <username> <email> <password> [role]
   ```
   Role can be: free, premium, doctor, admin (default: free)

3. **`list-users.js`** - List all users in the database
   ```
   node list-users.js
   ```

### PowerShell Scripts

1. **`manage-users.ps1`** - Interactive user management tool
   ```
   .\manage-users.ps1
   ```
   Provides a menu-based interface for creating and managing users.

## Examples

Create an admin user:
```
node create-admin.js admin admin@example.com StrongPassword123!
```

Create a premium user:
```
node create-user.js premiumuser premium@example.com Password123 premium
```

Create a doctor user:
```
node create-user.js drsmith doctor@example.com MedicalPass123 doctor
```

## Notes

- These scripts directly interact with the database and should be used carefully
- All passwords are properly hashed before storage
- User roles determine access levels and permissions in the application

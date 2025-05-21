# Database Management System Guide

This guide explains how to use the user-friendly Database Management System to update user data, appointments, and scan history records without needing to run scripts or use command-line tools.

## Accessing the Database Manager

As an administrator, you can access the Database Manager through the Admin Dashboard:

1. Log in as an admin user
2. Go to the Admin Dashboard
3. Click on the "Database Manager" link in the left sidebar
4. The Database Manager will appear in the main content area

## Features Overview

The Database Manager provides a user-friendly interface to:

- View and update user profiles (name, address, phone, role, etc.)
- Reset user passwords
- Manage appointments (schedule, status, doctor assignments)
- Edit scan history records

## Managing User Data

### Viewing Users
1. Click on the "Users" tab at the top of the Database Manager
2. Browse the list of users in the left panel
3. Use the search bar to find specific users by name, email, or username

### Updating User Information
1. Select a user from the list
2. Edit their information in the form on the right
3. Make changes to any of these fields:
   - First Name
   - Last Name
   - Phone
   - Address
   - Role (Free, Premium, Doctor, Admin)
   - Scans Remaining
4. Click "Update User" to save your changes

### Changing User Passwords
1. Select a user from the list
2. Check the "Change Password" checkbox
3. Enter a new password (minimum 6 characters)
4. Click "Update User" to save changes
5. The password will be securely hashed before being stored in the database

## Managing Appointments

### Viewing Appointments
1. Click on the "Appointments" tab at the top
2. Browse the appointments list in the left panel
3. Use the search bar to filter appointments

### Updating Appointments
1. Select an appointment from the list
2. Edit the following information:
   - Doctor assignment
   - Date and time
   - Status (Pending, Confirmed, Cancelled)
3. Click "Update Appointment" to save changes

## Managing Scan History

### Viewing Scan Records
1. Click on the "Scan History" tab
2. Browse users with scan records in the left panel
3. Click on a user to view their scan history
4. Select a specific scan record to view details

### Updating Scan Records
1. Select a scan record from a user's history
2. Edit the following information:
   - Result (diagnosis)
   - Confidence level
   - Date recorded
3. Click "Update Scan Record" to save changes

## Benefits Over Command-Line Methods

This web-based management system offers several advantages:

1. **User-Friendly Interface**: No need to remember command syntax or parameters
2. **Visual Feedback**: See all data fields and current values clearly
3. **Immediate Updates**: Changes are applied instantly with visual confirmation
4. **Search Capability**: Easily find records with the search function
5. **Error Prevention**: Form validation helps prevent invalid data entry
6. **Multiple Data Types**: Manage users, appointments, and scan history in one place

## Troubleshooting

If you encounter any issues with the Database Manager:

1. Verify you're logged in with an admin account
2. Check the browser console for any error messages
3. Ensure the backend API is running properly
4. Try refreshing the page if data isn't loading

## For Developers

This system uses:

- React frontend with protected routes for admin access
- Express.js backend API with middleware for role verification
- MongoDB for data storage
- RESTful API endpoints for CRUD operations

The Database Manager is designed to be extensible - new data types and fields can be added by updating:
1. The frontend component (DatabaseManager.jsx)
2. The backend API routes (admin-database.js)

## Need More Advanced Options?

While the Database Manager handles most common tasks, command-line scripts are still available for advanced scenarios:

- Batch updates via CSV files
- Complex data migrations
- Automated scheduled updates

Refer to the scripts in `backend/scripts/` for these advanced operations.

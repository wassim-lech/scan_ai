# User Roles Guide & Deployment Instructions

## Understanding User Roles in Scan AI

Scan AI supports four user roles, each with different permissions and capabilities:

### 1. Free User
- **Default role for new signups**
- Can scan 1 image for pneumonia detection
- Can book appointments (basic form)
- Access to basic features

### 2. Premium User
- Can scan up to 5 images for pneumonia detection
- Can book appointments with choice of doctors
- Access to priority support
- Enhanced features

### 3. Doctor
- Can view assigned patient scan results
- Can manage appointments
- Access to medical dashboard
- No limit on scans

### 4. Admin
- Full system access
- Can create/edit/delete users
- Can manage all appointments
- Can view system analytics
- Can promote/demote user roles
- No limit on scans

## Managing Users

### Creating the First Admin User

Before you can manage other users, you need to create an admin user:

1. Run the admin creation script:
   ```
   cd backend
   node scripts/create-admin.js adminUsername admin@example.com adminPassword
   ```

2. Or use our setup tool:
   ```
   .\start-app.ps1
   ```
   Then select option 2 "Create First Admin User"

### Creating Additional Users

Once you have an admin user, you can create additional users through:

1. The admin dashboard in the UI (login as admin first)
2. The user management script:
   ```
   cd backend
   .\scripts\manage-users.ps1
   ```

### Viewing Existing Users

You can view all users through:

1. The admin dashboard in the UI (login as admin first)
2. MongoDB Compass by viewing the `users` collection
3. The user management script:
   ```
   cd backend
   .\scripts\manage-users.ps1
   ```
   Then select option 5 "List All Users"

## Database Issues

If you receive "Invalid Credentials" when trying to login with accounts created through MongoDB Compass, it's likely due to:

1. **Password Hashing**: Passwords must be hashed with bcrypt. When creating users directly in the database, passwords are stored in plain text, which won't work with the authentication system.

2. **Case Sensitivity**: Ensure your database name is exactly "scanAi" (case sensitive).

The recommended approach is to:
1. Create a first admin user with our script
2. Use that admin user to create additional users through the API or UI

## Deployment Instructions

The application can be deployed to cloud services for wider access:

### MongoDB Deployment

1. **MongoDB Atlas**:
   - Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Get your connection string
   - Update the `.env` file with your MongoDB URI:
     ```
     MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/scanAi
     ```

### Backend Deployment

1. **Heroku**:
   ```
   heroku create scan-ai-backend
   git subtree push --prefix backend heroku master
   ```

2. **Render**:
   - Connect your GitHub repo
   - Set build command: `npm install`
   - Set start command: `node server.js`
   - Add environment variables from your `.env` file

### Frontend Deployment

1. **Netlify**:
   - Update `.env` to point to your deployed backend
   - Build the frontend: `cd frontend && npm run build`
   - Deploy to Netlify: connect your GitHub repo or drag-drop the `dist` folder

2. **Vercel**:
   - Connect your GitHub repo
   - Set framework preset to "Vite"
   - Add environment variables

## Important Deployment Considerations

1. **CORS Settings**: 
   - Update the CORS settings in `server.js` to include your frontend domain:
     ```javascript
     app.use(cors({
       origin: ['https://your-frontend-domain.com', 'http://localhost:5173'],
       credentials: true,
       exposedHeaders: ['x-auth-token']
     }));
     ```

2. **Environment Variables**:
   - Make sure to set all environment variables in your deployment platform
   - Don't commit sensitive information to GitHub

3. **Database Connection**:
   - Ensure your database connection string is properly set in the environment variables
   - Enable network access from your deployed backend in MongoDB Atlas

4. **Security**:
   - Set a strong JWT secret in production
   - Enable HTTPS for all communications
   - Consider rate limiting to prevent abuse

## Testing the Deployment

After deployment, you should:

1. Create a test user on the production system
2. Test login functionality
3. Test role-based access controls
4. Verify scan uploading and processing
5. Check all API endpoints are responding correctly

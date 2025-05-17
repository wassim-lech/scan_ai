# Cloud Deployment Guide for Scan AI

This guide provides detailed instructions for deploying the Scan AI application to various cloud providers.

## Table of Contents
1. [Database Deployment (MongoDB Atlas)](#database-deployment)
2. [Backend Deployment Options](#backend-deployment)
3. [Frontend Deployment Options](#frontend-deployment)
4. [Configuration Updates for Cloud](#configuration-updates)
5. [Testing Your Deployment](#testing-your-deployment)

<a id="database-deployment"></a>
## 1. Database Deployment (MongoDB Atlas)

### Step 1: Create a MongoDB Atlas account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up or log in
2. Create a new project for Scan AI

### Step 2: Create a cluster
1. Click "Build a Cluster" (free tier is sufficient for testing)
2. Choose your cloud provider (AWS, Google Cloud, or Azure)
3. Select a region closest to your users
4. Click "Create Cluster"

### Step 3: Configure database access
1. Go to "Database Access" and add a new database user
   - Create a secure username and password
   - Select "Read and write to any database" for permissions
2. Go to "Network Access" and add your IP address
   - For development, you can allow access from anywhere (0.0.0.0/0)
   - For production, restrict to specific IPs

### Step 4: Get your connection string
1. Click "Connect" on your cluster
2. Select "Connect your application"
3. Copy the connection string
4. Replace `<username>` and `<password>` with your database user credentials
5. Add `scanAi` as the database name in the connection string

<a id="backend-deployment"></a>
## 2. Backend Deployment Options

### Option A: Render

1. **Create a new Web Service**
   - Sign up/login at [Render](https://render.com/)
   - Click "New +" and select "Web Service"
   - Connect to your GitHub repository
   - Select the `backend` directory as the root directory

2. **Configure the service**
   - Name: `scan-ai-backend`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `node server.js`
   - Advanced settings:
     - Add all environment variables from your `.env` file, including your MongoDB Atlas connection string

3. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Your API will be available at `https://scan-ai-backend.onrender.com`

### Option B: Heroku

1. **Create a new Heroku app**
   - Install [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
   - Login: `heroku login`
   - Create app: `heroku create scan-ai-backend`

2. **Configure environment variables**
   ```bash
   heroku config:set JWT_SECRET=your_jwt_secret
   heroku config:set MONGO_URI=your_mongodb_atlas_uri
   ```

3. **Deploy code**
   ```bash
   cd backend
   git init
   git add .
   git commit -m "Initial backend deployment"
   heroku git:remote -a scan-ai-backend
   git push heroku master
   ```

### Option C: Railway

1. **Create a new project**
   - Sign up/login at [Railway](https://railway.app/)
   - Create a new project
   - Connect to your GitHub repository

2. **Configure deployment**
   - Set the root directory to `/backend`
   - Add environment variables from your `.env` file
   - Deploy the service

<a id="frontend-deployment"></a>
## 3. Frontend Deployment Options

### Option A: Vercel

1. **Deploy on Vercel**
   - Sign up/login at [Vercel](https://vercel.com/)
   - Install Vercel CLI: `npm i -g vercel`
   - Login: `vercel login`

2. **Update environment variables**
   - Create a `.env` file in the frontend directory with:
     ```
     VITE_API_URL=https://your-backend-url.com/api
     ```

3. **Deploy**
   ```bash
   cd frontend
   vercel
   ```

### Option B: Netlify

1. **Prepare for deployment**
   - Update `.env` file with your backend URL:
     ```
     VITE_API_URL=https://your-backend-url.com/api
     ```
   - Build the app: `npm run build`

2. **Deploy via Netlify UI**
   - Sign up/login at [Netlify](https://www.netlify.com/)
   - Drag and drop the `dist` folder to the Netlify dashboard
   - Or connect to your GitHub repository and configure the build settings

3. **Configure environment variables**
   - Go to Site settings > Build & deploy > Environment
   - Add the same environment variables as in your `.env` file

<a id="configuration-updates"></a>
## 4. Configuration Updates for Cloud

### Update CORS settings

In your `server.js` file, update the CORS configuration to include your frontend domain:

```javascript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://your-frontend-domain.com'
  ],
  credentials: true,
  exposedHeaders: ['x-auth-token']
}));
```

### Update API base URL

In your frontend `.env` file:

```
VITE_API_URL=https://your-backend-domain.com/api
```

### Security considerations

1. **JWT Secret**: Use a strong, unique secret for production
   ```
   JWT_SECRET=generate-a-long-random-string
   ```

2. **Enable HTTPS**: Both frontend and backend should use HTTPS

3. **Rate limiting**: Add rate limiting to protect against abuse
   ```javascript
   const rateLimit = require('express-rate-limit');
   
   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 100 // limit each IP to 100 requests per windowMs
   });
   
   app.use('/api/', limiter);
   ```

<a id="testing-your-deployment"></a>
## 5. Testing Your Deployment

After deploying both frontend and backend, perform these tests:

1. **User registration**
   - Create a new user account
   - Verify the user appears in the MongoDB collection

2. **User login**
   - Test login with the created credentials
   - Verify JWT token is generated and stored

3. **API connectivity**
   - Check all API endpoints are accessible
   - Verify CORS is properly configured

4. **Role-based access**
   - Test access with different user roles
   - Verify permissions are working correctly

5. **Full functionality test**
   - Upload a scan image
   - Schedule an appointment
   - Test admin features

## Troubleshooting

### CORS errors
- Verify that your backend CORS configuration includes your frontend domain
- Check for HTTP vs HTTPS mismatches

### Connection errors
- Make sure your MongoDB Atlas connection string is correctly formatted
- Check that network access is properly configured
- Verify your environment variables are set correctly

### Authentication issues
- Test the JWT token generation and validation
- Make sure your JWT_SECRET is properly set
- Check that tokens are being correctly sent in the headers

## Additional Resources

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com/)

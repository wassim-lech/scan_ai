import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/Auth.css';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, isAuthenticated, error, clearError } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect if authenticated
        if (isAuthenticated) {
            navigate('/');
        }
        
        // Clear errors when component mounts
        clearError();
        // eslint-disable-next-line
    }, [isAuthenticated, navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        login({ email, password });
    };

    return (
        <div className="auth-container">
            <h2 className="auth-title">Log in to E-med</h2>
            
            {error && (
                <div className="auth-error">
                    {error}
                </div>
            )}
            
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-input"
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-input"
                    />
                </div>
                
                <div className="form-group">
                    <button type="submit" className="form-button">
                        Log in
                    </button>
                </div>
            </form>
            
            <div className="auth-footer">
                <p>
                    Don't have an account?{' '}
                    <Link to="/signup" className="auth-link">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
};

const SignupPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [formError, setFormError] = useState('');
    
    const { register, isAuthenticated, error, clearError } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect if authenticated
        if (isAuthenticated) {
            navigate('/');
        }
        
        // Clear errors when component mounts
        clearError();
        // eslint-disable-next-line
    }, [isAuthenticated, navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormError('');
        
        if (password !== confirmPassword) {
            setFormError('Passwords do not match');
            return;
        }
        
        // Call register with the form data
        register({
            username: name, // Note: backend expects 'username' not 'name'
            email,
            password
        });
    };

    return (
        <div className="auth-container">
            <h2 className="auth-title">Create your E-med account</h2>
            
            {(error || formError) && (
                <div className="auth-error">
                    {formError || error}
                </div>
            )}
            
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name" className="form-label">Full name</label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="form-input"
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-input"
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-input"
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="confirmPassword" className="form-label">Confirm password</label>
                    <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="form-input"
                    />
                </div>
                
                <div className="form-group">
                    <button type="submit" className="form-button">
                        Sign up
                    </button>
                </div>
            </form>
            
            <div className="auth-footer">
                <p>
                    Already have an account?{' '}
                    <Link to="/login" className="auth-link">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export { LoginPage, SignupPage };
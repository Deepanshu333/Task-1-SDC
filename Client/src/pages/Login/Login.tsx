import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { validateRegistrationForm, sanitizeName } from '../../utils/validation';
import './Login.css';

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setValidationErrors({});

    // Validate form if signing up
    if (!isLogin) {
      const validation = validateRegistrationForm(
        formData.firstName,
        formData.lastName,
        formData.email,
        formData.password,
        formData.confirmPassword
      );
      
      if (!validation.isValid) {
        setValidationErrors(validation.errors);
        setLoading(false);
        return;
      }
    }

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, formData.email.trim(), formData.password);
        navigate('/');
      } else {
        // Sanitize names before saving
        const sanitizedFirstName = sanitizeName(formData.firstName);
        const sanitizedLastName = sanitizeName(formData.lastName);
        
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email.trim(), formData.password);
        const user = userCredential.user;
        // Create a document for the user in the 'users' collection
        await setDoc(doc(db, "users", user.uid), {
          firstName: sanitizedFirstName,
          lastName: sanitizedLastName,
          email: user.email,
          createdAt: serverTimestamp()
        });
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError(null);
    setValidationErrors({});
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: ''
    });
  };

  return (
    <div className="login">
      <div className="container">
        <div className="login__content">
          <div className="login__form-container">
            <div className="login__header">
              <h1 className="heading-secondary">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h1>
              <p className="login__subtitle">
                {isLogin 
                  ? 'Sign in to your account to access your jewelry collection' 
                  : 'Join our exclusive community of jewelry enthusiasts'
                }
              </p>
            </div>

            <form className="login__form" onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="login__name-group">
                  <div className="login__input-group">
                    <label htmlFor="firstName" className="login__label">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`login__input ${validationErrors.firstName ? 'login__input--error' : ''}`}
                      required
                    />
                    {validationErrors.firstName && (
                      <span className="login__error" style={{ color: 'red', fontSize: '0.875rem' }}>
                        {validationErrors.firstName}
                      </span>
                    )}
                  </div>
                  <div className="login__input-group">
                    <label htmlFor="lastName" className="login__label">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`login__input ${validationErrors.lastName ? 'login__input--error' : ''}`}
                      required
                    />
                    {validationErrors.lastName && (
                      <span className="login__error" style={{ color: 'red', fontSize: '0.875rem' }}>
                        {validationErrors.lastName}
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="login__input-group">
                <label htmlFor="email" className="login__label">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`login__input ${validationErrors.email ? 'login__input--error' : ''}`}
                  required
                />
                {validationErrors.email && (
                  <span className="login__error" style={{ color: 'red', fontSize: '0.875rem' }}>
                    {validationErrors.email}
                  </span>
                )}
              </div>

              <div className="login__input-group">
                <label htmlFor="password" className="login__label">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`login__input ${validationErrors.password ? 'login__input--error' : ''}`}
                  required
                />
                {validationErrors.password && (
                  <span className="login__error" style={{ color: 'red', fontSize: '0.875rem' }}>
                    {validationErrors.password}
                  </span>
                )}
              </div>

              {!isLogin && (
                <div className="login__input-group">
                  <label htmlFor="confirmPassword" className="login__label">Confirm Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`login__input ${validationErrors.confirmPassword ? 'login__input--error' : ''}`}
                    required
                  />
                  {validationErrors.confirmPassword && (
                    <span className="login__error" style={{ color: 'red', fontSize: '0.875rem' }}>
                      {validationErrors.confirmPassword}
                    </span>
                  )}
                </div>
              )}

              {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

              {isLogin && (
                <div className="login__options">
                  <label className="login__checkbox-label">
                    <input type="checkbox" className="login__checkbox" />
                    <span className="login__checkbox-text">Remember me</span>
                  </label>
                  <Link to="/forgot-password" className="login__forgot-link">
                    Forgot your password?
                  </Link>
                </div>
              )}

              <button type="submit" className="btn btn-primary login__submit" disabled={loading}>
                {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
              </button>
            </form>

            <div className="login__divider">
              <span>or</span>
            </div>

            <div className="login__social">
              <button className="login__social-btn login__social-btn--google">
                <GoogleIcon />
                Continue with Google
              </button>
              <button className="login__social-btn login__social-btn--facebook">
                <FacebookIcon />
                Continue with Facebook
              </button>
            </div>

            <div className="login__switch">
              <p>
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button 
                  type="button" 
                  className="login__switch-btn"
                  onClick={toggleMode}
                >
                  {isLogin ? 'Create one' : 'Sign in'}
                </button>
              </p>
            </div>
          </div>

          <div className="login__image">
            <img
              src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Luxury jewelry collection"
            />
            <div className="login__image-overlay">
              <h2>Discover Timeless Elegance</h2>
              <p>Handcrafted jewelry pieces that tell your unique story</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Icons
const GoogleIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

const FacebookIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

export default Login;
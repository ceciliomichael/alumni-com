import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock } from 'lucide-react';
import { loginUser } from '../../services/firebase/userService';
import { User as ServiceUser } from '../../services/firebase/userService';
import './Auth.css';

interface LoginPageProps {
  onLoginSuccess: (user: ServiceUser) => void;
}

const LoginPage = ({ onLoginSuccess }: LoginPageProps) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Login using Firebase service
      const user = await loginUser(formData.email, formData.password);
      
      if (user) {
        // Successful login
        // Call the handler passed from App.tsx
        onLoginSuccess(user);
        navigate('/'); // Redirect to home page after login
      } else {
        // Failed login
        setErrors({
          password: 'Invalid credentials or your account is not yet approved'
        });
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setErrors({
        password: 'An error occurred during login. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <div className="auth-card">
          <div className="auth-logo">
            <img src="/images/alumni-conlogo.png" alt="IMA Alumni Logo" />
          </div>
          
          <div className="auth-form-container">
            <div className="auth-header">
              <h1 className="auth-title">
                <LogIn className="auth-icon" />
                Login to IMA Alumni
              </h1>
              <p className="auth-subtitle">Welcome back! Please login to your account.</p>
            </div>
            
            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email Address</label>
                <div className="input-group">
                  <div className="input-icon">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className={`form-control ${errors.email ? 'error' : ''}`}
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                {errors.email && <div className="form-error">{errors.email}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="password" className="form-label">Password</label>
                <div className="input-group">
                  <div className="input-icon">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className={`form-control ${errors.password ? 'error' : ''}`}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
                {errors.password && <div className="form-error">{errors.password}</div>}
              </div>
              
              <div className="form-options">
                <div className="checkbox-group">
                  <input 
                    type="checkbox" 
                    id="rememberMe" 
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                  />
                  <label htmlFor="rememberMe">Remember me</label>
                </div>
                <div className="forgot-password">
                  <Link to="/forgot-password">Forgot Password?</Link>
                </div>
              </div>
              
              <button 
                type="submit" 
                className="btn btn-primary login-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Logging in...' : 'Login to Account'}
              </button>
              
              <div className="auth-footer">
                <p>
                  Don't have an account?{' '}
                  <Link to="/register" className="auth-link">Register</Link>
                </p>
              </div>
            </form>
          </div>
        </div>
        
        <div className="auth-illustration">
          <div className="illustration-content">
            <h2>Connect with Alumni</h2>
            <p>Join your fellow graduates and stay connected with the community.</p>
            <div className="illustration-image">
              <img src="/images/alumni-illustration.svg" alt="Alumni Connection" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

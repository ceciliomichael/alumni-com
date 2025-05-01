import { useState } from 'react';
import { Link } from 'react-router-dom';
import { User } from '../../types';
import { LogIn, Mail, Lock, User as UserIcon } from 'lucide-react';
import './Auth.css';

interface LoginPageProps {
  onLogin: (userData: User) => void;
}

const LoginPage = ({ onLogin }: LoginPageProps) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      // Mock user data (to be replaced with actual API response)
      const userData: User = {
        id: '1',
        name: 'John Doe',
        email: formData.email,
        batch: '2020',
      };
      
      onLogin(userData);
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <div className="auth-card">
          <div className="auth-header">
            <h1 className="auth-title">
              <LogIn className="auth-icon" />
              Login to AlumniCom
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
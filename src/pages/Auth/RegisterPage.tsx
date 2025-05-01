import { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, GraduationCap } from 'lucide-react';
import './Auth.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    batch: '',
    password: '',
    confirmPassword: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

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
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.batch) {
      newErrors.batch = 'Batch year is required';
    } else if (!/^\d{4}$/.test(formData.batch)) {
      newErrors.batch = 'Batch year must be a 4-digit year';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
      setIsSubmitting(false);
      setRegistrationSuccess(true);
    }, 1000);
  };

  if (registrationSuccess) {
    return (
      <div className="auth-container">
        <div className="auth-wrapper">
          <div className="auth-card success-card">
            <div className="success-icon">
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="32" cy="32" r="32" fill="#10b981" fillOpacity="0.1" />
                <path d="M20 32L28 40L44 24" stroke="#10b981" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2>Registration Successful!</h2>
            <p>Your registration has been submitted successfully. Please wait for the admin or batch president approval.</p>
            <Link to="/login" className="btn btn-primary">Back to Login</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <div className="auth-card">
          <div className="auth-header">
            <h1 className="auth-title">
              <UserPlus className="auth-icon" />
              Register for AlumniCom
            </h1>
            <p className="auth-subtitle">Create your account to connect with fellow alumni</p>
          </div>
          
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name" className="form-label">Full Name</label>
              <div className="input-group">
                <div className="input-icon">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className={`form-control ${errors.name ? 'error' : ''}`}
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              {errors.name && <div className="form-error">{errors.name}</div>}
            </div>
            
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
              <label htmlFor="batch" className="form-label">Batch Year</label>
              <div className="input-group">
                <div className="input-icon">
                  <GraduationCap size={18} />
                </div>
                <input
                  type="text"
                  id="batch"
                  name="batch"
                  className={`form-control ${errors.batch ? 'error' : ''}`}
                  placeholder="Enter your batch year (e.g., 2020)"
                  value={formData.batch}
                  onChange={handleChange}
                />
              </div>
              {errors.batch && <div className="form-error">{errors.batch}</div>}
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
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              {errors.password && <div className="form-error">{errors.password}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
              <div className="input-group">
                <div className="input-icon">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className={`form-control ${errors.confirmPassword ? 'error' : ''}`}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
              {errors.confirmPassword && <div className="form-error">{errors.confirmPassword}</div>}
            </div>
            
            <button
              type="submit"
              className="btn btn-primary register-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Registering...' : 'Create Account'}
            </button>
            
            <div className="auth-footer">
              <p>
                Already have an account?{' '}
                <Link to="/login" className="auth-link">Login</Link>
              </p>
            </div>
          </form>
        </div>
        
        <div className="auth-illustration">
          <div className="illustration-content">
            <h2>Join the Community</h2>
            <p>Connect with classmates, explore events, and stay updated on announcements.</p>
            <div className="illustration-image">
              <img src="/images/register-illustration.svg" alt="Join the Alumni Community" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage; 
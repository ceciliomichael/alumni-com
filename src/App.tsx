import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import HomePage from './pages/Home/HomePage';
import GalleryPage from './pages/Gallery/GalleryPage';
import EventsPage from './pages/Events/EventsPage';
import AboutPage from './pages/About/AboutPage';
import ProfilePage from './pages/Profile/ProfilePage';
import Layout from './components/Layout/Layout';
import { User } from './types';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Simulate authentication check
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  // Mock login function for UI demonstration only
  const handleLogin = (userObject: User) => {
    setUser(userObject);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userObject));
  };

  // Logout function
  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  return (
    <Router>
      <Routes>
        {/* Authentication Routes */}
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/" /> : <LoginPage onLogin={handleLogin} />
        } />
        <Route path="/register" element={
          isAuthenticated ? <Navigate to="/" /> : <RegisterPage />
        } />

        {/* Main Navigation Routes */}
        <Route path="/" element={
          <Layout isAuthenticated={isAuthenticated} user={user} onLogout={handleLogout}>
            {isAuthenticated ? <HomePage user={user} /> : <Navigate to="/login" />}
          </Layout>
        } />
        
        {/* Gallery Section */}
        <Route path="/gallery" element={
          <Layout isAuthenticated={isAuthenticated} user={user} onLogout={handleLogout}>
            {isAuthenticated ? <GalleryPage /> : <Navigate to="/login" />}
          </Layout>
        } />
        
        {/* Events Section */}
        <Route path="/events" element={
          <Layout isAuthenticated={isAuthenticated} user={user} onLogout={handleLogout}>
            {isAuthenticated ? <EventsPage /> : <Navigate to="/login" />}
          </Layout>
        } />
        
        {/* About Us Section and Tabs */}
        <Route path="/about" element={
          <Layout isAuthenticated={isAuthenticated} user={user} onLogout={handleLogout}>
            {isAuthenticated ? <AboutPage /> : <Navigate to="/login" />}
          </Layout>
        } />
        <Route path="/about/history" element={
          <Layout isAuthenticated={isAuthenticated} user={user} onLogout={handleLogout}>
            {isAuthenticated ? <AboutPage initialTab="history" /> : <Navigate to="/login" />}
          </Layout>
        } />
        <Route path="/about/vision" element={
          <Layout isAuthenticated={isAuthenticated} user={user} onLogout={handleLogout}>
            {isAuthenticated ? <AboutPage initialTab="vision" /> : <Navigate to="/login" />}
          </Layout>
        } />
        <Route path="/about/organization" element={
          <Layout isAuthenticated={isAuthenticated} user={user} onLogout={handleLogout}>
            {isAuthenticated ? <AboutPage initialTab="organization" /> : <Navigate to="/login" />}
          </Layout>
        } />
        <Route path="/about/contact" element={
          <Layout isAuthenticated={isAuthenticated} user={user} onLogout={handleLogout}>
            {isAuthenticated ? <AboutPage initialTab="contact" /> : <Navigate to="/login" />}
          </Layout>
        } />
        
        {/* Profile Section */}
        <Route path="/profile" element={
          <Layout isAuthenticated={isAuthenticated} user={user} onLogout={handleLogout}>
            {isAuthenticated ? <ProfilePage user={user} /> : <Navigate to="/login" />}
          </Layout>
        } />
        <Route path="/profile/update" element={
          <Layout isAuthenticated={isAuthenticated} user={user} onLogout={handleLogout}>
            {isAuthenticated ? <ProfilePage user={user} isEditing={true} /> : <Navigate to="/login" />}
          </Layout>
        } />
        
        {/* Alumni Directory route removed based on diagram */}
        
        {/* Catch all other routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;

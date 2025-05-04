import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AdminUser } from '../../../types';

// Define the context type
interface AdminAuthContextType {
  adminUser: AdminUser | null;
  isAdminAuthenticated: boolean;
  adminLogin: (username: string, password: string) => Promise<AdminUser | null>;
  adminLogout: () => void;
}

// Create context with default value
const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

// Provider props type
interface AdminAuthProviderProps {
  children: ReactNode;
}

// Storage key for admin user
const ADMIN_USER_STORAGE_KEY = 'admin_user';

export const AdminAuthProvider = ({ children }: AdminAuthProviderProps) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  
  // Check if user is already logged in on mount
  useEffect(() => {
    const storedUser = localStorage.getItem(ADMIN_USER_STORAGE_KEY);
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setAdminUser(parsedUser);
      setIsAdminAuthenticated(true);
    }
    
    // Initialize admin user if none exists
    initializeAdminUser();
  }, []);
  
  // Initialize default admin user if none exists
  const initializeAdminUser = () => {
    const existingAdmins = localStorage.getItem('admin_users');
    
    if (!existingAdmins) {
      const defaultAdmin: AdminUser = {
        id: '1',
        username: 'admin',
        password: 'admin123', // In a real app, this would be hashed
        name: 'Admin User',
        role: 'admin'
      };
      
      localStorage.setItem('admin_users', JSON.stringify([defaultAdmin]));
    }
  };
  
  // Admin login function
  const adminLogin = async (username: string, password: string): Promise<AdminUser | null> => {
    // In a real app, this would be an API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const admins = localStorage.getItem('admin_users');
        if (admins) {
          const parsedAdmins = JSON.parse(admins) as AdminUser[];
          const foundUser = parsedAdmins.find(
            (admin) => admin.username === username && admin.password === password
          );
          
          if (foundUser) {
            // Store user in local storage without password
            const { password, ...userWithoutPassword } = foundUser;
            const safeUser = { ...userWithoutPassword, password: '******' };
            localStorage.setItem(ADMIN_USER_STORAGE_KEY, JSON.stringify(safeUser));
            
            setAdminUser(safeUser as AdminUser);
            setIsAdminAuthenticated(true);
            resolve(safeUser as AdminUser);
          } else {
            resolve(null);
          }
        } else {
          resolve(null);
        }
      }, 500); // simulate API delay
    });
  };
  
  // Admin logout function
  const adminLogout = () => {
    localStorage.removeItem(ADMIN_USER_STORAGE_KEY);
    setAdminUser(null);
    setIsAdminAuthenticated(false);
  };
  
  // Context value
  const value = {
    adminUser,
    isAdminAuthenticated,
    adminLogin,
    adminLogout
  };
  
  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

// Custom hook to use admin auth context
export const useAdminAuth = (): AdminAuthContextType => {
  const context = useContext(AdminAuthContext);
  
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  
  return context;
}; 
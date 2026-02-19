import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

const CREDENTIALS = { username: 'admin', password: 'admin123' };

export const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(() => {
    return localStorage.getItem('authenticated') === 'true';
  });
  const [username, setUsername] = useState(() => {
    return localStorage.getItem('username') || '';
  });

  const login = useCallback((inputUsername, inputPassword) => {
    if (inputUsername === CREDENTIALS.username && inputPassword === CREDENTIALS.password) {
      setAuthenticated(true);
      setUsername(inputUsername);
      localStorage.setItem('authenticated', 'true');
      localStorage.setItem('username', inputUsername);
      return { success: true };
    }
    return { success: false, error: 'Invalid username or password.' };
  }, []);

  const logout = useCallback(() => {
    setAuthenticated(false);
    setUsername('');
    localStorage.removeItem('authenticated');
    localStorage.removeItem('username');
  }, []);

  return (
    <AuthContext.Provider value={{ authenticated, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

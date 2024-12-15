import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

const USERS_STORAGE_KEY = 'app_users';
const CURRENT_USER_KEY = 'current_user';

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem(USERS_STORAGE_KEY);
    return savedUsers ? JSON.parse(savedUsers) : [];
  });
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem(CURRENT_USER_KEY);
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  }, [currentUser]);

  const register = (userData) => {
    const existingUser = users.find(user => user.email === userData.email);
    if (existingUser) {
      throw new Error('Пользователь с таким email уже существует');
    }

    const newUser = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      password: userData.password, // В реальном приложении пароль должен быть захеширован
      avatar: null,
      createdAt: new Date().toISOString(),
    };

    setUsers(prevUsers => [...prevUsers, newUser]);
    setCurrentUser(newUser);
    navigate('/dashboard');
  };

  const login = (email, password) => {
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
      throw new Error('Неверный email или пароль');
    }

    setCurrentUser(user);
    navigate('/dashboard');
  };

  const logout = () => {
    setCurrentUser(null);
    navigate('/login');
  };

  const updateProfile = (userId, updates) => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === userId
          ? { ...user, ...updates }
          : user
      )
    );

    if (currentUser?.id === userId) {
      setCurrentUser(prev => ({ ...prev, ...updates }));
    }
  };

  const updatePassword = (userId, currentPassword, newPassword) => {
    const user = users.find(u => u.id === userId);
    if (!user || user.password !== currentPassword) {
      throw new Error('Текущий пароль неверен');
    }

    updateProfile(userId, { password: newPassword });
  };

  const value = {
    currentUser,
    users,
    register,
    login,
    logout,
    updateProfile,
    updatePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth должен использоваться внутри AuthProvider');
  }
  return context;
};

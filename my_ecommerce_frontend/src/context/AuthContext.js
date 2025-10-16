import { createContext, useState, useEffect } from 'react';
import { getToken, removeToken } from '../utils/tokenStorage';
import { Alert } from 'react-native';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    const loadTokens = async () => {
      const storedToken = await getToken('accessToken');
      if (storedToken) setAccessToken(storedToken);
    };
    loadTokens();
  }, []);

  const logout = async () => {
    await removeToken('accessToken');
    await removeToken('refreshToken');
    setAccessToken(null);
    Alert.alert('Success', 'Logged out successfully!');
  };

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

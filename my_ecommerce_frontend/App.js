import React, { useContext } from 'react';
import { AuthContext, AuthProvider } from './src/context/AuthContext';
import LoginScreen from './src/screens/LoginScreen';
import ProductScreen from './src/screens/ProductScreen';

const Main = () => {
  const { accessToken } = useContext(AuthContext);
  return accessToken ? <ProductScreen /> : <LoginScreen />;
};

export default function App() {
  return (
    <AuthProvider>
      <Main />
    </AuthProvider>
  );
}

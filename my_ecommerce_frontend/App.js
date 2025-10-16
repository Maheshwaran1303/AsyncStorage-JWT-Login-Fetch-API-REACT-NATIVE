import React, { useContext } from 'react';
import { AuthContext, AuthProvider } from './src/context/AuthContext';
import LoginScreen from './src/screens/LoginScreen';
import ProductScreen from './src/screens/ProductScreen';
import SplashScreen from './src/screens/SplashScreen';

const Main = () => {
  const { accessToken } = useContext(AuthContext);

  // When token is null initially, show SplashScreen
  if (accessToken === undefined) {
    return <SplashScreen />;
  }

  return accessToken ? <ProductScreen /> : <LoginScreen />;
};

export default function App() {
  return (
    <AuthProvider>
      <Main />
    </AuthProvider>
  );
}

import React, { useEffect, useContext } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Image } from 'react-native';
import { getToken } from '../utils/tokenStorage';
import { AuthContext } from '../context/AuthContext';

export default function SplashScreen() {
  const { setAccessToken } = useContext(AuthContext);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Simulate short delay for logo animation
        await new Promise(resolve => setTimeout(resolve, 1500));

        const access = await getToken('accessToken');
        const refresh = await getToken('refreshToken');

        if (access && refresh) {
          console.log('✅ Tokens found, navigating to Product Screen');
          setAccessToken(access);
        } else {
          console.log('⚠️ No tokens found, navigating to Login Screen');
          setAccessToken(null);
        }
      } catch (err) {
        console.error('Error checking tokens:', err);
        setAccessToken(null);
      }
    };

    checkAuthStatus();
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/logo.png')} // add your logo here
        style={styles.logo}
      />
      <Text style={styles.title}>E-Commerce App</Text>
      <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 20 }} />
      <Text style={styles.subtitle}>Loading...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
    borderRadius: 60,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
});

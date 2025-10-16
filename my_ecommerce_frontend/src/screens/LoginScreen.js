import { useState, useContext } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { loginUser } from '../api/authApi';
import { AuthContext } from '../context/AuthContext';
import styles from '../styles/styles';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { setAccessToken } = useContext(AuthContext);

  const handleLogin = async () => {
    try {
      const data = await loginUser(username, password);
      setAccessToken(data.access);
      Alert.alert('Success', 'Logged in successfully!');
    } catch (err) {
      Alert.alert('Login Error', err.message || 'Invalid credentials.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput style={styles.input} placeholder="Username" value={username} onChangeText={setUsername} />
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}


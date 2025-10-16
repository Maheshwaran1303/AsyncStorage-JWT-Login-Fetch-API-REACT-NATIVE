* * * * *

📁 Folder Structure
-------------------

```
EcommerceApp/
├── App.js
├── package.json
├── src/
│   ├── api/
│   │   ├── apiConfig.js
│   │   ├── authApi.js
│   │   └── productApi.js
│   ├── context/
│   │   └── AuthContext.js
│   ├── screens/
│   │   ├── LoginScreen.js
│   │   ├── ProductScreen.js
│   │   └── SplashScreen.js
│   ├── components/
│   │   └── ProductItem.js
│   ├── utils/
│   │   └── tokenStorage.js
│   └── styles/
│       └── styles.js

```

* * * * *

🧠 Step-by-Step File Explanation
--------------------------------

Let's go through each file one by one.

* * * * *

### **1️⃣ src/api/apiConfig.js**

> Base API URL configuration.

```
// Your Device IP Address
export const API_BASE_URL = "http://192.168.59.170:8000/api";

```

* * * * *

### **2️⃣ src/utils/tokenStorage.js**

> Handles AsyncStorage for saving, retrieving, and removing JWT tokens.

```
import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeToken = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
    console.log(`${key} stored successfully.`);
  } catch (e) {
    console.error(`Error storing ${key}:`, e);
  }
};

export const getToken = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? value : null;
  } catch (e) {
    console.error(`Error retrieving ${key}:`, e);
    return null;
  }
};

export const removeToken = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    console.log(`${key} removed successfully.`);
  } catch (e) {
    console.error(`Error removing ${key}:`, e);
  }
};

```

* * * * *

### **3️⃣ src/api/authApi.js**

> Handles login and token refresh logic.

```
import { API_BASE_URL } from './apiConfig';
import { storeToken, getToken, removeToken } from '../utils/tokenStorage';

export const loginUser = async (username, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/token/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || 'Login failed');
    }

    await storeToken('accessToken', data.access);
    await storeToken('refreshToken', data.refresh);

    return data;
  } catch (error) {
    console.error('Login Error:', error);
    throw error;
  }
};

export const refreshAccessToken = async () => {
  try {
    const refreshToken = await getToken('refreshToken');
    if (!refreshToken) throw new Error('No refresh token available.');

    const response = await fetch(`${API_BASE_URL}/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.detail || 'Failed to refresh token.');

    await storeToken('accessToken', data.access);
    await storeToken('refreshToken', data.refresh);
    console.log('Token refreshed successfully!');
    return data.access;
  } catch (error) {
    console.error('Refresh Token Error:', error);
    await removeToken('accessToken');
    await removeToken('refreshToken');
    return null;
  }
};

```

* * * * *

### **4️⃣ src/api/productApi.js**

> Handles fetching products and retrying on token expiry.

```
import { API_BASE_URL } from './apiConfig';
import { getToken } from '../utils/tokenStorage';
import { refreshAccessToken } from './authApi';

export const fetchProducts = async () => {
  let token = await getToken('accessToken');

  try {
    const response = await fetch(`${API_BASE_URL}/products/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      console.log('Access token expired. Refreshing...');
      token = await refreshAccessToken();
      if (token) return fetchProducts(); // retry
      throw new Error('Session expired. Please login again.');
    }

    if (!response.ok) throw new Error(`Error ${response.status}`);

    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

```

* * * * *

### **5️⃣ src/context/AuthContext.js**

> Provides global authentication state and logout function.

```
import React, { createContext, useState, useEffect } from 'react';
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

```

* * * * *

### **6️⃣ src/components/ProductItem.js**

> UI component to display each product.

```
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ProductItem = ({ item }) => (
  <View style={styles.productItem}>
    <Text style={styles.name}>{item.name}</Text>
    <Text style={styles.price}> ${Number(item.price || 0).toFixed(2)}</Text>
    <Text style={styles.category}>{item.category}</Text>
  </View>
);

const styles = StyleSheet.create({
  productItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    elevation: 3,
  },
  name: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  price: { fontSize: 16, color: '#007bff', marginTop: 5 },
  category: { fontSize: 14, color: '#666', marginTop: 3 },
});

export default ProductItem;

```

* * * * *

### **7️⃣ src/screens/LoginScreen.js**

> Handles user login UI and logic.

```
import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { loginUser } from '../api/authApi';
import { AuthContext } from '../context/AuthContext';

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

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginBottom: 10 },
});

```

* * * * *

### **8️⃣ src/screens/ProductScreen.js**

> Displays products after successful login.

```
import React, { useContext, useState } from 'react';
import { View, Button, FlatList, Text, ActivityIndicator, Alert } from 'react-native';
import { fetchProducts } from '../api/productApi';
import ProductItem from '../components/ProductItem';
import { AuthContext } from '../context/AuthContext';

export default function ProductScreen() {
  const { logout } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Button title="Fetch Products" onPress={loadProducts} />
      <Button title="Logout" onPress={logout} color="red" />
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList data={products} keyExtractor={(item) => item.id.toString()} renderItem={({ item }) => <ProductItem item={item} />} />
      )}
    </View>
  );
}

```

* * * * *

### **9️⃣ App.js**

> Entry point -- switches between login and product screens.

```
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

```

* * * * *

⚙️ Installation Commands
------------------------

```
npx create-expo-app EcommerceApp --template
Select Default

cd EcommerceApp
npm install @react-native-async-storage/async-storage

```

Then replace files according to the structure above.

* * * * *

✅ Output
--------

-   🧩 Login → store tokens in AsyncStorage

-   🔐 Auto-fetch JWT access token

-   📦 Fetch products using protected endpoint

-   🔁 Token auto-refresh on expiry

-   🚪 Logout clears tokens

* * * * *


**your React Native app cannot reach your Django backend**. 
* * * * *

1️⃣ **Check Your Django Server Binding**
----------------------------------------

When using a real device or emulator, `127.0.0.1` will not work. Also, your backend must listen on your LAN IP.

Run Django like this:

`python manage.py runserver 0.0.0.0:8000`

-   `0.0.0.0` allows access from other devices on the network.

-   Make sure your firewall allows incoming connections on port `8000`.

* * * * *

2️⃣ **Confirm Your Computer's IP Address**
------------------------------------------

-   **Windows:** `ipconfig` → check `IPv4 Address`

-   **Mac/Linux:** `ifconfig` → check `inet` under Wi-Fi/Ethernet

Let's say your IP is `192.168.1.5` → keep it in `BASE_URL`.

* * * * *

3️⃣ **Update React Native API Base URL**
----------------------------------------

`// src/api/authApi.js
import axios from "axios";

const BASE_URL = "http://192.168.1.2:8000/api"; // Use your PC IP

* * * * *

4️⃣ **Allow CORS in Django**
----------------------------

Install CORS headers:

`pip install django-cors-headers`

In `settings.py`:

`INSTALLED_APPS = [
    ...
    'corsheaders',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # must be first
    'django.middleware.common.CommonMiddleware',
    ...
]

# Allow your local network IP
CORS_ALLOWED_ORIGINS = [
    "http://localhost:8081",  # Metro bundler
    "http://192.168.1.5:8081",  # Device connection
]`

Or, for testing only:

`CORS_ALLOW_ALL_ORIGINS = True`

* * * * *

5️⃣ **Check Device/Emulator Network**
-------------------------------------

-   Ensure **device and PC are on the same Wi-Fi network**.

-   Physical device must reach `http://192.168.1.5:8000`. Test via browser on device.

* * * * *

6️⃣ **Test API in Browser or Postman**
--------------------------------------

Open on the same device:

`http://192.168.1.2 :8000/api/token/`

-   If reachable → React Native should work.

-   If not → Network/firewall issue.

* * * * *

7️⃣ **Test API in React Native**

✅ Step 1 — Open settings.py in your Django project

Find the line:

ALLOWED_HOSTS = []


Change it to:

ALLOWED_HOSTS = ['192.168.1.2', 'localhost', '127.0.0.1']


💡 Tip:
If your IP changes often (e.g., DHCP), use a wildcard to allow all:

ALLOWED_HOSTS = ['*']


✅ Safe for development only — don’t use ['*'] in production.

✅ Step 2 — Restart the Django server

After saving settings.py, run:

python manage.py runserver 0.0.0.0:8000

✅ Step 3 — Test Again

On your phone’s browser, visit:

http://192.168.1.2:8000/


You should now see your Django page without any error. 🎉

Then, test your React Native login again — it will now successfully connect and authenticate.
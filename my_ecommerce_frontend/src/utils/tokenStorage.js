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

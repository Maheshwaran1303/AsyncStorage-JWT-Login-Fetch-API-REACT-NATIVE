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

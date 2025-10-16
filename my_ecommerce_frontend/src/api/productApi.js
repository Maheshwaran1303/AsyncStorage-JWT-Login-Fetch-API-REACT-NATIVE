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

import axios from 'axios';

const BASE_URL =
  process.env.NEXT_PUBLIC_API_TRACKING ||
  process.env.API_TRACKING ||
  '';

const axiosInstance = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response || error.message);
    return Promise.reject(error);
  }
);

export default axiosInstance;

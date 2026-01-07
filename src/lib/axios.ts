import axios from 'axios';
import { clearCookies, getAccessToken, removeAccessToken, setAccessToken } from 'src/utils/token';

const baseURL = import.meta.env.VITE_REACT_APP_API_URL;
const apiKey = import.meta.env.VITE_REACT_APP_API_KEY;

// Instance chính dùng cho tất cả request bình thường (có interceptor)
export const api = axios.create({
  baseURL,
  withCredentials: true,
});

// Instance riêng để gọi refresh token (KHÔNG có response interceptor để tránh loop)
const refreshApi = axios.create({
  baseURL,
  withCredentials: true,
});

// Thêm x-api-key cho refresh instance nếu backend yêu cầu
if (apiKey) {
  refreshApi.defaults.headers['x-api-key'] = apiKey;
}

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token as string);
    }
  });
  failedQueue = [];
};

// Interceptor request: thêm Authorization và x-api-key
api.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (config.headers) {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (apiKey) {
      config.headers['x-api-key'] = apiKey;
    }
  }

  return config;
});

// Interceptor response: xử lý 401 và refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const isLogoutRequest = originalRequest?.url?.includes('/auth/logout');

    if (error.response?.status === 401 && isLogoutRequest) {
      removeAccessToken();
      localStorage.removeItem('refresh_token');
      clearCookies();
      window.location.href = `/signin`;
      return Promise.reject(error);
    }

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/refresh')
    ) {
      if (isRefreshing) {
        // Đang refresh → đưa request vào queue chờ
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            if (apiKey) {
              originalRequest.headers['x-api-key'] = apiKey;
            }
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await refreshApi.post('/auth/refresh', {});

        const newAccessToken = res.data.data.accessToken;
        setAccessToken(newAccessToken);

        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        if (apiKey) {
          originalRequest.headers['x-api-key'] = apiKey;
        }

        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        removeAccessToken();
        localStorage.removeItem('refresh_token');
        clearCookies();
        window.location.href = `/signin`;

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

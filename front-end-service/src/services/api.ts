import axios from 'axios';
import { getIdToken, getCurrentSession } from './cognito';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_ENDPOINT || '',
  headers: {
    'Content-Type': 'application/json',
  },
});

// リクエストインターセプター: Authorization ヘッダーを自動付与
api.interceptors.request.use(async (config) => {
  const token = await getIdToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// レスポンスインターセプター: 401 時にトークンリフレッシュしてリトライ
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // getCurrentSession は内部でトークンリフレッシュを行う
        const session = await getCurrentSession();
        if (session && session.isValid()) {
          const newToken = session.getIdToken().getJwtToken();
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch {
        // リフレッシュ失敗 → ログイン画面へ
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

export default api;

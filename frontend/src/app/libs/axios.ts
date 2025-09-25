
import axios, { AxiosError } from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

let isRefreshing = false;
let queue: Array<{ resolve: () => void; reject: (e?: any) => void }> = [];

function flushQueue(error?: any) {
  queue.forEach(p => (error ? p.reject(error) : p.resolve()));
  queue = [];
}

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as any;
    const status = error.response?.status;

    if (status === 401 && !original?._retry) {
      original._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          await api.post('/auth/refresh'); 
          flushQueue();
          return api(original);
        } catch (e) {
          flushQueue(e);
         
          return Promise.reject(e);
        } finally {
          isRefreshing = false;
        }
      }
      return new Promise((resolve, reject) => {
        queue.push({
          resolve: () => api(original!).then(resolve).catch(reject),
          reject,
        });
      });
    }

    return Promise.reject(error);
  }
);

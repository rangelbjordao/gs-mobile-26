import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { API_BASE_URL } from "./apiConfig";
import { wakeUpApi } from "./wakeUpApi";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    try {
      if (config.url === "/users/login" || config.url === "/users") {
        return config;
      }

      const token = await SecureStore.getItemAsync("user_token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Erro no interceptor de requisição", error);
    }
    return config;
  },
  (error) => Promise.reject(error),
);

let isWakingUp = false;
let wakePromise: Promise<boolean> | null = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!error.response && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        if (!isWakingUp) {
          isWakingUp = true;
          wakePromise = wakeUpApi();
        }

        const ok = await wakePromise;
        isWakingUp = false;

        if (!ok) {
          throw new Error(
            "Não foi possível conectar ao servidor orbital. Por favor, tente novamente mais tarde.",
          );
        }

        return api(originalRequest);
      } catch (wakeError) {
        isWakingUp = false;
        return Promise.reject(wakeError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;

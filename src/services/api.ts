import axios from "axios";
import * as SecureStore from "expo-secure-store";

const api = axios.create({
  baseURL: "http://192.168.15.58:8080/api",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
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

export default api;

import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import * as SecureStore from "expo-secure-store";

const api = axios.create({
  baseURL: "http://localhost:8080",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// MOCK DA API (REMOVER QUANDO O BACKEND ESTIVER PRONTO)
const mock = new MockAdapter(api, { delayResponse: 2000 });

// Simulando o endpoint de POST /auth/login
mock.onPost("/auth/login").reply((config) => {
  const { email, senha } = JSON.parse(config.data);

  // Se o e-mail for preenchido, finge que logou com sucesso e manda um token
  if (email && senha) {
    return [
      200,
      { token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.falsoTokenGSAgro" },
    ];
  }
  return [400, { message: "Usuário ou senha inválidos" }];
});

// Simulando o endpoint de POST /auth/cadastrar
mock
  .onPost("/auth/cadastrar")
  .reply(201, { message: "Usuário criado com sucesso!" });
// ==========================================

// Interceptor original (continua funcionando igual)
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync("user_token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Erro ao injetar token", error);
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default api;

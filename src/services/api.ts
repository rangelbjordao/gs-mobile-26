import { Tour } from "@/types/tour";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import * as SecureStore from "expo-secure-store";

const api = axios.create({
  baseURL: "http://localhost:8080",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// ==========================================
// 🌌 MOCK DE DADOS - ORBITPASS
// ==========================================
const mock = new MockAdapter(api, { delayResponse: 1200 }); // Delay para ver o Loader ativo

// Dados falsos de Tours Espaciais para renderizar o app
const toursMockados: Tour[] = [
  {
    id: 1,
    nome: "Experiência Órbita Azul",
    destino: "Órbita Terrestre Baixa",
    descricao:
      "Contemple a curvatura da Terra e experimente a gravidade zero por 3 dias a bordo da estação OrbitPass Alpha.",
    duracao_dias: 3,
    preco: 250000,
    capacidade_maxima: 6,
    imagem:
      "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?q=80&w=400",
  },
  {
    id: 2,
    nome: "Legado de Artemis",
    destino: "Órbita e Superfície Lunar",
    descricao:
      "Uma jornada inesquecível passando pelo lado oculto da Lua, com direito a um pouso histórico na Cratera Shackleton.",
    duracao_dias: 7,
    preco: 750000,
    capacidade_maxima: 4,
    imagem:
      "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=400",
  },
  {
    id: 3,
    nome: "Horizonte Vermelho",
    destino: "Sobrevoo de Marte",
    descricao:
      "A maior aventura da humanidade. Um voo de estande de longa duração sobrevoando os cânions de Valles Marineris no planeta vermelho.",
    duracao_dias: 45,
    preco: 2500000,
    capacidade_maxima: 8,
    imagem:
      "https://images.unsplash.com/photo-1612892483236-42d68a57623d?q=80&w=400",
  },
];

// Mock do Login
mock.onPost("/auth/login").reply(200, { token: "token-jwt-falso-orbitpass" });
mock.onPost("/auth/cadastrar").reply(21);

// Mock da Listagem de Tours (GET /tours)
mock.onGet("/tours").reply(200, toursMockados);
// ==========================================

api.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync("user_token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Erro interceptor", error);
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default api;

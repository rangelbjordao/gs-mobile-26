import api from '@/services/api';
import { useRouter, useSegments } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';

interface AuthContextType {
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  cadastrar: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    async function loadStorageData() {
      try {
        const storedToken = await SecureStore.getItemAsync('user_token');
        if (storedToken) {
          setToken(storedToken);
        }
      } catch (e) {
        console.error('Erro ao ler o SecureStore', e);
        Alert.alert('Erro de Inicialização', 'Não foi possível carregar os dados locais da sessão.');
      } finally {
        setIsLoading(false);
      }
    }
    loadStorageData();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const currentSegment = segments[0] as string;
    const inAuthGroup = currentSegment === '(auth)';

    if (!token && !inAuthGroup) {
      router.replace('/(auth)/login' as any);
    } else if (token && inAuthGroup) {
      router.replace('/(app)/(tabs)' as any);
    }
  }, [token, isLoading, segments]);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/users/login', { email, password });
      const { token: jwtToken } = response.data;

      await SecureStore.setItemAsync('user_token', jwtToken);
      setToken(jwtToken);
    } catch (e: any) {
      console.warn(`[Login] Falha na requisição: Status ${e.response?.status}`);
      throw e;
    }
  };

  const cadastrar = async (name: string, email: string, password: string) => {
    try {
      await api.post('/users', {
        name,
        email,
        password,
        role: "DEFAULT_USER"
      });
    } catch (e: any) {
      console.warn(`[Cadastro] Falha na requisição: Status ${e.response?.status}`);
      throw e;
    }
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync('user_token');
      setToken(null);
    } catch (e) {
      console.error('Erro ao remover token', e);
      Alert.alert('Erro ao Sair', 'Não foi possível encerrar a sessão com segurança.');
    }
  };

  return (
    <AuthContext.Provider value={{ token, isLoading, login, cadastrar, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }
  return context;
}
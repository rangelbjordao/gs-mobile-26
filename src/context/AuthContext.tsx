import api from '@/services/api';
import { User } from '@/types/usuario';
import { useRouter, useSegments } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';

interface AuthContextType {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  cadastrar: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function extrairUsuarioDoToken(jwtToken: string): User | null {
  try {
    const payloadBase64 = jwtToken.split('.')[1];
    const payloadString = decodeURIComponent(
      atob(payloadBase64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const payloadJson = JSON.parse(payloadString);

    const emailLogin = payloadJson.sub;
    const parteNome = emailLogin ? emailLogin.split('@')[0] : 'Recruta';
    const nomeFormatado = parteNome.charAt(0).toUpperCase() + parteNome.slice(1);

    const authorities = payloadJson.authorities ?? [];

    const ehAdmin = authorities.some((item: any) => {
      if (typeof item === 'string') {
        return item === 'ROLE_ADMIN' || item === 'ADMIN';
      }

      return item.authority === 'ROLE_ADMIN' || item.authority === 'ADMIN';
    });

    return {
      id: payloadJson.id,
      name: payloadJson.name ?? nomeFormatado,
      email: emailLogin ?? 'astronauta@orbitpass.com',
      role: payloadJson.role ?? (ehAdmin ? 'ADMIN' : 'DEFAULT_USER')
    };
  } catch (e) {
    console.error('Falha ao decodificar payload do JWT:', e);
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    async function loadStorageData() {
      try {
        const storedToken = await SecureStore.getItemAsync('user_token');
        if (storedToken) {
          setToken(storedToken);
          const dadosUsuario = extrairUsuarioDoToken(storedToken);
          setUser(dadosUsuario);
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

      const dadosUsuario = extrairUsuarioDoToken(jwtToken);

      setToken(jwtToken);
      setUser(dadosUsuario);
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
      setUser(null);
    } catch (e) {
      console.error('Erro ao remover token', e);
      Alert.alert('Erro ao Sair', 'Não foi possível encerrar a sessão com segurança.');
    }
  };

  return (
    <AuthContext.Provider value={{ token, user, isLoading, login, cadastrar, logout }}>
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
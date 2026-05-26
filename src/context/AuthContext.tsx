import { useRouter, useSegments } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  token: string | null;
  isLoading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  // Busca o token criptografado no dispositivo ao iniciar o app
  useEffect(() => {
    async function loadStorageData() {
      try {
        const storedToken = await SecureStore.getItemAsync('user_token');
        if (storedToken) {
          setToken(storedToken);
        }
      } catch (e) {
        console.error('Erro ao ler o SecureStore', e);
      } finally {
        setIsLoading(false);
      }
    }
    loadStorageData();
  }, []);

  // Monitor de rotas: executa toda vez que o Token ou a rota atual muda
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

  const login = async (userToken: string) => {
    try {
      await SecureStore.setItemAsync('user_token', userToken);
      setToken(userToken);
    } catch (e) {
      console.error('Erro ao salvar token', e);
    }
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync('user_token');
      setToken(null);
    } catch (e) {
      console.error('Erro ao remover token', e);
    }
  };

  return (
    <AuthContext.Provider value={{ token, isLoading, login, logout }}>
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
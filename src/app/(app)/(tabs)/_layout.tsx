import { Ionicons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import React from 'react';
import { TouchableOpacity } from 'react-native';

export default function TabLayout() {
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        headerShown: true,
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
      }}
    >
      {/* Aba 1: Painel Principal / Home */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarLabel: 'Início',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="analytics-outline" size={size} color={color} />
          ),
          // Adiciona o botão de informação no topo direito do cabeçalho
          headerRight: () => (
            <TouchableOpacity
              onPress={() => router.push('/sobre' as any)}
              style={{ marginRight: 15 }}
            >
              <Ionicons name="information-circle-outline" size={24} color="#007AFF" />
            </TouchableOpacity>
          ),
        }}
      />

      {/* Outras abas de funcionalidades do seu CRUD entrarão aqui embaixo */}
      {/* Exemplo: Aba 2: Fazendas/Registros */}

    </Tabs>
  );
}
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import BotaoCustomizado from '../../../components/shared/BotaoCustomizado';
import { useAuth } from '../../../context/AuthContext';

export default function HomeScreen() {
  const { logout } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Painel Principal</Text>
      <Text style={styles.subtitle}>Área protegida do aplicativo</Text>

      <Text style={styles.info}>
        Parabéns! Você passou pela autenticação e a proteção de rotas funcionou de verdade.
      </Text>

      {/* Botão de Logout */}
      <BotaoCustomizado
        title="Sair do Aplicativo"
        onPress={logout}
        style={styles.logoutButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  info: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    width: '80%',
  },
});
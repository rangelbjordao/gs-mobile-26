import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BotaoCustomizado from '../../components/shared/BotaoCustomizado';
import InputCustomizado from '../../components/shared/InputCustomizado';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEntrar = async () => {
    if (!email || !senha) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    setLoading(true);
    try {
      // Faz a chamada como se o backend existisse de verdade
      const response = await api.post('/auth/login', { email, senha });

      // Salva o token falso no SecureStore e destranca o app
      await login(response.data.token);
    } catch (error: any) {
      Alert.alert('Erro no Login', error.response?.data?.message || 'Erro de conexão');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo ao App</Text>

      <InputCustomizado
        label="E-mail"
        placeholder="Digite seu e-mail"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <InputCustomizado
        label="Senha"
        placeholder="Digite sua senha"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      <BotaoCustomizado title="Entrar" loading={loading} onPress={handleEntrar} />

      <TouchableOpacity
        onPress={() => router.push('/(auth)/cadastrar' as any)}
        style={{ marginTop: 20, padding: 10 }}
      >
        <Text style={{ color: '#666', fontSize: 14 }}>
          Não tem uma conta? <Text style={{ color: '#007AFF', fontWeight: 'bold' }}>Cadastre-se</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 30, color: '#333' }
});
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BotaoCustomizado from '../../components/shared/BotaoCustomizado';
import InputCustomizado from '../../components/shared/InputCustomizado';
import { Colors } from '../../constants/Colors';
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
      const response = await api.post('/auth/login', { email, senha });
      await login(response.data.token);
    } catch (error: any) {
      Alert.alert('Erro no Login', error.response?.data?.message || 'Erro de conexão');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>ORBITPASS</Text>
      <Text style={styles.title}>Bem-vindo ao Futuro</Text>

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

      <BotaoCustomizado
        title="Entrar"
        loading={loading}
        onPress={handleEntrar}
        style={styles.button}
      />

      <TouchableOpacity
        onPress={() => router.push('/(auth)/cadastrar' as any)}
        style={styles.linkContainer}
      >
        <Text style={styles.linkText}>
          Não tem uma conta? <Text style={styles.linkBold}>Cadastre-se</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.background
  },
  subtitle: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 2,
    marginBottom: 4
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
    color: Colors.text
  },
  button: {
    backgroundColor: Colors.primary,
    marginTop: 20
  },
  linkContainer: {
    marginTop: 20,
    padding: 10
  },
  linkText: {
    color: Colors.textMuted,
    fontSize: 14
  },
  linkBold: {
    color: Colors.primary,
    fontWeight: 'bold'
  }
});
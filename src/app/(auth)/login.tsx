import BotaoCustomizado from '@/components/shared/BotaoCustomizado';
import InputCustomizado from '@/components/shared/InputCustomizado';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const [erroEmail, setErroEmail] = useState('');
  const [erroSenha, setErroSenha] = useState('');

  const handleEntrar = async () => {
    setErroEmail('');
    setErroSenha('');

    if (!email || !senha) {
      if (!email) setErroEmail('O e-mail é obrigatório.');
      if (!senha) setErroSenha('A senha é obrigatória.');
      return;
    }

    setLoading(true);
    try {
      await login(email, senha);
    } catch (error: any) {
      const status = error.response?.status;
      const apiError = error.response?.data;

      if (status === 401) {
        Alert.alert('Erro no Login', 'E-mail ou senha incorretos.');
        return;
      }

      if (apiError && apiError.details && Array.isArray(apiError.details)) {
        apiError.details.forEach((detalhe: string) => {
          const erroMinusculo = detalhe.toLowerCase();
          if (erroMinusculo.includes('email')) {
            setErroEmail(detalhe);
          } else if (erroMinusculo.includes('password') || erroMinusculo.includes('senha')) {
            setErroSenha(detalhe);
          }
        });
      }
      else {
        const mensagemErro = apiError?.message || apiError || 'E-mail ou senha incorretos.';
        Alert.alert('Erro no Login', typeof mensagemErro === 'string' ? mensagemErro : 'E-mail ou senha incorretos.');
      }
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
        error={erroEmail}
      />

      <InputCustomizado
        label="Senha"
        placeholder="Digite sua senha"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
        error={erroSenha}
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
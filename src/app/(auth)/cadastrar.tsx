import BotaoCustomizado from '@/components/shared/BotaoCustomizado';
import InputCustomizado from '@/components/shared/InputCustomizado';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Cadastrar() {
  const router = useRouter();
  const { cadastrar } = useAuth();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const [erroNome, setErroNome] = useState('');
  const [erroEmail, setErroEmail] = useState('');
  const [erroSenha, setErroSenha] = useState('');

  const handleCadastro = async () => {
    setErroNome('');
    setErroEmail('');
    setErroSenha('');

    if (!nome || !email || !senha) {
      if (!nome) setErroNome('O nome é obrigatório.');
      if (!email) setErroEmail('O e-mail é obrigatório.');
      if (!senha) setErroSenha('A senha é obrigatória.');
      return;
    }

    setLoading(true);
    try {
      await cadastrar(nome, email, senha);

      Alert.alert('Sucesso!', 'Sua conta foi criada com sucesso.', [
        { text: 'Fazer Login', onPress: () => router.replace('/(auth)/login' as any) }
      ]);
    } catch (error: any) {
      const apiError = error.response?.data;

      if (apiError && apiError.details && Array.isArray(apiError.details)) {
        apiError.details.forEach((detalhe: string) => {
          const erroMinusculo = detalhe.toLowerCase();

          if (erroMinusculo.includes('password') || erroMinusculo.includes('senha')) {
            setErroSenha(detalhe);
          } else if (erroMinusculo.includes('email')) {
            setErroEmail(detalhe);
          } else if (erroMinusculo.includes('name') || erroMinusculo.includes('nome')) {
            setErroNome(detalhe);
          }
        });
      } else {
        Alert.alert('Erro no Cadastro', apiError?.message || 'Falha ao conectar ao servidor.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Conta</Text>
      <Text style={styles.subtitle}>Cadastre-se para acessar a plataforma</Text>

      <InputCustomizado
        label="Nome Completo"
        placeholder="Digite seu nome"
        value={nome}
        onChangeText={setNome}
        error={erroNome}
      />

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
        placeholder="Crie uma senha segura"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
        error={erroSenha}
      />

      <BotaoCustomizado
        title="Cadastrar"
        loading={loading}
        onPress={handleCadastro}
        style={styles.button}
      />

      <TouchableOpacity
        onPress={() => router.replace('/(auth)/login' as any)}
        style={styles.linkContainer}
      >
        <Text style={styles.linkText}>Já tem uma conta? <Text style={styles.linkBold}>Faça login</Text></Text>
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
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4
  },
  subtitle: {
    fontSize: 15,
    color: Colors.textMuted,
    marginBottom: 30
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
    fontSize: 14,
    color: Colors.textMuted
  },
  linkBold: {
    color: Colors.primary,
    fontWeight: 'bold'
  }
});
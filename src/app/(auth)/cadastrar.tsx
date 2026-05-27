import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BotaoCustomizado from '../../components/shared/BotaoCustomizado';
import InputCustomizado from '../../components/shared/InputCustomizado';
import { Colors } from '../../constants/Colors';
import api from '../../services/api';

export default function Cadastrar() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCadastro = async () => {
    if (!nome || !email || !senha) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/cadastrar', { nome, email, senha });

      Alert.alert('Sucesso!', 'Sua conta foi criada com sucesso.', [
        { text: 'Fazer Login', onPress: () => router.replace('/(auth)/login' as any) }
      ]);
    } catch (error: any) {
      Alert.alert('Erro no Cadastro', error.response?.data?.message || 'Falha ao conectar ao servidor.');
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
      />

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
        placeholder="Crie uma senha segura"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
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
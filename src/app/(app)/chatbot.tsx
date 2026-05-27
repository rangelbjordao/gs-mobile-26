import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Mensagem {
  id: string;
  texto: string;
  remetente: 'USUARIO' | 'IA';
  horario: string;
}

export default function ChatbotIA() {
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  const [input, setInput] = useState('');


  const [mensagens, setMensagens] = useState<Mensagem[]>([
    {
      id: '1',
      texto: "Olá, Recruta! Sou o OrbitBot, sua inteligência artificial para viagens espaciais. Como posso te ajudar na sua próxima decolagem?",
      remetente: 'IA',
      horario: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const handleEnviar = async () => {
    if (!input.trim()) return;

    const horarioAtual = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    const novaMensagemUsuario: Mensagem = {
      id: Math.random().toString(),
      texto: input.trim(),
      remetente: 'USUARIO',
      horario: horarioAtual
    };

    // Adiciona a mensagem do usuário na tela
    setMensagens(prev => [...prev, novaMensagemUsuario]);
    setInput('');

    // Rola a lista para o fim
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);

    /* ESPAÇO RESERVADO PARA A INTEGRAÇÃO COM A API FUTURA:
      
      try {
        const response = await api.post('/chatbot', { mensagem: novaMensagemUsuario.texto });
        
        const novaMensagemIA: Mensagem = {
          id: Math.random().toString(),
          texto: response.data.resposta, // Ajustar conforme o retorno do Spring AI
          remetente: 'IA',
          horario: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        };
        
        setMensagens(prev => [...prev, novaMensagemIA]);
        setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
      } catch (error) {
        console.error("Erro ao integrar com a IA:", error);
      }
    */
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      {/* Header */}
      <View style={styles.navHeader}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.navTitle}>OrbitBot IA</Text>
          <View style={styles.statusContainer}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Sistemas Online</Text>
          </View>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* Área do Chat */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <FlatList
          ref={flatListRef}
          data={mensagens}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.chatContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const ehUsuario = item.remetente === 'USUARIO';
            return (
              <View style={[styles.messageRow, ehUsuario ? styles.rowUsuario : styles.rowIA]}>
                {!ehUsuario && (
                  <View style={styles.avatarBot}>
                    <Ionicons name="planet" size={16} color={Colors.background} />
                  </View>
                )}
                <View style={[styles.bubble, ehUsuario ? styles.bubbleUsuario : styles.bubbleIA]}>
                  <Text style={styles.messageText}>{item.texto}</Text>
                  <Text style={styles.horarioText}>{item.horario}</Text>
                </View>
              </View>
            );
          }}
        />

        {/* Input fixo na parte inferior */}
        <View style={styles.inputArea}>
          <TextInput
            style={styles.textInput}
            placeholder="Digite sua dúvida espacial..."
            placeholderTextColor={Colors.textMuted}
            value={input}
            onChangeText={setInput}
            onSubmitEditing={handleEnviar}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleEnviar} activeOpacity={0.8}>
            <Ionicons name="send" size={18} color={Colors.background} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  navHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleContainer: {
    alignItems: 'center',
  },
  navTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#34C759',
    marginRight: 5,
  },
  statusText: {
    color: Colors.textMuted,
    fontSize: 11,
  },
  chatContent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 16,
    maxWidth: '85%',
  },
  rowIA: {
    alignSelf: 'flex-start',
    alignItems: 'flex-end',
  },
  rowUsuario: {
    alignSelf: 'flex-end',
  },
  avatarBot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginBottom: 4,
  },
  bubble: {
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  bubbleIA: {
    backgroundColor: Colors.surface,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  bubbleUsuario: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
  },
  messageText: {
    color: Colors.text,
    fontSize: 15,
    lineHeight: 20,
  },
  horarioText: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputArea: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    height: 46,
    backgroundColor: Colors.surface,
    borderRadius: 23,
    paddingHorizontal: 18,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
    fontSize: 15,
  },
  sendButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
});
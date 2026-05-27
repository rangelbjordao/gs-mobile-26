import CardTour from '@/components/tours/CardTour';
import { Colors } from '@/constants/Colors';
import api from '@/services/api';
import { Tour } from '@/types/tour';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const router = useRouter();
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarTours() {
      try {
        const response = await api.get('/tours');
        setTours(response.data);
      } catch (error) {
        console.error('Erro ao buscar tours espaciais:', error);
      } finally {
        setLoading(false);
      }
    }

    carregarTours();
  }, []);

  const handleIrParaDetalhes = (idTour: number) => {
    router.push({
      pathname: '/(app)/tours/detalhes',
      params: { id: idTour }
    } as any);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loaderText}>Sincronizando rotas espaciais...</Text>
        </View>
      ) : (
        <FlatList
          data={tours}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <CardTour
              tour={item}
              onPress={() => handleIrParaDetalhes(item.id)}
            />
          )}

          ListHeaderComponent={
            <View style={styles.headerContainer}>
              <Text style={styles.subtitle}>Bem-vindo ao Futuro</Text>
              <Text style={styles.title}>Explore o Espaço</Text>
            </View>
          }

          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* BOTÃO FLUTUANTE DA IA */}
      <TouchableOpacity
        style={styles.fabButton}
        onPress={() => router.push('/chatbot')}
        activeOpacity={0.8}
      >
        <Ionicons name="planet" size={26} color={Colors.background} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerContainer: {
    paddingHorizontal: 0,
    paddingTop: 20,
    paddingBottom: 25,
  },
  subtitle: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    color: Colors.text,
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 4,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    color: Colors.textMuted,
    marginTop: 12,
    fontSize: 14,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 80,
  },
  fabButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: Colors.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
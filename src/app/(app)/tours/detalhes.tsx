import BotaoCustomizado from '@/components/shared/BotaoCustomizado';
import { Colors } from '@/constants/Colors';
import api from '@/services/api';
import { Tour } from '@/types/tour';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DetalhesTour() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarDetalhes() {
      try {
        const response = await api.get('/tours');
        const tourEncontrado = response.data.find((t: Tour) => t.id === Number(id));
        setTour(tourEncontrado || null);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    carregarDetalhes();
  }, [id]);

  const handleIrParaPagamento = () => {
    if (!tour) return;
    router.push({
      pathname: '/(app)/tours/pagamento',
      params: { id: tour.id }
    } as any);
  };

  const formatarPreco = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!tour) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Destino não encontrado.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      <View style={styles.navHeader}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Detalhes da Missão</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {tour.imagem && (
          <Image source={{ uri: tour.imagem }} style={styles.image} />
        )}

        <View style={styles.content}>
          <View style={styles.badge}>
            <Ionicons name="planet" size={14} color={Colors.primary} />
            <Text style={styles.badgeText}>{tour.destino.toUpperCase()}</Text>
          </View>

          <Text style={styles.title}>{tour.nome}</Text>

          <View style={styles.infoGrid}>
            <View style={styles.infoCard}>
              <Ionicons name="time" size={20} color={Colors.primary} />
              <Text style={styles.infoLabel}>Duração</Text>
              <Text style={styles.infoValue}>{tour.duracao_dias} dias</Text>
            </View>

            <View style={styles.infoCard}>
              <Ionicons name="people" size={20} color={Colors.primary} />
              <Text style={styles.infoLabel}>Capacidade</Text>
              <Text style={styles.infoValue}>{tour.capacidade_maxima} tripulantes</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Sobre a Missão</Text>
          <Text style={styles.description}>{tour.descricao}</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Investimento por assento</Text>
          <Text style={styles.priceValue}>{formatarPreco(tour.preco)}</Text>
        </View>
        <BotaoCustomizado
          title="Reservar Assento"
          onPress={handleIrParaPagamento}
          style={styles.actionButton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  errorText: {
    color: Colors.textMuted,
    fontSize: 16,
  },
  navHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  image: {
    width: '100%',
    height: 250,
  },
  content: {
    padding: 20,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(76, 201, 240, 0.1)',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
  },
  badgeText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  title: {
    color: Colors.text,
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
    gap: 15,
  },
  infoCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#233142',
  },
  infoLabel: {
    color: Colors.textMuted,
    fontSize: 12,
    marginTop: 8,
    marginBottom: 2,
  },
  infoValue: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: 'bold',
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    color: Colors.textMuted,
    fontSize: 15,
    lineHeight: 24,
  },
  footer: {
    backgroundColor: Colors.surface,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    color: Colors.textMuted,
    fontSize: 12,
    marginBottom: 4,
  },
  priceValue: {
    color: Colors.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  actionButton: {
    flex: 1,
    marginTop: 0,
    marginLeft: 15,
    backgroundColor: Colors.primary,
  },
});
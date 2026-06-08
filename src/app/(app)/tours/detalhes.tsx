import BotaoCustomizado from '@/components/shared/BotaoCustomizado';
import { Colors } from '@/constants/Colors';
import api from '@/services/api';
import { Tour } from '@/types/tour';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function DetalhesTour() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarDetalhes() {
      try {
        const response = await api.get('/tours');

        const item = response.data.find((t: any) => t.id === Number(id));

        if (item) {
          const tourFormatado: Tour = {
            id: item.id,
            nome: item.name ?? "Tour Espacial",
            destino: item.destination ?? "Espaço",
            descricao: item.description ?? "",
            preco: Number(item.price ?? 0),
          };
          setTour(tourFormatado);
        } else {
          setTour(null);
        }
      } catch (error) {
        console.error("Erro ao carregar detalhes do tour:", error);
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
        <Text style={styles.errorText}>Destino espacial não encontrado.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container} >
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      <View style={styles.navHeader}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Detalhes da Missão</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <View style={styles.badge}>
            <Ionicons name="planet" size={14} color={Colors.primary} />
            <Text style={styles.badgeText}>{tour.destino.toUpperCase()}</Text>
          </View>

          <Text style={styles.title}>{tour.nome}</Text>

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
    </View>
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
    marginBottom: 16,
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
    marginBottom: 25,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
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
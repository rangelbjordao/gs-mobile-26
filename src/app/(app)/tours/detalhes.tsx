import BotaoCustomizado from '@/components/shared/BotaoCustomizado';
import { Colors } from '@/constants/Colors';
import api from '@/services/api';
import { DataDisponivel } from '@/types/ticket';
import { Tour } from '@/types/tour';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function DetalhesTour() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [tour, setTour] = useState<Tour | null>(null);
  const [dates, setDates] = useState<DataDisponivel[]>([]);
  const [selectedDateId, setSelectedDateId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarDetalhes() {
      try {
        const responseTours = await api.get('/tours');
        const item = responseTours.data.find((t: any) => Number(t.id) === Number(id));

        if (item) {
          setTour({
            id: item.id,
            nome: item.name ?? "Tour Espacial",
            destino: item.destination ?? "Espaço",
            descricao: item.description ?? "",
            preco: Number(item.price ?? 0),
          });

          const responseDates = await api.get('/tour-dates');

          const datasFiltradas = responseDates.data
            .filter((d: any) => {
              const idTourDaData = d.tourId ?? d.tour?.id;
              return Number(idTourDaData) === Number(item.id);
            })
            .map((d: any) => {
              const totalSpots = d.totalSpots ?? 0;
              const bookedSpots = d.bookedSpots ?? 0;
              const availableSpots = d.availableSpots ?? Math.max(totalSpots - bookedSpots, 0);

              return {
                id: Number(d.id),
                tourId: Number(d.tourId ?? d.tour?.id),
                departureDate: d.departureDate ?? "A definir",
                availableSpots,
              };
            });

          setDates(datasFiltradas);
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
    if (!selectedDateId) {
      Alert.alert('Seleção Obrigatória', 'Por favor, selecione uma data disponível para a sua partida interplanetária.');
      return;
    }

    router.push({
      pathname: '/(app)/tours/pagamento',
      params: {
        tourDateId: String(selectedDateId),
        tourId: String(tour.id),
      },
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
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      <View style={styles.navHeader}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Detalhes do Tour</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <View style={styles.badge}>
            <Ionicons name="planet" size={14} color={Colors.primary} />
            <Text style={styles.badgeText}>{tour.destino.toUpperCase()}</Text>
          </View>

          <Text style={styles.title}>{tour.nome}</Text>

          <Text style={styles.sectionTitle}>Sobre o Tour</Text>
          <Text style={styles.description}>{tour.descricao}</Text>

          <Text style={[styles.sectionTitle, { marginTop: 30 }]}>
            Janelas de Partida Disponíveis
          </Text>

          {dates.length === 0 ? (
            <Text style={styles.noDatesText}>
              Nenhuma janela de lançamento agendada para este destino no momento.
            </Text>
          ) : (
            dates.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.dateCard,
                  selectedDateId === item.id && styles.dateCardSelected,
                  item.availableSpots === 0 && styles.dateCardDisabled
                ]}
                disabled={item.availableSpots === 0}
                onPress={() =>
                  setSelectedDateId((atual) => (atual === item.id ? null : item.id))
                }
              >
                <View>
                  <Text style={styles.dateText}>{item.departureDate}</Text>
                  <Text style={styles.spotsText}>
                    Vagas restantes: {item.availableSpots} assentos
                  </Text>
                </View>

                <Ionicons
                  name={selectedDateId === item.id ? "radio-button-on" : "radio-button-off"}
                  size={22}
                  color={selectedDateId === item.id ? Colors.primary : Colors.textMuted}
                />
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Investimento total</Text>
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
  noDatesText: {
    color: Colors.textMuted,
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 5
  },
  dateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border
  },
  dateCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(76, 201, 240, 0.02)'
  },
  dateCardDisabled: {
    opacity: 0.4
  },
  dateText: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: '600'
  },
  spotsText: {
    color: Colors.primary,
    fontSize: 12,
    marginTop: 4
  },
});
import BotaoCustomizado from '@/components/shared/BotaoCustomizado';
import { Colors } from '@/constants/Colors';
import api from '@/services/api';
import { Tour } from '@/types/tour';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PagamentoTour() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [pagando, setPagando] = useState(false);
  const [metodo, setMetodo] = useState<'CREDITO' | 'PIX'>('CREDITO');

  useEffect(() => {
    async function carregarTour() {
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
    carregarTour();
  }, [id]);

  const handleConfirmarPagamento = async () => {
    setPagando(true);
    try {
      // Simulação da requisição que irá para o backend .NET no futuro
      await new Promise(resolve => setTimeout(resolve, 2000));

      Alert.alert(
        'Sucesso!',
        'Reserva confirmada! Seu bilhete espacial foi gerado com sucesso.',
        [{ text: 'Ver Ingressos', onPress: () => router.replace('/(app)/(tabs)/reservas' as any) }]
      );
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível processar o pagamento.');
    } finally {
      setPagando(false);
    }
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
        <Text style={styles.errorText}>Dados da reserva indisponíveis.</Text>
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
        <Text style={styles.navTitle}>Checkout de Viagem</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumo do Destino</Text>
          <View style={styles.resumoCard}>
            <Text style={styles.tourName}>{tour.nome}</Text>
            <Text style={styles.tourDestino}>{tour.destino}</Text>
            <View style={styles.divider} />
            <View style={styles.row}>
              <Text style={styles.label}>Duração da Estadia</Text>
              <Text style={styles.value}>{tour.duracao_dias} dias</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Assento Reservado</Text>
              <Text style={styles.value}>Classe Orbital 01</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Forma de Pagamento</Text>

          <TouchableOpacity
            style={[styles.metodoCard, metodo === 'CREDITO' && styles.metodoSelecionado]}
            onPress={() => setMetodo('CREDITO')}
            activeOpacity={0.9}
          >
            <Ionicons name="card" size={24} color={metodo === 'CREDITO' ? Colors.primary : Colors.textMuted} />
            <View style={styles.metodoTextContainer}>
              <Text style={styles.metodoTitle}>Cartão de Crédito</Text>
              <Text style={styles.metodoSubtitle}>Em até 12x sem juros espaciais</Text>
            </View>
            <Ionicons
              name={metodo === 'CREDITO' ? "radio-button-on" : "radio-button-off"}
              size={20}
              color={metodo === 'CREDITO' ? Colors.primary : Colors.textMuted}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.metodoCard, metodo === 'PIX' && styles.metodoSelecionado]}
            onPress={() => setMetodo('PIX')}
            activeOpacity={0.9}
          >
            <Ionicons name="qr-code" size={24} color={metodo === 'PIX' ? Colors.primary : Colors.textMuted} />
            <View style={styles.metodoTextContainer}>
              <Text style={styles.metodoTitle}>Pix Interplanetário</Text>
              <Text style={styles.metodoSubtitle}>Confirmação imediata e 5% de desconto</Text>
            </View>
            <Ionicons
              name={metodo === 'PIX' ? "radio-button-on" : "radio-button-off"}
              size={20}
              color={metodo === 'PIX' ? Colors.primary : Colors.textMuted}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.totalContainer}>
            <View style={styles.row}>
              <Text style={styles.totalLabel}>Subtotal</Text>
              <Text style={styles.totalValue}>{formatarPreco(tour.preco)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.totalLabel}>Taxas de Embarque</Text>
              <Text style={styles.totalValue}>{formatarPreco(metodo === 'PIX' ? 0 : 1500)}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.row}>
              <Text style={styles.finalLabel}>Total Geral</Text>
              <Text style={styles.finalValue}>
                {formatarPreco(metodo === 'PIX' ? tour.preco * 0.95 : tour.preco + 1500)}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <BotaoCustomizado
          title={pagando ? "Processando Autorização..." : "Confirmar e Decolar"}
          loading={pagando}
          onPress={handleConfirmarPagamento}
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
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  section: {
    marginTop: 25,
  },
  sectionTitle: {
    color: Colors.textMuted,
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  resumoCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tourName: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  tourDestino: {
    color: Colors.primary,
    fontSize: 14,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginVertical: 14,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    color: Colors.textMuted,
    fontSize: 14,
  },
  value: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '500',
  },
  metodoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  metodoSelecionado: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(76, 201, 240, 0.03)',
  },
  metodoTextContainer: {
    flex: 1,
    marginLeft: 15,
  },
  metodoTitle: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: 'bold',
  },
  metodoSubtitle: {
    color: Colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  totalContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  totalLabel: {
    color: Colors.textMuted,
    fontSize: 14,
  },
  totalValue: {
    color: Colors.text,
    fontSize: 14,
  },
  finalLabel: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  finalValue: {
    color: Colors.primary,
    fontSize: 20,
    fontWeight: 'bold',
  },
  footer: {
    padding: 20,
    backgroundColor: Colors.background,
  },
});
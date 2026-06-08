import { Colors } from '@/constants/Colors';
import api from '@/services/api';
import { TicketBackend } from '@/types/ticket';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StatusBar, StyleSheet, Text, View } from 'react-native';


export default function Reservas() {
  const [reservas, setReservas] = useState<TicketBackend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarDadosCompletos() {
      try {
        const [resTickets, resTourDates, resTours] = await Promise.all([
          api.get('/tickets').catch(() => ({ data: [] })),
          api.get('/tour-dates').catch(() => ({ data: [] })),
          api.get('/tours').catch(() => ({ data: [] }))
        ]);

        const ticketsRaw = resTickets.data;
        const tourDates = resTourDates.data;
        const tours = resTours.data;


        const rotasAgendadas = ticketsRaw.map((ticket: any) => {

          const dataRelacionada = tourDates.find((d: any) => d.id === ticket.tourDateId);

          const tourRelacionado = dataRelacionada
            ? tours.find((t: any) => t.id === (dataRelacionada.tourId ?? dataRelacionada.tour?.id))
            : null;

          let dataFormatada = "A definir";
          if (dataRelacionada?.departureDate) {
            const dataObjeto = new Date(dataRelacionada.departureDate);
            dataFormatada = dataObjeto.toLocaleDateString('pt-BR');
          }

          return {
            id: ticket.id,
            userId: ticket.userId,
            tourDateId: ticket.tourDateId,
            status: ticket.status ?? "CONFIRMED",
            bookingDate: ticket.bookingDate,
            price: Number(ticket.price ?? 0),
            tourName: tourRelacionado?.name ?? "Missão Orbital",
            destino: tourRelacionado?.destination ?? "Espaço Profundo",
            dataPartida: dataFormatada
          };
        });

        setReservas(rotasAgendadas);
      } catch (error) {
        console.log("[Reservas] Aguardando implementação da rota GET /tickets no Java.");
        setReservas([]);
      } finally {
        setLoading(false);
      }
    }

    carregarDadosCompletos();
  }, []);

  const formatarPreco = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor);
  };

  const obterEstiloStatus = (status: string) => {
    const s = status.toUpperCase();
    if (s === 'PENDING' || s === 'PENDENTE') {
      return { bg: 'rgba(255, 149, 0, 0.1)', texto: '#FF9500', label: 'PENDENTE' };
    }
    if (s === 'CANCELLED' || s === 'CANCELADO') {
      return { bg: 'rgba(255, 59, 48, 0.1)', texto: '#FF3B30', label: 'CANCELADO' };
    }
    return { bg: 'rgba(52, 199, 89, 0.1)', texto: '#34C759', label: 'CONFIRMADO' };
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      <View style={styles.header}>
        <Text style={styles.title}>Minhas Reservas</Text>
        <Text style={styles.subtitle}>Seus bilhetes para o espaço</Text>
      </View>

      <FlatList
        data={reservas}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="rocket-outline" size={48} color={Colors.textMuted} />
            <Text style={styles.emptyText}>Nenhuma viagem agendada ainda.</Text>
          </View>
        }
        renderItem={({ item }) => {
          const estiloStatus = obterEstiloStatus(item.status);

          return (
            <View style={styles.ticketCard}>
              <View style={styles.ticketHeader}>
                <View style={{ flex: 1, paddingRight: 10 }}>
                  <Text style={styles.tourName} numberOfLines={1}>{item.tourName}</Text>
                  <Text style={styles.destinoName}>{item.destino}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: estiloStatus.bg }]}>
                  <Text style={[styles.statusText, { color: estiloStatus.texto }]}>{estiloStatus.label}</Text>
                </View>
              </View>

              <View style={styles.ticketDivider} />

              <View style={styles.ticketBody}>
                <View style={styles.row}>
                  <View style={styles.infoBlock}>
                    <Text style={styles.infoLabel}>DATA DE PARTIDA</Text>
                    <Text style={styles.infoValue}>{item.dataPartida}</Text>
                  </View>
                  <View style={[styles.infoBlock, { alignItems: 'flex-end' }]}>
                    <Text style={styles.infoLabel}>ASSENTO</Text>
                    <Text style={styles.infoValue}>01A</Text>
                  </View>
                </View>

                <View style={[styles.row, { marginTop: 15 }]}>
                  <View style={styles.infoBlock}>
                    <Text style={styles.infoLabel}>VALOR PAGO</Text>
                    <Text style={styles.infoValue}>{formatarPreco(item.price)}</Text>
                  </View>
                  <View style={[styles.infoBlock, { alignItems: 'flex-end' }]}>
                    <Text style={styles.infoLabel}>CÓDIGO DE RESERVA</Text>
                    <Text style={[styles.infoValue, styles.codeValue]}>ORBIT-{item.id}X26</Text>
                  </View>
                </View>
              </View>
            </View>
          );
        }}
      />
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
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  title: {
    color: Colors.text,
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: 14,
    marginTop: 4,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyText: {
    color: Colors.textMuted,
    fontSize: 16,
    marginTop: 12,
  },
  ticketCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    marginBottom: 20,
  },
  ticketHeader: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  tourName: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  destinoName: {
    color: Colors.primary,
    fontSize: 13,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  ticketDivider: {
    height: 1,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    borderStyle: 'dashed',
    marginHorizontal: 10,
  },
  stubLine: {
    height: 1,
  },
  ticketBody: {
    padding: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoBlock: {
    flex: 1,
  },
  infoLabel: {
    color: Colors.textMuted,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  infoValue: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '500',
  },
  codeValue: {
    color: Colors.primary,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
});
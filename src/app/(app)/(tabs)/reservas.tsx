import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StatusBar, StyleSheet, Text, View } from 'react-native';

import CardReserva from '@/components/tours/CardReserva';
import ModalAlterarData from '@/components/tours/ModalAlterarData';
import { Colors } from '@/constants/Colors';
import api from '@/services/api';
import { TicketBackend } from '@/types/ticket';

export default function Reservas() {
  const [reservas, setReservas] = useState<TicketBackend[]>([]);
  const [loading, setLoading] = useState(true);
  const [todasDatas, setTodasDatas] = useState<any[]>([]);

  const [modalVisivel, setModalVisivel] = useState(false);
  const [ticketSendoAlterado, setTicketSendoAlterado] = useState<number | null>(null);
  const [datasFiltradasModal, setDatasFiltradasModal] = useState<any[]>([]);

  const carregarDadosCompletos = async () => {
    try {
      const [resTickets, resTourDates, resTours] = await Promise.all([
        api.get('/tickets').catch(() => ({ data: [] })),
        api.get('/tour-dates').catch(() => ({ data: [] })),
        api.get('/tours').catch(() => ({ data: [] }))
      ]);

      const ticketsRaw = resTickets.data;
      const tourDates = resTourDates.data;
      const tours = resTours.data;

      setTodasDatas(tourDates);

      const rotasAgendadas = ticketsRaw.map((ticket: any) => {
        const idDaDataNoTicket = ticket.tourDateId ?? ticket.tour_date_id;
        const idUserNoTicket = ticket.userId ?? ticket.user_id;

        const dataRelacionada = tourDates.find((d: any) => Number(d.id) === Number(idDaDataNoTicket));

        const idTourRelacionado = dataRelacionada?.tourId ?? dataRelacionada?.tour_id ?? dataRelacionada?.tour?.id;
        const tourRelacionado = idTourRelacionado ? tours.find((t: any) => t.id === idTourRelacionado) : null;

        let dataFormatada = "A definir";
        if (dataRelacionada?.departureDate || dataRelacionada?.departure_date) {
          const dataBruta = dataRelacionada.departureDate ?? dataRelacionada.departure_date;
          const dataObjeto = new Date(dataBruta);
          dataFormatada = !isNaN(dataObjeto.getTime()) ? dataObjeto.toLocaleDateString('pt-BR') : dataBruta;
        }

        return {
          id: ticket.id,
          userId: idUserNoTicket,
          tourDateId: idDaDataNoTicket,
          status: ticket.status ?? "PENDING",
          bookingDate: ticket.bookingDate ?? ticket.booking_date,
          price: Number(ticket.price ?? ticket.tour?.price ?? 0),
          tourName: tourRelacionado?.name ?? "Missão Orbital",
          destino: tourRelacionado?.destination ?? "Espaço Profundo",
          dataPartida: dataFormatada,
          tourId: idTourRelacionado
        };
      });

      setReservas(rotasAgendadas);
    } catch (error) {
      console.log("[Reservas] Erro crítico no mapeamento:", error);
      setReservas([]);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      carregarDadosCompletos();
    }, [])
  );

  const handleCancelarReserva = (ticketId: number) => {
    Alert.alert(
      'Cancelar Missão',
      'Tem certeza que deseja cancelar o seu bilhete de embarque interplanetário?',
      [
        { text: 'Manter Viagem', style: 'cancel' },
        {
          text: 'Confirmar Cancelamento',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await api.delete(`/tickets/${ticketId}`);
              Alert.alert('Sucesso', 'Sua reserva foi cancelada com sucesso.');
              carregarDadosCompletos();
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível cancelar sua reserva no servidor.');
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleAbrirModalDatas = (ticketId: number, tourId: number, atualTourDateId: number) => {
    const alternativas = todasDatas.filter((d: any) => {
      const idDoTour = d.tourId ?? d.tour_id ?? d.tour?.id;
      const totalSpots = d.totalSpots ?? d.total_spots ?? 10;
      const bookedSpots = d.bookedSpots ?? d.booked_spots ?? 0;
      const vagasLivres = d.availableSpots ?? (totalSpots - bookedSpots);

      return Number(idDoTour) === Number(tourId) && Number(d.id) !== Number(atualTourDateId) && vagasLivres > 0;
    });

    if (alternativas.length === 0) {
      Alert.alert('Indisponível', 'Não existem outras janelas de lançamento com assentos livres para este destino no momento.');
      return;
    }

    setTicketSendoAlterado(ticketId);
    setDatasFiltradasModal(alternativas);
    setModalVisivel(true);
  };

  const handleConfirmarAlteracaoData = async (novaTourDateId: number) => {
    if (!ticketSendoAlterado) return;
    setModalVisivel(false);
    setLoading(true);

    try {
      await api.put(`/tickets/${ticketSendoAlterado}`, {
        tourDateId: novaTourDateId
      });

      Alert.alert('Sucesso', 'A data da sua viagem foi alterada com sucesso!');
      carregarDadosCompletos();
    } catch (error) {
      Alert.alert('Erro', 'Falha ao atualizar a data no sistema do backend.');
      setLoading(false);
    } finally {
      setTicketSendoAlterado(null);
    }
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
        renderItem={({ item }) => (
          <CardReserva
            item={item}
            onAlterarData={() => handleAbrirModalDatas(item.id, item.tourId!, item.tourDateId)}
            onCancelarReserva={() => handleCancelarReserva(item.id)}
          />
        )}
      />

      <ModalAlterarData
        visivel={modalVisivel}
        onClose={() => setModalVisivel(false)}
        datas={datasFiltradasModal}
        onSelecionarData={handleConfirmarAlteracaoData}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20
  },
  title: {
    color: Colors.text,
    fontSize: 28,
    fontWeight: 'bold'
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: 14,
    marginTop: 4
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80
  },
  emptyText: {
    color: Colors.textMuted,
    fontSize: 16,
    marginTop: 12
  }
});
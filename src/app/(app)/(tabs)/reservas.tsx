import { Colors } from '@/constants/Colors';
import { Ingresso } from '@/types/tour';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { FlatList, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Reservas() {
  const [reservas] = useState<Ingresso[]>([
    {
      id: 1,
      id_usuario: 1,
      id_data_tour: 101,
      codigo_unico: "ORBIT-74X9-2026",
      status: "CONFIRMADO",
      data_compra: "27/05/2026",
      valor_pago: 250000,
      tourName: "Experiência Órbita Azul",
      destino: "Órbita Terrestre Baixa",
      dataPartida: "15/08/2026"
    }
  ]);

  const formatarPreco = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
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
            <Ionicons name="airplane-outline" size={48} color={Colors.textMuted} />
            <Text style={styles.emptyText}>Nenhuma viagem agendada ainda.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.ticketCard}>
            <View style={styles.ticketHeader}>
              <View>
                <Text style={styles.tourName}>{item.tourName}</Text>
                <Text style={styles.destinoName}>{item.destino}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: 'rgba(52, 199, 89, 0.1)' }]}>
                <Text style={[styles.statusText, { color: '#34C759' }]}>{item.status}</Text>
              </View>
            </View>

            <View style={styles.ticketDivider}>
              <View style={styles.stubLine} />
            </View>

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
                  <Text style={styles.infoValue}>{formatarPreco(item.valor_pago)}</Text>
                </View>
                <View style={[styles.infoBlock, { alignItems: 'flex-end' }]}>
                  <Text style={styles.infoLabel}>CÓDIGO DE EMBARQUE</Text>
                  <Text style={[styles.infoValue, styles.codeValue]}>{item.codigo_unico}</Text>
                </View>
              </View>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    paddingTop: 40,
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
    borderColor: '#233142',
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
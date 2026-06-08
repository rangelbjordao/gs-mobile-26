import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CardReservaProps {
  item: any;
  onAlterarData: () => void;
  onCancelarReserva: () => void;
}

export default function CardReserva({ item, onAlterarData, onCancelarReserva }: CardReservaProps) {
  const formatarPreco = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  };

  const obterEstiloStatus = (status: string) => {
    const s = status.toUpperCase();
    if (s === 'PENDING' || s === 'PENDENTE') return { bg: 'rgba(255, 149, 0, 0.1)', texto: '#FF9500', label: 'PENDENTE' };
    if (s === 'CANCELLED' || s === 'CANCELADO') return { bg: 'rgba(255, 59, 48, 0.1)', texto: '#FF3B30', label: 'CANCELADO' };
    return { bg: 'rgba(52, 199, 89, 0.1)', texto: '#34C759', label: 'CONFIRMADO' };
  };

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

      <View style={styles.crudActionsRow}>
        <TouchableOpacity style={[styles.actionButton, styles.updateButton]} onPress={onAlterarData}>
          <Ionicons name="calendar-outline" size={16} color={Colors.primary} />
          <Text style={styles.updateButtonText}>Alterar Data</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={onCancelarReserva}>
          <Ionicons name="trash-outline" size={16} color="#FF3B30" />
          <Text style={styles.deleteButtonText}>Cancelar Viagem</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  ticketCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    marginBottom: 20
  },
  ticketHeader: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  tourName: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: 'bold'
  },
  destinoName: {
    color: Colors.primary,
    fontSize: 13,
    marginTop: 2
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12
  },
  statusText: {
    fontSize: 11,
    fontWeight: 'bold'
  },
  ticketDivider: {
    height: 1,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    borderStyle: 'dashed',
    marginHorizontal: 10
  },
  ticketBody: {
    padding: 20,
    paddingBottom: 15
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  infoBlock: {
    flex: 1
  },
  infoLabel: {
    color: Colors.textMuted,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 4
  },
  infoValue: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '500'
  },
  codeValue: {
    color: Colors.primary,
    fontWeight: 'bold',
    fontFamily: 'monospace'
  },
  crudActionsRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    backgroundColor: 'rgba(0,0,0,0.1)'
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', paddingVertical: 12
  },
  updateButton: {
    borderRightWidth: 1,
    borderRightColor: 'rgba(255, 255, 255, 0.05)'
  },
  updateButtonText: {
    color: Colors.primary,
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 6
  },
  deleteButtonText: {
    color: '#FF3B30',
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 6
  }
});
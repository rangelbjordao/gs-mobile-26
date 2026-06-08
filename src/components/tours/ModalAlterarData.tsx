import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ModalAlterarDataProps {
  visivel: boolean;
  onClose: () => void;
  datas: any[];
  onSelecionarData: (id: number) => void;
}

export default function ModalAlterarData({ visivel, onClose, datas, onSelecionarData }: ModalAlterarDataProps) {
  const formatarDataTexto = (dataString: string) => {
    if (dataString && dataString.includes('T')) {
      const objData = new Date(dataString);
      return !isNaN(objData.getTime()) ? objData.toLocaleDateString('pt-BR') : dataString;
    }
    return dataString;
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visivel}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Remarcar Voo Espacial</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close-circle" size={24} color={Colors.textMuted} />
            </TouchableOpacity>
          </View>

          <Text style={styles.modalSubtitle}>
            Selecione uma das novas janelas de lançamento com assentos livres no PostgreSQL:
          </Text>

          <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
            {datas.map((d) => (
              <TouchableOpacity
                key={d.id}
                style={styles.modalDateCard}
                onPress={() => onSelecionarData(d.id)}
              >
                <View style={styles.modalDateInfo}>
                  <Ionicons name="rocket-outline" size={20} color={Colors.primary} />
                  <Text style={styles.modalDateText}>{formatarDataTexto(d.departureDate)}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={Colors.primary} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '60%',
    borderWidth: 1,
    borderColor: Colors.border
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15
  },
  modalTitle: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: 'bold'
  },
  modalSubtitle: {
    color: Colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20
  },
  modalScroll: {
    marginBottom: 10
  },
  modalDateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.02)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border
  },
  modalDateInfo: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  modalDateText: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: '500',
    marginLeft: 12
  }
});
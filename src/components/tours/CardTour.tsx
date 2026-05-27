import { Colors } from '@/constants/Colors';
import { Tour } from '@/types/tour';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';


interface CardTourProps {
  tour: Tour;
  onPress: () => void;
}

export default function CardTour({ tour, onPress }: CardTourProps) {
  // Função simples para formatar o preço em Reais
  const formatarPreco = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor);
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      {/* Imagem do Destino Espacial */}
      {tour.imagem && (
        <Image source={{ uri: tour.imagem }} style={styles.image} />
      )}

      <View style={styles.content}>
        {/* Destino */}
        <View style={styles.badge}>
          <Ionicons name="planet-outline" size={14} color={Colors.primary} />
          <Text style={styles.badgeText}>{tour.destino.toUpperCase()}</Text>
        </View>

        {/* Nome do Tour */}
        <Text style={styles.title}>{tour.nome}</Text>

        {/* Descrição Curta */}
        <Text style={styles.description} numberOfLines={2}>
          {tour.descricao}
        </Text>

        <View style={styles.footer}>
          {/* Duração */}
          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={16} color={Colors.textMuted} />
            <Text style={styles.infoText}>{tour.duracao_dias} dias</Text>
          </View>

          {/* Preço */}
          <Text style={styles.price}>{formatarPreco(tour.preco)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#233142',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  image: {
    width: '100%',
    height: 180,
    backgroundColor: '#151c24',
  },
  content: {
    padding: 16,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(76, 201, 240, 0.1)',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 10,
  },
  badgeText: {
    color: Colors.primary,
    fontSize: 11,
    fontWeight: 'bold',
    marginLeft: 4,
    letterSpacing: 0.5,
  },
  title: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  description: {
    color: Colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
    paddingTop: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    color: Colors.textMuted,
    fontSize: 14,
    marginLeft: 6,
  },
  price: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
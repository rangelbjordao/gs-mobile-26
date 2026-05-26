import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

interface BotaoProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
}

export default function BotaoCustomizado({ title, loading, style, ...rest }: BotaoProps) {
  return (
    <TouchableOpacity style={[styles.button, loading ? styles.buttonDisabled : null, style]} disabled={loading} {...rest}>
      {loading ? (
        <ActivityIndicator color="#fff" size="small" />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: { width: '100%', height: 52, backgroundColor: '#007AFF', justifyContent: 'center', alignItems: 'center', borderRadius: 8, marginTop: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  buttonDisabled: { backgroundColor: '#A2C2E8', opacity: 0.8 },
  text: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});
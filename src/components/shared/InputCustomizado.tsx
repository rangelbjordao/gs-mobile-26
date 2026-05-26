import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export default function InputCustomizado({ label, error, ...rest }: InputProps) {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput style={[styles.input, error ? styles.inputError : null]} placeholderTextColor="#999" {...rest} />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%', marginBottom: 15 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 6, color: '#333' },
  input: { width: '100%', height: 52, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 16, backgroundColor: '#fff', fontSize: 16, color: '#333' },
  inputError: { borderColor: '#FF3B30' },
  errorText: { fontSize: 12, color: '#FF3B30', marginTop: 4, fontWeight: '500' }
});
import { Slot } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '@/constants/Colors';
import { AuthProvider } from '@/context/AuthContext';
import { wakeUpApi } from '@/services/wakeUpApi';

function RootNavigator() {
  const [apiReady, setApiReady] = useState(false);
  const [apiChecked, setApiChecked] = useState(false);

  const verificarApi = useCallback(async () => {
    setApiChecked(false);
    const ok = await wakeUpApi();
    setApiReady(ok);
    setApiChecked(true);
  }, []);

  useEffect(() => {
    verificarApi();
  }, [verificarApi]);

  if (!apiChecked) {
    return (
      <View style={styles.centerContainer}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.background || Colors.surface} />
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Iniciando motores orbitais...</Text>
        <Text style={styles.subLoadingText}>Despertando servidores em nuvem</Text>
      </View>
    );
  }

  if (!apiReady) {
    return (
      <View style={styles.errorContainer}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.background || Colors.surface} />
        <Text style={styles.errorTitle}>Falha na conexão com a base!</Text>
        <Text style={styles.errorSubtitle}>
          Não conseguimos estabelecer contato com o centro de controle da API. Verifique a infraestrutura e tente novamente.
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={verificarApi}>
          <Text style={styles.retryButtonText}>Reconectar Sistema</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return <Slot />;
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <AuthProvider>
          <RootNavigator />
        </AuthProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background || Colors.surface,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background || Colors.surface,
    padding: 20
  },
  loadingText: {
    color: Colors.text || '#fff',
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5
  },
  subLoadingText: {
    color: Colors.textMuted || '#aaa',
    marginTop: 6,
    fontSize: 13
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background || Colors.surface,
    padding: 24
  },
  errorTitle: {
    color: Colors.text || '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center'
  },
  errorSubtitle: {
    color: Colors.textMuted || '#aaa',
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 10
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)'
  },
  retryButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 15
  }
});
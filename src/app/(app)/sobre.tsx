import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SobreApp() {
  const router = useRouter();

  const appVersion = Constants.expoConfig?.version;
  const commitHash = Constants.expoConfig?.extra?.commitHash;

  const infoProjeto = {
    nome: "OrbitPass",
    descricao: "Plataforma inovadora de turismo espacial.",
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      <View style={styles.navHeader}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Sobre o Aplicativo</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.sectionCard}>
          <Text style={styles.appName}>{infoProjeto.nome}</Text>
          <Text style={styles.appVersion}>
            Versão {appVersion}{'\n'}Commit:({commitHash})
          </Text>

          <Text style={styles.appDescription}>{infoProjeto.descricao}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
  sectionCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginTop: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  appName: {
    color: Colors.primary,
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  appVersion: {
    color: Colors.textMuted,
    fontSize: 12,
    fontFamily: 'monospace',
    marginTop: 5,
    marginBottom: 15,
    textAlign: 'center',
  },
  appDescription: {
    color: Colors.text,
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
  },
});
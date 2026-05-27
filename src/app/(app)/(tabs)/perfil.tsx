import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../../constants/Colors';
import { useAuth } from '../../../context/AuthContext';

export default function Perfil() {
  const { logout } = useAuth();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      <View style={styles.header}>
        <Text style={styles.title}>Meu Perfil</Text>
      </View>

      <View style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person-circle-outline" size={80} color={Colors.primary} />
        </View>
        <Text style={styles.userName}>Recruta Espacial</Text>
        <Text style={styles.userEmail}>recruta@orbitpass.com</Text>
      </View>

      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.logoutButton} onPress={logout} activeOpacity={0.85}>
          <Ionicons name="log-out-outline" size={20} color={Colors.danger} />
          <Text style={styles.logoutText}>Sair da Conta</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 10,
    paddingBottom: 20,
  },
  title: {
    color: Colors.text,
    fontSize: 28,
    fontWeight: 'bold',
  },
  profileCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#233142',
  },
  avatarContainer: {
    marginBottom: 12,
  },
  userName: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    color: Colors.textMuted,
    fontSize: 14,
  },
  menuContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    borderRadius: 12,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 48, 0.2)',
  },
  logoutText: {
    color: Colors.danger,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
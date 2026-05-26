import { useAuth } from '@/context/AuthContext';
import { Stack } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';


export default function AppLayout() {
  const { token, isLoading } = useAuth();

  // Enquanto verifica o token, mostra um loader
  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  // Se tem token, libera as telas internas
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
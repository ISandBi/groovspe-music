import React from 'react';
import { View } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from '../src/store';
import Toast from '../src/components/Toast';
import { colors } from '../src/theme';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <View style={{ flex: 1, backgroundColor: colors.bg }}>
          <StatusBar style="light" />
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg }, animation: 'fade' }}>
            <Stack.Screen name="player" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
            <Stack.Screen name="band/[id]" options={{ animation: 'slide_from_right' }} />
          </Stack>
          <Toast />
        </View>
      </AppProvider>
    </SafeAreaProvider>
  );
}

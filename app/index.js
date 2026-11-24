import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Redirect } from 'expo-router';
import { useApp } from '../src/store';
import { useTheme } from '../src/theme';

export default function Index() {
  const { colors } = useTheme();
  const { ready, user } = useApp();
  if (!ready) return <View style={{ flex: 1, backgroundColor: colors.bg, justifyContent: 'center' }}><ActivityIndicator color={colors.lime} /></View>;
  if (!user) return <Redirect href="/welcome" />;
  return <Redirect href={user.role === 'band' ? '/(band)/panel' : '/(tabs)/home'} />;
}

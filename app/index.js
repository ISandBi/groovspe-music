import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Redirect } from 'expo-router';
import { useApp } from '../src/store';
import { colors } from '../src/theme';

export default function Index() {
  const { ready, user } = useApp();
  if (!ready) return <View style={{ flex: 1, backgroundColor: colors.bg, justifyContent: 'center' }}><ActivityIndicator color={colors.lime} /></View>;
  return <Redirect href={user ? '/(tabs)/home' : '/welcome'} />;
}

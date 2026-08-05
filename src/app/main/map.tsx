import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/theme';
import AppContainer from '@/components/shared/layout/app_container';

export default function MapsScreen() {
  return (
    <AppContainer includeBgImage>
      <SafeAreaView>
        <Text style={styles.title}>Maps</Text>
      </SafeAreaView>
    </AppContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Poppins_600SemiBold',
    color: COLORS.textPrimary,
  },
});

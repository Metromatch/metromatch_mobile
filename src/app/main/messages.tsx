import { COLORS } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MessagesScreen() {
  return (
    <LinearGradient
      colors={[
        COLORS.backgroundStart,
        COLORS.backgroundMiddle,
        COLORS.backgroundEnd,
      ]}
      style={[StyleSheet.absoluteFill, styles.container]}
    >
      <View style={styles.heroOverlay} />
      <Text style={styles.title}>Messages</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(58, 76, 139, 0.5)',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Poppins_600SemiBold',
    color: 'white',
  },
});

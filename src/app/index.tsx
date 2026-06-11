import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import AuthScreen from '@/components/AuthScreen';
import { useFonts } from 'expo-font';
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
} from '@expo-google-fonts/poppins';
import {
  ImperialScript_400Regular,
} from '@expo-google-fonts/imperial-script';

import {
  PlayfairDisplay_700Bold,
} from '@expo-google-fonts/playfair-display';


export default function HomeScreen() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
    PlayfairDisplay_700Bold,
    ImperialScript_400Regular
  });
  if (!fontsLoaded) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <ActivityIndicator />
      </View>
    );
  }
  return (
    <View style={{ flex: 1 }}>
      <AuthScreen />
    </View>
  );
}


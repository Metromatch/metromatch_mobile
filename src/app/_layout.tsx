import { useEffect } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider, Stack, useSegments, useRouter, Slot } from 'expo-router';
import { useColorScheme, ActivityIndicator, View, StatusBar, StyleSheet, ImageBackground } from 'react-native';
import { useFonts } from 'expo-font';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
} from '@expo-google-fonts/poppins';
import { ImperialScript_400Regular } from '@expo-google-fonts/imperial-script';
import { PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '@/constants/theme';
import SplashScreen from '@/components/general/molecules/splash_screen';
import Toast from 'react-native-toast-message';
import { useAuthStore } from '@/store/authStore';
import dayjs from 'dayjs';
import { clearStore } from '@/utils/authUtils';

const queryClient = new QueryClient();

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const { authConfiguration: { accessToken, accessTokenExpiresAt } } = useAuthStore();
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
    PlayfairDisplay_700Bold,
    ImperialScript_400Regular
  });

  const isTokenValid = accessToken && accessTokenExpiresAt && dayjs(accessTokenExpiresAt).isAfter(dayjs());
  useEffect(() => {
    if (!fontsLoaded) return;
    if (!accessToken || !isTokenValid) {
      clearStore();
      router.replace('/login');
    } else {
      router.replace('/');
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return <SplashScreen />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <LinearGradient
          colors={[
            COLORS.backgroundStart,
            COLORS.backgroundMiddle,
            COLORS.backgroundEnd,
          ]}
          style={[StyleSheet.absoluteFill, styles.container]}
        >
          <ImageBackground
            source={require('@/assets/images/couple_bg.png')}
            resizeMode="cover"
            style={styles.background}>
            <View style={styles.heroOverlay} />
          </ImageBackground>
          <Slot />
          {/* <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: 'transparent' } }} /> */}
        </LinearGradient>
        <Toast />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: { position: 'relative', flex: 1 },
  background: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(58, 76, 139, 0.5)',
  },
});

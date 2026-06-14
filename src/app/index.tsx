import { View } from 'react-native';
import AuthScreen from '@/components/AuthScreen';
import { useAuthStore } from '@/store/authStore';
import { Redirect } from 'expo-router';

export default function HomeScreen() {
  const { authConfiguration: { isLoggedIn } } = useAuthStore();

  return (
    <View style={{ flex: 1 }}>
      <Redirect href={isLoggedIn ? "/onboarding/onboarding_basic_info" : "/login"} />
    </View>
  );
}

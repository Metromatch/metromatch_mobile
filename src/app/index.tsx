import { View } from 'react-native';
import AuthScreen from '@/components/AuthScreen';
import { Redirect } from 'expo-router';

export default function HomeScreen() {

  return (
    <View style={{ flex: 1 }}>
      <AuthScreen />
    </View>
    // <Redirect href="/(auth)/(main)/login" />
  );
}

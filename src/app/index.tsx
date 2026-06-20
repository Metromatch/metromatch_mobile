import { StatusBar, View } from 'react-native';
import { useAuthStore } from '@/store/authStore';
import { Redirect } from 'expo-router';
import useProfileService from '@/hooks/services/useProfileService';
import dayjs from 'dayjs';
import SplashScreen from '@/components/general/molecules/splash_screen';

export default function HomeScreen() {
  const { authConfiguration: { accessToken, accessTokenExpiresAt } } = useAuthStore();
  const isTokenValid = accessToken && accessTokenExpiresAt && dayjs(accessTokenExpiresAt).isAfter(dayjs());
  const { myProfile, isMyProfileLoading } = useProfileService({ fetchMyProfile: isTokenValid });

  return (
    <View style={{ flex: 1 }}>
      {((isTokenValid && !myProfile) || isMyProfileLoading) ? <SplashScreen message="Fetching your details..." /> : <Redirect href={myProfile?.profile ? "/main/sessions" : "/onboarding/basic_info"} />}
    </View>
  );
}

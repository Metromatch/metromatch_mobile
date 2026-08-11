import { Slot, Stack, Tabs, usePathname } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import CustomTabBar from '@/components/navigation/CustomTabBar';
import MainHeader from '@/components/shared/molecules/main_header';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function MainLayout() {
  const pathname = usePathname();
  return (
    <View style={{ flex: 1, backgroundColor: 'transparent' }}>
      {/* <SafeAreaView style={{ flex: 1 }}> */}
      <MainHeader />

      <View style={{ flex: 1 }}>
        {/* <Stack /> */}
        <Slot />

      </View>
      {/* </SafeAreaView> */}
      <CustomTabBar
        routes={[
          {
            key: 'discover',
            name: 'discover',
            params: {},
            index: 1
          },
          {
            key: 'messages',
            name: 'messages',
            params: {},
            index: 2,
          },
          {
            key: 'matches',
            name: 'matches',
            params: {},
            index: 3,
          },
          {
            key: 'map',
            name: 'map',
            params: {},
            index: 4,
          },
          {
            key: 'profile',
            name: 'profile',
            params: {},
            index: 5,
          },
        ]}
        activeRoute={pathname?.split('/')[2] || ''}
      />
    </View>
  );
}

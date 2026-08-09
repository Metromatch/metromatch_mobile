import { Tabs } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import CustomTabBar from '@/components/navigation/CustomTabBar';


export default function MainLayout() {
  return (
    // <OverlayProvider>
    <View style={{ flex: 1, backgroundColor: 'transparent' }}>
      {/* <Chat client={chatClient}> */}
      <Tabs
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
          headerTransparent: true,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{ href: null }}
          key='index'
        />

        <Tabs.Screen
          name="discover"
          options={{ title: 'Discover' }}
          key='discover'
        />

        <Tabs.Screen
          name="messages"
          options={{ title: 'Messages' }}
          key='messages'
        />

        <Tabs.Screen
          name="matches"
          options={{ title: 'Matches' }}
          key='matches'
        />

        <Tabs.Screen
          name="map"
          options={{ title: 'Map' }}
          key='map'
        />

        <Tabs.Screen
          name="profile"
          options={{ title: 'Profile' }}
          key='profile'
        />

        <Tabs.Screen
          name="maps"
          options={{ href: null }}
          key='maps'
        />

        {/* Chat room — hidden from tab bar, navigated to from messages */}
        <Tabs.Screen
          name="chat/[profileId]"
          options={{ href: null }}
          key='chat/[profileId]'
        />

        {/* Profile detail — hidden, navigated to from discover cards */}
        <Tabs.Screen
          name="discover/[profileId]"
          options={{ href: null }}
          key='discover/[profileId]'
        />

        {/* Subscription — hidden, navigated to from profile screen */}
        <Tabs.Screen
          name="subscription"
          options={{ href: null }}
          key='subscription'
        />
      </Tabs>
      {/* </Chat> */}
    </View>
    // </OverlayProvider>
  );
}

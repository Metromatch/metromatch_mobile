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
        tabBar={(props) => {
          console.log('props', props)
          return <CustomTabBar {...props} />
        }}
        screenOptions={{
          headerShown: false,
          headerTransparent: true,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{ href: null }}
        />

        <Tabs.Screen
          name="discover"
          options={{ title: 'Discover' }}
        />

        <Tabs.Screen
          name="messages"
          options={{ title: 'Messages' }}
        />

        <Tabs.Screen
          name="matches"
          options={{ title: 'Matches' }}
        />

        <Tabs.Screen
          name="sessions"
          options={{ title: 'Likes' }}
        />

        <Tabs.Screen
          name="profile"
          options={{ title: 'Profile' }}
        />

        <Tabs.Screen
          name="maps"
          options={{ href: null }}
        />

        {/* Chat room — hidden from tab bar, navigated to from messages */}
        <Tabs.Screen
          name="chat/[profileId]"
          options={{ href: null }}
        />

        {/* Profile detail — hidden, navigated to from discover cards */}
        <Tabs.Screen
          name="discover/[profileId]"
          options={{ href: null }}
        />

        {/* Subscription — hidden, navigated to from profile screen */}
        <Tabs.Screen
          name="subscription"
          options={{ href: null }}
        />
      </Tabs>
      {/* </Chat> */}
    </View>
    // </OverlayProvider>
  );
}

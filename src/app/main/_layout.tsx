import { Tabs } from 'expo-router';
import React from 'react';
import { COLORS } from '@/constants/theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Platform, View, Text, StyleSheet, ColorValue } from 'react-native';

function TabIcon({
  name,
  focused,
  color,
  badge,
}: {
  name: keyof typeof Ionicons.glyphMap;
  focused: boolean;
  color: ColorValue;
  badge?: number;
}) {
  return (
    <View>
      <Ionicons name={name} size={24} color={color} />
      {badge != null && badge > 0 && (
        <View style={badgeStyles.badge}>
          <Text style={badgeStyles.badgeText}>{badge > 99 ? '99+' : badge}</Text>
        </View>
      )}
    </View>
  );
}

const badgeStyles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FF4458',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: 'white',
    fontSize: 9,
    fontFamily: 'Poppins_700Bold',
    lineHeight: 14,
  },
});

export default function MainLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: 'transparent' }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: 'rgba(255,255,255,0.55)',
          headerTransparent: true,

          tabBarStyle: {
            // position: 'absolute',
            backgroundColor: 'transparent',
            borderTopWidth: 1,
            borderTopColor: 'rgba(255,255,255,0.12)',
            height: Platform.OS === 'ios' ? 85 : 65,
            paddingBottom: Platform.OS === 'ios' ? 25 : 10,
            paddingTop: 10,
          },
          tabBarLabelStyle: {
            fontFamily: 'Poppins_500Medium',
            fontSize: 10,
            marginTop: 2,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{ href: null }}
        />

        {/* Discover — main swipe screen */}
        <Tabs.Screen
          name="discover"
          options={{
            title: 'Discover',
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                name={focused ? 'heart' : 'heart-outline'}
                focused={focused}
                color={color}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="messages"
          options={{
            title: 'Messages',
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                name={focused ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline'}
                focused={focused}
                color={color}
              />
            ),
          }}
        />

        {/* Sessions / Likes */}
        <Tabs.Screen
          name="sessions"
          options={{
            title: 'Likes',
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                name={focused ? 'heart-circle' : 'heart-circle-outline'}
                focused={focused}
                color={color}
                badge={12}
              />
            ),
          }}
        />

        {/* Profile */}
        <Tabs.Screen
          name="about"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                name={focused ? 'person' : 'person-outline'}
                focused={focused}
                color={color}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="maps"
          options={{ href: null }}
        />
      </Tabs>
    </View>
  );
}

import React from 'react';
import { View, StyleSheet, Image, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity } from 'react-native';
import { Slot } from 'expo-router';
import { responsiveSize } from '@/utils/responsive';
import { COLORS } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import GlassmorphicCard from '@/components/general/molecules/glass_morphic_card';
import OnboardingFooter from '@/components/shared/molecules/onboarding/footer';
import Stepper from '@/components/shared/molecules/stepper';

export default function OnboardingLayout() {
  return (
    <LinearGradient
      colors={[
        COLORS.backgroundStart,
        COLORS.backgroundMiddle,
        COLORS.backgroundEnd,
      ]}
      style={[StyleSheet.absoluteFill, styles.background]}
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.logoContainer}>
              <Image
                source={require('@/../assets/images/logo_with_title.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            <GlassmorphicCard>
              <Stepper currentStep={1} totalSteps={4} stepLabel="About You" />
              <Slot />
            </GlassmorphicCard>

            <OnboardingFooter />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: responsiveSize(20),
    paddingBottom: responsiveSize(40),
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: responsiveSize(40),
    marginBottom: responsiveSize(30),
  },
  logo: {
    width: responsiveSize(220),
    height: responsiveSize(100),
  },
});

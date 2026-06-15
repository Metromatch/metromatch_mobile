import React from 'react';
import { View, StyleSheet, Image, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity } from 'react-native';
import { Slot, usePathname } from 'expo-router';
import { responsiveSize } from '@/utils/responsive';
import GlassmorphicCard from '@/components/general/molecules/glass_morphic_card';
import OnboardingFooter from '@/components/shared/molecules/onboarding/footer';
import Stepper from '@/components/shared/molecules/stepper';

export default function OnboardingLayout() {
  const pathname = usePathname();
  let currentStep = 1;
  let stepLabel = "About You";

  if (pathname.includes('details')) {
    currentStep = 2;
    stepLabel = "More About You"; // The image for step 2 doesn't have a label under the stepper, or maybe it's just "About You" again. Let's use empty string or "About You". I'll use empty string to match the image where there is no label under the stepper.
  } else if (pathname.includes('preferences')) {
    currentStep = 3;
    stepLabel = "Partner Preferences";
  } else if (pathname.includes('photos')) {
    currentStep = 4;
    stepLabel = "Photos";
  }

  return (
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
            <Stepper currentStep={currentStep} totalSteps={4} stepLabel={stepLabel} />
            <Slot />
          </GlassmorphicCard>

          <OnboardingFooter />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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

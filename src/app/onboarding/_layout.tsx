import React from 'react';
import { View, StyleSheet, Image, SafeAreaView, Platform, Text, TouchableOpacity, Keyboard, ScrollView } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Slot, usePathname } from 'expo-router';
import { responsiveSize } from '@/utils/responsive';
import GlassmorphicCard from '@/components/general/molecules/glass_morphic_card';
import OnboardingFooter from '@/components/shared/molecules/onboarding/footer';
import Stepper from '@/components/shared/molecules/stepper';
import useMasterListQuery from '@/hooks/services/useMasterListQuery';

export default function OnboardingLayout() {
  const pathname = usePathname();
  let currentStep = 1;
  let stepLabel = "About You";

  if (pathname.includes('details')) {
    currentStep = 2;
    stepLabel = "More About You";
  } else if (pathname.includes('metro_details')) {
    currentStep = 3;
    stepLabel = "Metro Details";
  } else if (pathname.includes('preferences')) {
    currentStep = 4;
    stepLabel = "Partner Preferences";
  } else if (pathname.includes('photos')) {
    currentStep = 5;
    stepLabel = "Photos";
  }

  useMasterListQuery();
  return (
    <View style={styles.keyboardView}>
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
      // extraScrollHeight={responsiveSize(150)}
      >
        <View style={styles.logoContainer}>
          <Image
            source={require('@/../assets/images/logo_with_title.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <GlassmorphicCard>
          <Stepper currentStep={currentStep} totalSteps={5} stepLabel={stepLabel} />
          <Slot />
        </GlassmorphicCard>

        <OnboardingFooter />
      </KeyboardAwareScrollView>
    </View>
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

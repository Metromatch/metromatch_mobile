import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { responsiveSize } from '@/utils/responsive';
import { COLORS, TYPOGRAPHY } from '@/constants/theme';
import { B1, B2 } from '@/components/general/atoms/body_text';

interface StepperProps {
  currentStep: number;
  totalSteps: number;
  stepLabel: string;
}

const Stepper: React.FC<StepperProps> = ({ currentStep, totalSteps, stepLabel }) => {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <View style={styles.container}>
      <View style={styles.stepperRow}>
        {steps.map((step, index) => {
          const isActive = step <= currentStep;
          const isCurrent = step === currentStep;

          return (
            <React.Fragment key={`step-${step}`}>
              <View
                style={[
                  styles.circle,
                  isActive ? styles.activeCircle : styles.inactiveCircle,
                  isCurrent && styles.currentCircle
                ]}
              />
              {index < totalSteps - 1 && (
                <View
                  style={[
                    styles.line,
                    isActive && step < currentStep ? styles.activeLine : styles.inactiveLine
                  ]}
                />
              )}
            </React.Fragment>
          );
        })}
      </View>
      <View style={styles.textContainer}>
        <B2 type="semibold" text={`Step ${currentStep} of ${totalSteps}`} textColor={COLORS.primary} />
        <B2 type="medium" text={stepLabel} textColor={COLORS.textSecondary} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: responsiveSize(20),
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: responsiveSize(10),
  },
  circle: {
    width: responsiveSize(16),
    height: responsiveSize(16),
    borderRadius: responsiveSize(8),
  },
  currentCircle: {
    width: responsiveSize(18),
    height: responsiveSize(18),
    borderRadius: responsiveSize(9),
    backgroundColor: COLORS.primary,
  },
  activeCircle: {
    backgroundColor: COLORS.primary,
  },
  inactiveCircle: {
    backgroundColor: '#D1E1FF', // Light blue
  },
  line: {
    height: responsiveSize(2),
    width: responsiveSize(40),
  },
  activeLine: {
    backgroundColor: COLORS.primary,
  },
  inactiveLine: {
    backgroundColor: '#D1E1FF', // Light blue
  },
  textContainer: {
    alignItems: 'center',
    gap: responsiveSize(2),
  },

});

export default Stepper;

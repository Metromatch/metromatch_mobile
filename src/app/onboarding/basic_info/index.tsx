import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import dayjs from 'dayjs';

import { responsiveSize } from '@/utils/responsive';
import { COLORS, TYPOGRAPHY } from '@/constants/theme';
import FormInput from '@/components/general/atoms/form_input';
import GenderSelector, { GenderType } from '@/components/shared/molecules/gender_selector';
import PrimaryButton from '@/components/general/atoms/primary_button';
import DoubleHeartIcon from '@/components/shared/atoms/double_heart';
import useMetromatchStore from '@/store';
import FormDatePicker from '@/components/general/molecules/form_date_picker';
import { useFormValidation } from '@/hooks/useFormValidation';

const OnboardingBasicInfo = () => {
    const router = useRouter();
    const { setOnboardingFormValues, onboardingSteps: { formValues } } = useMetromatchStore();

    const { values, errors, handleChange, validateAll } = useFormValidation({
        name: formValues.name ?? '',
        dob: formValues.dob || new Date(new Date().getFullYear() - 30),
        gender: formValues.gender,
    }, {
        name: { required: true, message: 'Please enter your full name' },
        dob: {
            required: true,
            message: 'Please select your date of birth',
            validate: (value: Date) => {
                if (!value) return null;
                const age = dayjs().diff(dayjs(value), 'year');
                if (age < 18) {
                    return 'You must be at least 18 years old';
                }
                if (age > 60) {
                    return 'You must be 60 years old or below';
                }
                return null;
            }
        },
        gender: { required: true, message: 'Please select a gender' }
    });

    const handleContinue = () => {
        if (validateAll()) {
            setOnboardingFormValues({
                name: values.name,
                dob: values.dob,
                gender: values.gender,
            });
            router.push('/onboarding/details');
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.titleRow}>
                <Text style={styles.titleText}>Tell us about yourself</Text>
                <DoubleHeartIcon />
            </View>

            <View style={styles.formContainer}>
                <FormInput
                    label="Full Name"
                    placeholder="Enter your full name"
                    value={values.name}
                    onChangeText={(text) => handleChange('name', text)}
                    error={errors.name}
                    addonLeft={<Ionicons name="person-outline" size={responsiveSize(20)} color={COLORS.textSecondary} />}
                    required
                    maxLength={50}
                />

                <FormDatePicker
                    value={values.dob}
                    onChange={(date) => handleChange('dob', date)}
                    placeholder="DD/MM/YYYY"
                    required
                    mode='date'
                    label="Date of Birth"
                    error={errors.dob}
                />

                <GenderSelector
                    label="Gender"
                    value={values.gender}
                    onChange={(val) => handleChange('gender', val)}
                    required
                    error={errors.gender}
                />

                <PrimaryButton
                    containerStyle={{ marginTop: responsiveSize(10) }}
                    title="Continue"
                    onPress={handleContinue}
                    addonRight={<Ionicons name="arrow-forward-outline" size={responsiveSize(20)} color="white" />}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        alignItems: 'center',
        marginBottom: responsiveSize(10),
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: responsiveSize(-10),
        justifyContent: 'center',
    },
    titleText: {
        fontFamily: TYPOGRAPHY.bold,
        fontSize: responsiveSize(22),
        color: COLORS.textPrimary,
        marginRight: responsiveSize(8),
    },

    formContainer: {
        marginTop: responsiveSize(10),
        gap: responsiveSize(20),
    },

    footerContainer: {
        marginTop: responsiveSize(30),
        alignItems: 'center',
    },
    footerText: {
        fontFamily: TYPOGRAPHY.regular,
        fontSize: responsiveSize(12),
        color: 'rgba(255, 255, 255, 0.8)', // White on dark gradient background (this goes outside the card, actually wait...)
    },
    footerLinksRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: responsiveSize(2),
    },
    footerLink: {
        fontFamily: TYPOGRAPHY.medium,
        fontSize: responsiveSize(12),
        color: COLORS.primaryLight,
    },
});

export default OnboardingBasicInfo;
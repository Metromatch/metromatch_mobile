import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { responsiveSize } from '@/utils/responsive';
import FormSelect from '@/components/shared/molecules/form_select';
import ChipSelector, { ChipOption } from '@/components/shared/molecules/chip_selector';
import PrimaryButton from '@/components/general/atoms/primary_button';
import IconButton from '@/components/general/atoms/icon_button';
import { useFormValidation } from '@/hooks/useFormValidation';
import useMasterListQuery from '@/hooks/services/useMasterListQuery';

const OnboardingPreferences = () => {
    const router = useRouter();
    const { masterlist } = useMasterListQuery();

    const { values, errors, handleChange, validateAll } = useFormValidation({
        height: '',
        religion: '',
        diet: null,
        drinking: null,
        smoking: null,
    }, {
        height: { required: true, message: 'Please select preferred height' },
        religion: { required: true, message: 'Please select preferred religion' },
        diet: { required: true, message: 'Please select diet preference' },
        drinking: { required: true, message: 'Please select drinking preference' },
        smoking: { required: true, message: 'Please select smoking preference' },
    });

    const handleNext = () => {
        if (!validateAll()) return;

        console.log('Next step with:', values);
        router.push('/onboarding/photos');
    };

    const handleBack = () => {
        router.back();
    };

    return (
        <View style={styles.formContainer}>
            <View style={styles.row}>
                <FormSelect
                    flex1
                    label="Height"
                    placeholder="Preferred height"
                    value={values.height}
                    error={errors.height}
                    required
                    options={masterlist?.height || []}
                    onChange={(value) => handleChange('height', value)}
                    icon="person-outline"
                />
                <FormSelect
                    flex1
                    label="Religion"
                    placeholder="Preferred religion"
                    value={values.religion}
                    error={errors.religion}
                    required
                    options={masterlist?.religion || []}
                    onChange={(value) => handleChange('religion', value)}
                    icon="leaf-outline"
                />
            </View>

            <ChipSelector
                label="Diet Preferences"
                options={masterlist?.diet || []}
                value={values.diet}
                error={errors.diet}
                required
                onChange={(value) => handleChange('diet', value)}
            />

            <View style={styles.row}>
                <ChipSelector
                    label="Drinking"
                    options={masterlist?.drinkingHabits || []}
                    value={values.drinking}
                    error={errors.drinking}
                    required
                    onChange={(value) => handleChange('drinking', value)}
                    activeIconMode="check"
                    style={{ flex: 1 }}
                    direction="vertical"
                />

                <ChipSelector
                    label="Smoking"
                    options={masterlist?.smokingHabits || []}
                    value={values.smoking}
                    error={errors.smoking}
                    required
                    onChange={(value) => handleChange('smoking', value)}
                    activeIconMode="check"
                    style={{ flex: 1 }}
                    direction="vertical"
                />
            </View>

            <View style={styles.footerButtons}>
                <IconButton
                    iconName="arrow-back-outline"
                    onPress={handleBack}
                    containerStyle={styles.backButton}
                />
                <PrimaryButton
                    title="Next"
                    onPress={handleNext}
                    addonRight={<Ionicons name="arrow-forward-outline" size={responsiveSize(20)} color="white" />}
                    containerStyle={styles.nextButton}
                />
            </View>
        </View>
    );
};

export default OnboardingPreferences;

const styles = StyleSheet.create({
    formContainer: {
        gap: responsiveSize(15),
    },
    row: {
        flexDirection: 'row',
        gap: responsiveSize(15),
        width: '100%'
    },
    footerButtons: {
        marginTop: responsiveSize(10),
        flexDirection: 'row',
        gap: responsiveSize(15),
    },
    backButton: {
        backgroundColor: '#F5F7FA',
        height: responsiveSize(50),
        width: responsiveSize(50),
    },
    nextButton: {
        flex: 1,
    },
});

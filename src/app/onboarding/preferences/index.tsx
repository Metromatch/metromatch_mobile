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
import FormInput from '@/components/general/atoms/form_input';
import useMetromatchStore from '@/store';

const validateAge = (value: number | string) => {
    if (!value) return null;
    if (Number(value) < 18) {
        return 'Age can not be less than 18';
    }
    if (Number(value) > 100) {
        return 'Age can not be more than 100';
    }
    return null;
}

const validateMaxAge = (value: number | string, minAge: number | string) => {
    if (!value) return null;
    const error = validateAge(value)
    if (error) return error
    if (Number(value) < Number(minAge)) {
        return 'Max age can not be less than min age';
    }
    return null;
}

const OnboardingPreferences = () => {
    const router = useRouter();
    const { masterlist } = useMasterListQuery();
    const { setOnboardingFormValues, onboardingSteps: { formValues } } = useMetromatchStore();

    const { values, errors, handleChange, validateAll } = useFormValidation({
        prefMinAge: formValues?.prefMinAge || '',
        prefMaxAge: formValues?.prefMaxAge || '',
        prefMinHeight: formValues?.prefMinHeight || null,
        prefMaxHeight: formValues?.prefMaxHeight || null,
        prefReligion: formValues?.prefReligion || null,
        prefDiet: formValues?.prefDiet || null,
        prefDrinking: formValues?.prefDrinking || null,
        prefSmoking: formValues?.prefSmoking || null,
    }, {
        prefMinAge: { required: false, validate: validateAge },
        prefMaxAge: { required: false, validate: (value: any, currentValues: any): string | null => validateMaxAge(value, currentValues.prefMinAge) },
    });

    const handleNext = () => {
        if (!validateAll()) return;

        setOnboardingFormValues(values);
        router.push('/onboarding/photos');
    };

    const handleBack = () => {
        setOnboardingFormValues(values);
        router.back();
    };

    return (
        <View style={styles.formContainer}>
            <View style={styles.row}>
                <FormInput
                    flex1
                    label="Min Age"
                    placeholder="Enter min age"
                    value={values.prefMinAge}
                    onChangeText={(text) => handleChange('prefMinAge', text)}
                    error={errors.prefMinAge}
                    keyboardType="numeric"
                />
                <FormInput
                    flex1
                    label="Max Age"
                    placeholder="Enter max age"
                    value={values.prefMaxAge}
                    onChangeText={(text) => handleChange('prefMaxAge', text)}
                    error={errors.prefMaxAge}
                    keyboardType="numeric"
                />
            </View>
            <View style={styles.row}>
                <FormSelect
                    flex1
                    label="Min Height"
                    placeholder="Preferred min height"
                    value={values.prefMinHeight}
                    error={errors.prefMinHeight}
                    options={masterlist?.height || []}
                    onChange={(value) => handleChange('prefMinHeight', value)}
                    icon="person-outline"
                />
                <FormSelect
                    flex1
                    label="Max Height"
                    placeholder="Preferred max height"
                    value={values.prefMaxHeight}
                    error={errors.prefMaxHeight}
                    options={masterlist?.height || []}
                    onChange={(value) => handleChange('prefMaxHeight', value)}
                    icon="person-outline"
                />
            </View>

            <FormSelect
                flex1
                label="Religion"
                placeholder="Preferred religion"
                value={values.prefReligion}
                error={errors.prefReligion}
                options={masterlist?.religion || []}
                onChange={(value) => handleChange('prefReligion', value)}
                icon="leaf-outline"
            />

            <ChipSelector
                label="Diet Preferences"
                options={masterlist?.diet || []}
                value={values.prefDiet}
                error={errors.prefDiet}
                onChange={(value) => handleChange('prefDiet', value)}
            />

            <View style={styles.row}>
                <ChipSelector
                    label="Drinking"
                    options={masterlist?.drinkingHabits || []}
                    value={values.prefDrinking}
                    error={errors.prefDrinking}
                    onChange={(value) => handleChange('prefDrinking', value)}
                    activeIconMode="check"
                    style={{ flex: 1 }}
                    direction="vertical"
                />

                <ChipSelector
                    label="Smoking"
                    options={masterlist?.smokingHabits || []}
                    value={values.prefSmoking}
                    error={errors.prefSmoking}
                    onChange={(value) => handleChange('prefSmoking', value)}
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

import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { responsiveSize } from '@/utils/responsive';
import { COLORS, TYPOGRAPHY } from '@/constants/theme';
import FormInput from '@/components/general/atoms/form_input';
import FormSelect from '@/components/shared/molecules/form_select';
import ChipSelector, { ChipOption } from '@/components/shared/molecules/chip_selector';
import PrimaryButton from '@/components/general/atoms/primary_button';
import IconButton from '@/components/general/atoms/icon_button';
import DoubleHeartIcon from '@/components/shared/atoms/double_heart';
import useMasterListQuery from '@/hooks/services/useMasterListQuery';
import useMetromatchStore from '@/store';
import { useFormValidation } from '@/hooks/useFormValidation';

const OnboardingDetails = () => {
    const { setOnboardingFormValues, onboardingSteps: { formValues } } = useMetromatchStore();
    const router = useRouter();

    const { values, errors, handleChange, validateAll } = useFormValidation({
        profession: formValues?.profession || '',
        height: formValues?.height || null,
        religion: formValues?.religion || null,
        diet: formValues?.diet || null,
        drinking: formValues?.drinking || null,
        smoking: formValues?.smoking || null,
        vibe: formValues?.vibe || null,
        lookingFor: formValues?.lookingFor || null,
        interestedIn: formValues?.interestedIn || null,
    }, {});

    const { masterlist } = useMasterListQuery();


    const handleNext = () => {
        if (!validateAll()) return;

        setOnboardingFormValues(values);
        router.push('/onboarding/preferences');
    };

    const handleBack = () => {
        setOnboardingFormValues(values);
        router.back();
    };

    return (
        <View style={styles.formContainer}>
            <FormInput
                label="Profession"
                placeholder="Engineer, Student, Doctor, etc."
                value={values.profession}
                onChangeText={(text) => handleChange('profession', text)}
                error={errors.profession}
                addonLeft={<Ionicons name="briefcase-outline" size={responsiveSize(20)} color={COLORS.textSecondary} />}
                containerStyle={styles.inputSpacing}
            />

            <View style={styles.row}>
                <FormSelect
                    flex1
                    label="Height"
                    placeholder="Select your height"
                    value={values.height}
                    error={errors.height}
                    icon="person-outline"
                    options={masterlist?.height || []}
                    onChange={(value) => handleChange('height', value)}
                />
                <FormSelect
                    flex1
                    label="Religion"
                    placeholder="Select religion"
                    value={values.religion}
                    error={errors.religion}
                    icon="leaf-outline"
                    options={masterlist?.religion || []}
                    onChange={(value) => handleChange('religion', value)}
                />
            </View>

            <ChipSelector
                label="Diet"
                options={masterlist?.diet || []}
                value={values.diet}
                error={errors.diet}
                onChange={(value) => handleChange('diet', value)}
            />

            <View style={styles.row}>
                <ChipSelector
                    label="Drinking"
                    options={masterlist?.drinkingHabits || []}
                    value={values.drinking}
                    error={errors.drinking}
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
                    onChange={(value) => handleChange('smoking', value)}
                    activeIconMode="check"
                    style={{ flex: 1 }}
                    direction="vertical"
                />
            </View>

            <ChipSelector
                label="Your Vibe"
                options={[]}
                value={values.vibe}
                error={errors.vibe}
                onChange={(value) => handleChange('vibe', value)}
            />

            <View style={styles.row}>
                <ChipSelector
                    label="Looking For"
                    options={masterlist?.relationshipPreference || []}
                    value={values.lookingFor}
                    error={errors.lookingFor}
                    onChange={(value) => handleChange('lookingFor', value)}
                    activeIconMode="check"
                    style={{ flex: 1 }}
                    direction="vertical"
                />

                <ChipSelector
                    label="Interested In"
                    options={masterlist?.interestedIn || []}
                    value={values.interestedIn}
                    error={errors.interestedIn}
                    onChange={(value) => handleChange('interestedIn', value)}
                    activeIconMode="check"
                    style={{ flex: 1 }}
                    direction="vertical"
                />
            </View>

            {/* <ChipSelector
                label="Places You Want To Visit"
                options={dietOptions}
                value={diet}
                onChange={setDiet}
            /> */}

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

export default OnboardingDetails;

const styles = StyleSheet.create({
    formContainer: {
        gap: responsiveSize(15),
    },
    inputSpacing: {
        // marginBottom: responsiveSize(20),
    },
    row: {
        flexDirection: 'row',
        // justifyContent: 'space-between',
        // marginBottom: responsiveSize(20),
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

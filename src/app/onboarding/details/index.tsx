import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { responsiveSize } from '@/utils/responsive';
import { COLORS, TYPOGRAPHY } from '@/constants/theme';
import FormInput from '@/components/general/atoms/form_input';
import FormSelect from '@/components/general/organisms/form_select';
import ChipSelector, { ChipOption } from '@/components/general/molecules/chip_selector';
import PrimaryButton from '@/components/general/atoms/primary_button';
import IconButton from '@/components/general/atoms/icon_button';
import useMasterListQuery from '@/hooks/services/useMasterListQuery';
import useMetromatchStore from '@/store';
import { useFormValidation } from '@/hooks/useFormValidation';
import MultiChipSelector from '@/components/general/molecules/multi_chip_selector';

const OnboardingDetails = () => {
    const { setOnboardingFormValues, onboardingSteps: { formValues } } = useMetromatchStore();
    const router = useRouter();

    const { values, errors, handleChange, validateAll } = useFormValidation({
        profession: formValues?.profession || '',
        height: formValues?.height || null,
        religion: formValues?.religion || null,
        diet: formValues?.diet || null,
        drinkingHabits: formValues?.drinkingHabits || null,
        smokingHabits: formValues?.smokingHabits || null,
        vibe: formValues?.vibe || [],
        relationshipPreference: formValues?.relationshipPreference || null,
        interestedIn: formValues?.interestedIn || null,
        bio: formValues?.bio || '',
    }, {
        profession: { required: true, message: 'Required' },
        // height: { required: true, message: 'Required' },
        // religion: { required: true, message: 'Required' },
        // diet: { required: true, message: 'Required' },
        // drinkingHabits: { required: true, message: 'Required' },
        // smokingHabits: { required: true, message: 'Required' },
        vibe: {
            required: true,
            message: 'Required',
            validate: (value: string[]) => {
                // if (!value || value.length === 0) return null;
                const count = value.length;
                if (count < 1) {
                    return 'You must select at least 1 vibes';
                }
                if (count > 7) {
                    return 'You must select at most 7 vibes';
                }
                return null;
            }
        },
        relationshipPreference: { required: true, message: 'Required' },
        interestedIn: { required: true, message: 'Required' },
        bio: {
            required: true, message: 'Required', validate: (value: string) => {
                if (value.length < 20) {
                    return 'Bio must be at least 20 characters';
                }
                if (value.length > 200) {
                    return 'Bio must be at most 200 characters';
                }
                return null;
            }
        },
    });

    const { masterlist } = useMasterListQuery();
    const handleNext = () => {
        if (!validateAll()) return;

        setOnboardingFormValues(values);
        router.push('/onboarding/metro_details');
    };

    const handleBack = () => {
        setOnboardingFormValues(values);
        router.back();
    };

    return (
        <View style={styles.formContainer}>
            <FormInput
                label="Profession"
                required
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
                    value={values.drinkingHabits}
                    error={errors.drinkingHabits}
                    onChange={(value) => handleChange('drinkingHabits', value)}
                    activeIconMode="check"
                    style={{ flex: 1 }}
                    direction="vertical"
                />
                <ChipSelector
                    label="Smoking"
                    options={masterlist?.smokingHabits || []}
                    value={values.smokingHabits}
                    error={errors.smokingHabits}
                    onChange={(value) => handleChange('smokingHabits', value)}
                    activeIconMode="check"
                    style={{ flex: 1 }}
                    direction="vertical"
                />
            </View>

            <MultiChipSelector
                required
                label="Your Vibe"
                options={masterlist?.vibe || []}
                value={values.vibe}
                error={errors.vibe}
                onChange={(value) => handleChange('vibe', value)}
            />

            <View style={styles.row}>
                <ChipSelector
                    label="Looking For"
                    options={masterlist?.relationshipPreference || []}
                    value={values.relationshipPreference}
                    error={errors.relationshipPreference}
                    onChange={(value) => handleChange('relationshipPreference', value)}
                    activeIconMode="check"
                    style={{ flex: 1 }}
                    direction="vertical"
                    required
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
                    required
                />
            </View>

            {/* <ChipSelector
                label="Places You Want To Visit"
                options={dietOptions}
                value={diet}
                onChange={setDiet}
            /> */}
            <FormInput
                label="Your Bio"
                required
                placeholder="Write something about yourself..."
                value={values.bio}
                onChangeText={(text) => handleChange('bio', text)}
                error={errors.bio}
                multiline
            />

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

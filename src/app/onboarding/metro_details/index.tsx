import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { responsiveSize } from '@/utils/responsive';
import FormSelect from '@/components/general/organisms/form_select';
import ChipSelector from '@/components/general/molecules/chip_selector';
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
        frequentMetroStation: formValues?.frequentMetroStation || null,
        travelFrequency: formValues?.travelFrequency || null,
        travelTimeSlots: formValues?.travelTimeSlots || [],
    }, {});

    const { masterlist, metroStationList } = useMasterListQuery();

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
            <FormSelect
                label="Frequent Metro Station"
                placeholder="Select your Frequent Metro Station"
                value={values.frequentMetroStation}
                error={errors.frequentMetroStation}
                icon="train-outline"
                options={metroStationList || []}
                onChange={(value) => handleChange('frequentMetroStation', value)}
            />
            <ChipSelector
                label="Travel Frequency"
                options={masterlist?.travelFrequency || []}
                value={values.travelFrequency}
                error={errors.travelFrequency}
                onChange={(value) => handleChange('travelFrequency', value)}
                activeIconMode="check"
                direction="vertical"
            />
            <MultiChipSelector
                label="Travel Time"
                options={masterlist?.travelTimeRange || []}
                value={values.travelTimeSlots}
                error={errors.travelTimeSlots}
                onChange={(value) => handleChange('travelTimeSlots', value)}
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

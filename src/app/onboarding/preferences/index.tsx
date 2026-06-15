import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { responsiveSize } from '@/utils/responsive';
import FormSelect from '@/components/shared/molecules/form_select';
import ChipSelector, { ChipOption } from '@/components/shared/molecules/chip_selector';
import PrimaryButton from '@/components/general/atoms/primary_button';
import IconButton from '@/components/general/atoms/icon_button';

const dietOptions: ChipOption[] = [
    { label: 'Vegetarian', value: 'vegetarian', icon: 'leaf-outline' },
    { label: 'Non-Veg', value: 'non_veg', icon: 'restaurant-outline' },
    { label: 'Vegan', value: 'vegan', icon: 'leaf-outline' },
    { label: 'Eggetarian', value: 'eggetarian', icon: 'egg-outline' },
    { label: 'Jain', value: 'jain', icon: 'hand-left-outline' },
];

const drinkingOptions: ChipOption[] = [
    { label: 'Never', value: 'never' },
    { label: 'Sometimes', value: 'sometimes' },
    { label: 'Yes', value: 'yes' },
];

const smokingOptions: ChipOption[] = [
    { label: 'Never', value: 'never' },
    { label: 'Sometimes', value: 'sometimes' },
    { label: 'Yes', value: 'yes' },
];

const OnboardingPreferences = () => {
    const router = useRouter();

    const [height, setHeight] = useState('');
    const [religion, setReligion] = useState('');
    const [diet, setDiet] = useState<string | null>(null);
    const [drinking, setDrinking] = useState<string | null>(null);
    const [smoking, setSmoking] = useState<string | null>(null);

    const handleNext = () => {
        console.log('Next step with:', { height, religion, diet, drinking, smoking });
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
                    value={height}
                    onPress={() => console.log('Open height picker')}
                    icon="person-outline"
                />
                <FormSelect
                    flex1
                    label="Religion"
                    placeholder="Preferred religion"
                    value={religion}
                    onPress={() => console.log('Open religion picker')}
                    icon="leaf-outline"
                />
            </View>

            <ChipSelector
                label="Diet Preferences"
                options={dietOptions}
                value={diet}
                onChange={setDiet}
            />

            <View style={styles.row}>
                <ChipSelector
                    label="Drinking"
                    options={drinkingOptions}
                    value={drinking}
                    onChange={setDrinking}
                    activeIconMode="check"
                    style={{ flex: 1 }}
                    direction="vertical"
                />

                <ChipSelector
                    label="Smoking"
                    options={smokingOptions}
                    value={smoking}
                    onChange={setSmoking}
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

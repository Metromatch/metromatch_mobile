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

const dietOptions: ChipOption[] = [
    { label: 'Vegetarian', value: 'vegetarian', icon: 'leaf-outline', iconColor: 'green' },
    { label: 'Non-Veg', value: 'non_veg', icon: 'restaurant-outline', iconColor: 'red' },
    { label: 'Vegan', value: 'vegan', icon: 'leaf-outline', iconColor: 'green' },
    { label: 'Eggetarian', value: 'eggetarian', icon: 'egg-outline', iconColor: 'yellow' },
    { label: 'Jain', value: 'jain', icon: 'hand-left-outline', iconColor: 'blue' },
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

const OnboardingDetails = () => {
    const router = useRouter();

    const [profession, setProfession] = useState('');
    const [height, setHeight] = useState('');
    const [religion, setReligion] = useState('');
    const [diet, setDiet] = useState<string | null>(null);
    const [drinking, setDrinking] = useState<string | null>(null);
    const [smoking, setSmoking] = useState<string | null>(null);
    const { masterlist } = useMasterListQuery();
    const handleNext = () => {
        console.log('Next step with:', { profession, height, religion, diet, drinking, smoking });
        router.push('/onboarding/preferences');
    };

    const handleBack = () => {
        router.back();
    };

    return (
        <View style={styles.formContainer}>
            <FormInput
                label="Profession"
                placeholder="Engineer, Student, Doctor, etc."
                value={profession}
                onChangeText={setProfession}
                addonLeft={<Ionicons name="briefcase-outline" size={responsiveSize(20)} color={COLORS.textSecondary} />}
                containerStyle={styles.inputSpacing}
            />

            <View style={styles.row}>
                <FormSelect
                    flex1
                    label="Height"
                    placeholder="Select your height"
                    value={height}
                    onPress={() => console.log('Open height picker')}
                    icon="person-outline"
                />
                <FormSelect
                    flex1
                    label="Religion"
                    placeholder="Select religion"
                    value={religion}
                    onPress={() => console.log('Open religion picker')}
                    icon="leaf-outline" // Placeholder icon since leaf is close to what's in image
                />
            </View>

            <ChipSelector
                label="Diet"
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

            <ChipSelector
                label="Yout Vibe"
                options={dietOptions}
                value={diet}
                onChange={setDiet}
            />

            <View style={styles.row}>
                <ChipSelector
                    label="Looking For"
                    options={masterlist.diet}
                    value={drinking}
                    onChange={setDrinking}
                    activeIconMode="check"
                    style={{ flex: 1 }}
                    direction="vertical"
                />

                <ChipSelector
                    label="Interested In"
                    options={masterlist.gender}
                    value={smoking}
                    onChange={setSmoking}
                    activeIconMode="check"
                    style={{ flex: 1 }}
                    direction="vertical"
                />
            </View>

            <ChipSelector
                label="Places You Want To Visit"
                options={dietOptions}
                value={diet}
                onChange={setDiet}
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

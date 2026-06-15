import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { responsiveSize } from '@/utils/responsive';
import { COLORS, TYPOGRAPHY } from '@/constants/theme';
import FormInput from '@/components/shared/atoms/form_input';
import GenderSelector, { GenderType } from '@/components/shared/molecules/gender_selector';
import PrimaryButton from '@/components/general/atoms/primary_button';
import DoubleHeartIcon from '@/components/shared/atoms/double_heart';

const OnboardingBasicInfo = () => {
    const router = useRouter();

    const [name, setName] = useState('');
    const [dob, setDob] = useState('');
    const [gender, setGender] = useState<GenderType>(null);

    const handleContinue = () => {
        // Validation and navigation logic to be added
        console.log('Continue with:', { name, dob, gender });
        router.push('/onboarding/details');
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
                    value={name}
                    onChangeText={setName}
                    addonLeft={<Ionicons name="person-outline" size={responsiveSize(20)} color={COLORS.textSecondary} />}
                    containerStyle={styles.inputSpacing}
                />

                <FormInput
                    label="Date of Birth"
                    placeholder="DD / MM / YYYY"
                    value={dob}
                    onChangeText={setDob}
                    addonLeft={<Ionicons name="calendar-outline" size={responsiveSize(20)} color={COLORS.textSecondary} />}
                    addonRight={<Ionicons name="chevron-down-outline" size={responsiveSize(20)} color={COLORS.textPrimary} />}
                    containerStyle={styles.inputSpacing}
                    editable={false} // Will be a date picker eventually
                    onPressAddonRight={() => console.log('Open date picker')}
                />

                <GenderSelector
                    label="Gender"
                    value={gender}
                    onChange={setGender}
                />

                <PrimaryButton
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
    },
    inputSpacing: {
        marginBottom: responsiveSize(20),
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
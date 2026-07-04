import PrimaryButton from '@/components/general/atoms/primary_button'
import FormInput from '@/components/general/atoms/form_input'
import { responsiveSize } from '@/utils/responsive'
import Ionicons from '@expo/vector-icons/Ionicons'
import React, { useState } from 'react'
import { Text, View, StyleSheet, Alert, Keyboard } from 'react-native'
import useAuthService from '@/hooks/services/useAuthService'
import { useAuthStore } from '@/store/authStore'
import { getDeviceDetails } from '@/utils/authUtils'
import { router } from 'expo-router'
import { useFormValidation } from '@/hooks/useFormValidation'

const Signup = () => {
    const [passwordVisible, setPasswordVisible] = useState(false)
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false)

    const { values, errors, handleChange, validateAll } = useFormValidation({
        email: '',
        password: '',
        confirmPassword: ''
    }, {
        email: {
            required: true,
            message: 'Please enter a valid email',
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        },
        password: {
            required: true,
            message: 'Please enter a password',
            minLength: 8
        },
        confirmPassword: {
            required: true,
            message: 'Please confirm your password',
            validate: (value, formValues) => value !== formValues.password ? 'Passwords do not match' : null
        }
    });

    const { setAuthDetails } = useAuthStore();
    const { signup, isSignupLoading } = useAuthService();

    const onPressSignup = async () => {
        Keyboard.dismiss()
        if (!validateAll()) return;

        try {
            const { deviceId, deviceName } = await getDeviceDetails();
            const res = await signup({
                payload: {
                    email: values.email,
                    password: values.password,
                    deviceId,
                    deviceName
                }
            });

            const { accessToken, refreshToken, refreshTokenExpiresAt } = res.data.data;
            if (accessToken) {
                const accessTokenExpiresAt = JSON.parse(atob(accessToken.split('.')[1])).exp * 1000;
                setAuthDetails({
                    accessToken,
                    refreshToken: refreshToken || '',
                    accessTokenExpiresAt: accessTokenExpiresAt || '',
                    refreshTokenExpiresAt: refreshTokenExpiresAt || '',
                    isLoggedIn: true
                });
                router.replace('/onboarding/basic_info');
            }
        } catch (error: any) {
            Alert.alert("Signup Failed", error?.response?.data?.message || "An error occurred during signup");
        }
    }

    return (
        <View style={styles.container}>
            <FormInput
                value={values.email}
                onChangeText={(text) => handleChange('email', text)}
                label="Email Address"
                placeholder='Enter your email address'
                error={errors.email}
                required
                addonLeft={(
                    <Ionicons
                        name="mail-outline"
                        size={responsiveSize(17)}
                        color="#7E89AA"
                    />
                )}
                maxLength={50}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <FormInput
                value={values.password}
                onChangeText={(text) => handleChange('password', text)}
                label="Password"
                placeholder='Enter your password'
                error={errors.password}
                required
                addonLeft={(<Ionicons
                    name="lock-closed-outline"
                    size={responsiveSize(17)}
                    color="#7E89AA"
                />)}
                secureTextEntry={!passwordVisible}
                onPressAddonRight={() => setPasswordVisible(!passwordVisible)}
                addonRight={(
                    <Ionicons
                        name={!passwordVisible ? "eye-off-outline" : "eye-outline"}
                        size={responsiveSize(19)}
                        color="#7E89AA"
                    />
                )}
                maxLength={30}
            />
            <FormInput
                value={values.confirmPassword}
                onChangeText={(text) => handleChange('confirmPassword', text)}
                label="Confirm Password"
                placeholder='Confirm your password'
                error={errors.confirmPassword}
                required
                addonLeft={(<Ionicons
                    name="lock-closed-outline"
                    size={responsiveSize(17)}
                    color="#7E89AA"
                />)}
                secureTextEntry={!confirmPasswordVisible}
                onPressAddonRight={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                addonRight={(
                    <Ionicons
                        name={!confirmPasswordVisible ? "eye-off-outline" : "eye-outline"}
                        size={responsiveSize(19)}
                        color="#7E89AA"
                    />
                )}
                maxLength={30}
            />

            <Text style={styles.terms}>
                By signing up, you agree to our
                <Text style={styles.link}>
                    {' '}Terms
                </Text>
                {' & '}
                <Text style={styles.link}>
                    Privacy Policy
                </Text>
            </Text>

            <PrimaryButton
                title="Create My Account"
                onPress={onPressSignup}
                loading={isSignupLoading}
                addonLeft={(
                    <Ionicons
                        name="heart"
                        size={responsiveSize(18)}
                        color="white"
                    />
                )}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        gap: responsiveSize(20),
    },
    terms: {
        textAlign: 'center',
        color: '#7782A0',
        lineHeight: 24,
        fontFamily: 'Poppins_400Regular',
        fontSize: 10
    },
    link: {
        color: '#2F6BFF',
        fontWeight: '600',
    },
})

export default Signup
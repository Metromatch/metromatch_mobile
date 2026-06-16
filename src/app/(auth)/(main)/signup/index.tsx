import PrimaryButton from '@/components/general/atoms/primary_button'
import FormInput from '@/components/general/atoms/form_input'
import { responsiveSize } from '@/utils/responsive'
import Ionicons from '@expo/vector-icons/Ionicons'
import React, { useState } from 'react'
import { Text, View, StyleSheet, Alert } from 'react-native'
import useAuthService from '@/hooks/services/useAuthService'
import { useAuthStore } from '@/store/authStore'
import { getDeviceDetails } from '@/utils/authUtils'
import { router } from 'expo-router'

const Signup = () => {
    const [passwordVisible, setPasswordVisible] = useState(false)
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const { setAuthDetails } = useAuthStore();
    const { signup, isSignupLoading } = useAuthService();

    const onPressSignup = async () => {
        if (password !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match");
            return;
        }

        try {
            const { deviceId, deviceName } = await getDeviceDetails();
            const res = await signup({
                payload: {
                    email,
                    password,
                    deviceId,
                    deviceName
                }
            });

            const { accessToken, refreshToken, accessTokenExpiresAt, refreshTokenExpiresAt, onboardingCompleted } = res.data.data;
            if (accessToken) {
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
        <View>
            <FormInput
                value={email}
                onChangeText={(text) => setEmail(text)}
                label="Email address"
                placeholder='Enter your email address'
                required
                addonLeft={(
                    <Ionicons
                        name="mail-outline"
                        size={responsiveSize(17)}
                        color="#7E89AA"
                    />
                )}
                maxLength={50}
            />
            <FormInput
                value={password}
                onChangeText={(text) => setPassword(text)}
                label="Password"
                placeholder='Enter your password'
                containerStyle={{ marginTop: 20 }}
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
                value={confirmPassword}
                onChangeText={(text) => setConfirmPassword(text)}
                label="Confirm Password"
                placeholder='Confirm your password'
                containerStyle={{ marginTop: 20 }}
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
                containerStyle={{ marginTop: responsiveSize(10) }}
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
    terms: {
        textAlign: 'center',
        color: '#7782A0',
        lineHeight: 24,
        marginTop: 15,
        fontFamily: 'Poppins_400Regular',
        fontSize: 10
    },
    link: {
        color: '#2F6BFF',
        fontWeight: '600',
    },
})

export default Signup
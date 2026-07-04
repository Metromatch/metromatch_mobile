import PrimaryButton from '@/components/general/atoms/primary_button'
import FormInput from '@/components/general/atoms/form_input'
import useAuthService from '@/hooks/services/useAuthService'
import { useAuthStore } from '@/store/authStore'
import { getDeviceDetails } from '@/utils/authUtils'
import { responsiveSize } from '@/utils/responsive'
import Ionicons from '@expo/vector-icons/Ionicons'
import { router } from 'expo-router'
import React, { useState } from 'react'
import { Keyboard, View } from 'react-native'
import { useFormValidation } from '@/hooks/useFormValidation'

const Login = () => {
    const [passwordVisible, setPasswordVisible] = useState(false)

    const { values, errors, handleChange, validateAll } = useFormValidation({
        email: '',
        password: ''
    }, {
        email: {
            required: true,
            message: 'Please enter a valid email',
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        },
        password: {
            required: true,
            message: 'Please enter your password'
        }
    });

    const { setAuthDetails } = useAuthStore();

    const handlePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible)
    }

    const { login, isLoginLoading } = useAuthService();

    const onPressLogin = async () => {
        Keyboard.dismiss()
        if (!validateAll()) return;

        const { deviceId, deviceName } = await getDeviceDetails();
        const res = await login({
            payload: {
                email: values.email,
                password: values.password,
                deviceId,
                deviceName
            }
        });

        const { accessToken, refreshToken, refreshTokenExpiresAt, onboardingCompleted } = res.data.data
        if (accessToken) {
            const accessTokenExpiresAt = JSON.parse(atob(accessToken.split('.')[1])).exp * 1000;
            setAuthDetails({
                accessToken,
                refreshToken: refreshToken || '',
                accessTokenExpiresAt: accessTokenExpiresAt || '',
                refreshTokenExpiresAt: refreshTokenExpiresAt || '',
                isLoggedIn: true
            })
            router.replace('/');
        }

    }

    return (
        <View style={{ gap: responsiveSize(20) }}>
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
                onPressAddonRight={handlePasswordVisibility}
                addonRight={(
                    <Ionicons
                        name={!passwordVisible ? "eye-off-outline" : "eye-outline"}
                        size={responsiveSize(19)}
                        color="#7E89AA"
                    />
                )}
                maxLength={30}
            />
            <PrimaryButton
                title="Login"
                containerStyle={{ marginTop: responsiveSize(10) }}
                onPress={onPressLogin}
                loading={isLoginLoading}
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

export default Login
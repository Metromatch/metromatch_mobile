import PrimaryButton from '@/components/general/atoms/primary_button'
import FormInput from '@/components/general/atoms/form_input'
import useAuthService from '@/hooks/services/useAuthService'
import { useAuthStore } from '@/store/authStore'
import { getDeviceDetails } from '@/utils/authUtils'
import { responsiveSize } from '@/utils/responsive'
import Ionicons from '@expo/vector-icons/Ionicons'
import { router } from 'expo-router'
import React, { useState } from 'react'
import { View } from 'react-native'

const Login = () => {
    const [passwordVisible, setPasswordVisible] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const { setAuthDetails } = useAuthStore();

    const handlePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible)
    }

    const { login, isLoginLoading } = useAuthService();

    const onPressLogin = async () => {
        // router.replace('/onboarding/basic_info');
        const { deviceId, deviceName } = await getDeviceDetails();
        const res = await login({
            payload: {
                email,
                password,
                deviceId,
                deviceName
            }
        });

        const { accessToken, refreshToken, accessTokenExpiresAt, refreshTokenExpiresAt, onboardingCompleted } = res.data.data
        if (accessToken) {
            setAuthDetails({
                accessToken,
                refreshToken: refreshToken || '',
                accessTokenExpiresAt: accessTokenExpiresAt || '',
                refreshTokenExpiresAt: refreshTokenExpiresAt || '',
                isLoggedIn: true
            })
            router.replace(onboardingCompleted ? '/main/sessions' : '/onboarding/basic_info');
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
                containerStyle={{ marginTop: responsiveSize(24) }}
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
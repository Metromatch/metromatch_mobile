import PrimaryButton from '@/components/general/atoms/primary_button'
import FormInput from '@/components/shared/atoms/form_input'
import { responsiveSize } from '@/utils/responsive'
import Ionicons from '@expo/vector-icons/Ionicons'
import React, { useState } from 'react'
import { Text, View, StyleSheet } from 'react-native'

const Signup = () => {
    const [passwordVisible, setPasswordVisible] = useState(false)
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

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
                onPress={() => { }}
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
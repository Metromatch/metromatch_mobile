import FormInput from '@/components/shared/atoms/form_input'
import React from 'react'
import { Text, View } from 'react-native'

const Login = () => {
    return (
        <View>
            <FormInput
                value=''
                onChangeText={() => { }}
                label="Email address"
                placeholder='Enter your email address'
                required
            />
            <FormInput
                value=''
                onChangeText={() => { }}
                label="Password"
                placeholder='Enter your password'
                containerStyle={{ marginTop: 20 }}
                required
            />
        </View>
    )
}

export default Login
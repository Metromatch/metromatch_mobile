import { B1 } from '@/components/general/atoms/body_text'
import { H3 } from '@/components/general/atoms/heading_text'
import React from 'react'
import { View } from 'react-native'

const OnboardingBasicInfo = () => {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: "white" }}>
            <H3 text="Onboarding Basic Info" />
            <B1 text="Onboarding Basic Info" />
        </View>
    )
}

export default OnboardingBasicInfo
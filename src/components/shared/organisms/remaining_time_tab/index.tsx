import CountdownTimer from '@/components/general/atoms/countdown_timer'
import GlassmorphicCard from '@/components/general/molecules/glass_morphic_card'
import useSubscriptionService from '@/hooks/services/useSubscriptionService'
import { responsiveSize } from '@/utils/responsive'
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { Text, TouchableOpacity } from 'react-native'

const RemainigTimeTab = () => {
    const { userCredits, isUserCreditsLoading, deductCredits } = useSubscriptionService()
    console.log('userCredits', userCredits)


    return (
        <GlassmorphicCard intensity={30} style={{ flex: 1, marginHorizontal: 10, paddingHorizontal: responsiveSize(14), paddingVertical: responsiveSize(7), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
            {/* <Text>You are on a roll!</Text> */}
            <CountdownTimer remainingMinutes={1} />

            {/*button to add 10 minutes to the timer*/}
            <TouchableOpacity onPress={() => { deductCredits({ type: 'extension' }) }} style={{ borderWidth: 1, borderColor: 'white', borderRadius: responsiveSize(20), flexDirection: 'row', alignItems: 'center', gap: 5, padding: responsiveSize(5), }}>
                <Ionicons name='timer-outline' size={20} color='white' />
                <Text style={{ color: 'white', fontWeight: 'bold' }}>+10 min</Text>
            </TouchableOpacity>
        </GlassmorphicCard>
    )
}

export default RemainigTimeTab
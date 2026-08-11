import CountdownTimer from '@/components/general/atoms/countdown_timer'
import GlassmorphicCard from '@/components/general/molecules/glass_morphic_card'
import useSubscriptionService from '@/hooks/services/useSubscriptionService'
import { responsiveSize } from '@/utils/responsive'
import { Ionicons } from '@expo/vector-icons'
import React, { useEffect, useState } from 'react'
import { Text, TouchableOpacity } from 'react-native'

const remainingMinutes = (date1: Date, date2: Date = new Date()) => {
    const diffInMilliseconds = date2.getTime() - date1.getTime()
    const diffInMinutes = diffInMilliseconds / (1000 * 60)
    if (diffInMinutes > 10) {
        return 0
    } else {
        return 10 - diffInMinutes
    }
}

const RemainigTimeTab = () => {
    const [availableMinutes, setAvailableMinutes] = useState(0)
    const { userCredits, isUserCreditsLoading, deductCredits } = useSubscriptionService()


    useEffect(() => {
        if (!userCredits || isUserCreditsLoading) return;
        const remaining = remainingMinutes(new Date(userCredits.lastExtended))
        // console.log('remaining', remaining)
        setAvailableMinutes(availableMinutes + remaining)

    }, [userCredits])
    return (
        <GlassmorphicCard intensity={30} style={{ flex: 1, marginHorizontal: 10, paddingHorizontal: responsiveSize(14), paddingVertical: responsiveSize(7), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
            {/* <Text>You are on a roll!</Text> */}
            <CountdownTimer remainingMinutes={availableMinutes} />

            {/*button to add 10 minutes to the timer*/}
            <TouchableOpacity onPress={() => { deductCredits({ type: 'extension' }) }} style={{ borderWidth: 1, borderColor: 'white', borderRadius: responsiveSize(20), flexDirection: 'row', alignItems: 'center', gap: 5, padding: responsiveSize(5), }}>
                <Ionicons name='timer-outline' size={20} color='white' />
                <Text style={{ color: 'white', fontWeight: 'bold' }}>+10 min</Text>
            </TouchableOpacity>
        </GlassmorphicCard>
    )
}

export default RemainigTimeTab
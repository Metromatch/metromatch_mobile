import CountdownTimer from '@/components/general/atoms/countdown_timer'
import GlassmorphicCard from '@/components/general/molecules/glass_morphic_card'
import React from 'react'

const RemainigTimeTab = () => {
    return (
        <GlassmorphicCard intensity={30} style={{ flex: 1, marginHorizontal: 10, padding: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
            <>
                {/* <Text>You are on a roll!</Text> */}
                <CountdownTimer remainingMinutes={20} />

            </>
        </GlassmorphicCard>
    )
}

export default RemainigTimeTab
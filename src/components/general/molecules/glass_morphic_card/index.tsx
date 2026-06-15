import React from 'react'
import { BlurView } from 'expo-blur'
import { StyleSheet } from 'react-native'
import { responsiveSize } from '@/utils/responsive'

const GlassmorphicCard = ({ children }: { children: React.ReactNode }) => {
    return (
        <BlurView intensity={80} tint="light" style={styles.card}>
            {children}
        </BlurView>
    )
}

export default GlassmorphicCard

const styles = StyleSheet.create({
    card: {
        // marginHorizontal: responsiveSize(20),
        borderRadius: responsiveSize(36),
        padding: responsiveSize(24),
        overflow: 'hidden',
        backgroundColor: 'rgba(255,255,255,0.3)',
    },
})
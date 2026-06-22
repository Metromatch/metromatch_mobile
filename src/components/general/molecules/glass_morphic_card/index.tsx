import React from 'react'
import { BlurView } from 'expo-blur'
import { StyleSheet, ViewStyle } from 'react-native'
import { responsiveSize } from '@/utils/responsive'

const GlassmorphicCard = ({ children, style, intensity = 80 }: { children: React.ReactNode, style?: ViewStyle, intensity?: number }) => {
    return (
        <BlurView intensity={intensity} tint="light" style={[styles.card, style]}>
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
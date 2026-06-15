import React from 'react'
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { responsiveSize } from '@/utils/responsive'
import { TYPOGRAPHY } from '@/constants/theme'

interface ButtonType {
    addonLeft?: React.ReactNode
    addonRight?: React.ReactNode
    title?: string
    containerStyle?: ViewStyle
    onPress?: () => void
    loading?: boolean
    disabled?: boolean
}

const PrimaryButton = ({ addonLeft, addonRight, title, containerStyle, onPress, loading, disabled }: ButtonType) => {
    return (
        <TouchableOpacity activeOpacity={0.9} disabled={disabled} onPress={!loading ? onPress : () => { }} style={[containerStyle]}>
            <LinearGradient
                colors={['#6EA8FF', '#2F6BFF']}
                style={[styles.button, disabled && { opacity: 0.5 }]}>
                {loading ? (
                    <ActivityIndicator color='white' />
                ) : (
                    <>
                        {addonLeft}
                        <Text style={styles.label}>
                            {title}
                        </Text>
                        {addonRight}
                    </>
                )}
            </LinearGradient>
        </TouchableOpacity>
    )
}

export default PrimaryButton;

const styles = StyleSheet.create({
    button: {
        height: responsiveSize(50),
        borderRadius: responsiveSize(16),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: responsiveSize(8),
        shadowColor: '#2F6BFF',
        shadowOpacity: 0.3,
        shadowRadius: responsiveSize(15),
        elevation: 10,
    },
    label: {
        color: 'white',
        fontFamily: TYPOGRAPHY.medium,
        fontSize: responsiveSize(14),
    },
});

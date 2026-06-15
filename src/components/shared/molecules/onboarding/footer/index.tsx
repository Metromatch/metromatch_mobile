import { COLORS, TYPOGRAPHY } from '@/constants/theme'
import { responsiveSize } from '@/utils/responsive'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const OnboardingFooter = () => {
    return (
        <View style={styles.footerContainer}>
            <Text style={styles.footerText}>By continuing, you agree to our</Text>
            <View style={styles.footerLinksRow}>
                <TouchableOpacity>
                    <Text style={styles.footerLink}>Terms of Service</Text>
                </TouchableOpacity>
                <Text style={styles.footerText}> and </Text>
                <TouchableOpacity>
                    <Text style={styles.footerLink}>Privacy Policy</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default OnboardingFooter

const styles = StyleSheet.create({
    footerContainer: {
        marginTop: responsiveSize(30),
        alignItems: 'center',
    },
    footerText: {
        fontFamily: TYPOGRAPHY.regular,
        fontSize: responsiveSize(12),
        color: 'rgba(255, 255, 255, 0.8)',
    },
    footerLinksRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: responsiveSize(2),
    },
    footerLink: {
        fontFamily: TYPOGRAPHY.medium,
        fontSize: responsiveSize(12),
        color: COLORS.primaryLight,
    },
});
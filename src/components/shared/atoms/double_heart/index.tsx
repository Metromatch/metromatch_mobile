import React from 'react'
import { View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { responsiveSize } from '@/utils/responsive'
import { COLORS } from '@/constants/theme'
import { StyleSheet } from 'react-native'

const DoubleHeartIcon = () => {
    return (
        <View style={styles.heartsContainer}>
            <Ionicons name="heart" size={responsiveSize(24)} color={COLORS.primary} />
            <Ionicons name="heart" size={responsiveSize(18)} color={COLORS.primaryLight} style={styles.smallHeart} />
        </View>
    )
}

export default DoubleHeartIcon;

const styles = StyleSheet.create({
    heartsContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    smallHeart: {
        marginLeft: responsiveSize(-4),
        marginTop: responsiveSize(-4),
    },
})
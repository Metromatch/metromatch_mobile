import GlassmorphicCard from '@/components/general/molecules/glass_morphic_card'
import { TYPOGRAPHY } from '@/constants/theme'
import { responsiveSize } from '@/utils/responsive'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

const StatusRow = ({ photoCount, completionScore, gender }: { photoCount: number, completionScore: number, gender: string }) => {
    const list = [{
        value: photoCount,
        label: 'Photos',
    }, {
        value: completionScore,
        label: 'Complete',
    }, {
        value: gender,
        label: 'Gender',
    }]
    return (
        <GlassmorphicCard intensity={30} style={styles.statsRow}>
            {list.map((item, index) => (
                <React.Fragment key={item.label}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{item.value}</Text>
                        <Text style={styles.statLabel}>{item.label}</Text>
                    </View>
                    {index !== list.length - 1 && <View style={styles.statDivider} />}
                </React.Fragment>
            ))}
        </GlassmorphicCard>
    )
}

export default StatusRow

const styles = StyleSheet.create({
    statsRow: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: responsiveSize(16),
        paddingVertical: responsiveSize(12),
        paddingHorizontal: responsiveSize(24),
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
        gap: 0,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statValue: {
        fontFamily: TYPOGRAPHY.bold,
        fontSize: responsiveSize(18),
        color: 'white',
    },
    statLabel: {
        fontFamily: TYPOGRAPHY.regular,
        fontSize: responsiveSize(11),
        color: 'rgba(255,255,255,0.55)',
        marginTop: responsiveSize(2),
    },
    statDivider: {
        width: 1,
        height: responsiveSize(28),
        backgroundColor: 'rgba(255,255,255,0.2)',
        marginVertical: responsiveSize(10),
    },
})
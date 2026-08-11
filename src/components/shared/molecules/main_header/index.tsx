import React from 'react'
import { Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS, TYPOGRAPHY } from '@/constants/theme'
import { router } from 'expo-router'
import { responsiveSize } from '@/utils/responsive';
import GlassmorphicCard from '@/components/general/molecules/glass_morphic_card';
import { B2 } from '@/components/general/atoms/body_text';

const MainHeader = () => {
    return (
        <View style={styles.header}>
            <Image
                source={require('@/assets/images/title_without_logo.png')}
                style={styles.logo}
                resizeMode="contain"
            />
            <Pressable onPress={() => router.navigate('/subscription/planlist')}>
                <GlassmorphicCard intensity={10} style={styles.creditsContainer}>
                    <Ionicons name="diamond-outline" size={responsiveSize(16)} color="white" />
                    <B2 type="medium" text="50" textColor='white' />
                </GlassmorphicCard>
            </Pressable>

        </View>
    )
}

export default MainHeader

const styles = StyleSheet.create({
    //   container: {
    //     flexDirection: 'row',
    //     alignItems: 'center',
    //     justifyContent: 'center',
    //     paddingHorizontal: 16,
    //     paddingVertical: 12,
    //     backgroundColor: COLORS.background,
    //   },
    //   backButton: {
    //     position: 'absolute',
    //     left: 16,
    //     top: 12,
    //   },
    //   menuButton: {
    //     position: 'absolute',
    //     right: 16,
    //     top: 12,
    //   },
    //   title: {
    //     fontSize: TYPOGRAPHY.titleMedium,
    //     fontWeight: TYPOGRAPHY.weightMedium,
    //     color: COLORS.white,
    //   },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: responsiveSize(20),
        paddingVertical: responsiveSize(10),
    },
    logo: {
        height: responsiveSize(30),
        width: responsiveSize(120),
    },
    creditsContainer: { flexDirection: 'row', alignItems: 'center', gap: responsiveSize(5), height: responsiveSize(30), padding: responsiveSize(5), paddingHorizontal: responsiveSize(10) }
})
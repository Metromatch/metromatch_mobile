import React, { useState } from 'react'
import { router, Slot, usePathname } from 'expo-router'
import { Image, ImageBackground, ScrollView, StyleSheet, Text, View } from 'react-native'
import { COLORS } from '@/constants/theme'
import { BlurView } from 'expo-blur'
import VerticalTabs from '@/components/general/molecules/vertical_tabs'
import { responsiveSize } from '@/utils/responsive'
import { Span } from '@/components/general/atoms/span'

const MainAuthLayout = () => {
    const tabList = [{
        id: '/login',
        label: 'Login'
    }, {
        id: '/signup',
        label: 'Sign up'
    }]
    const pathname = usePathname()

    return (
        <View style={styles.container}>
            <ImageBackground
                source={require('@/assets/images/couple_bg.png')}
                resizeMode="cover"
                style={styles.background}>
                <View style={styles.heroOverlay} />
            </ImageBackground>
            <ScrollView>
                <View style={styles.logoContainer}>
                    <Image
                        source={require('@/assets/images/logo_with_title.png')}
                        style={styles.logo}
                    />
                    {/* <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 5, alignItems: 'center' }}>
                        <Text style={styles.tagLine}>
                            Your match.
                        </Text>
                        <Text style={[styles.tagLine, { color: COLORS.primary }]}>
                            Next to you.
                        </Text>
                    </View> */}
                </View>
                <BlurView intensity={80} tint="light" style={styles.card}>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 5, alignItems: 'center' }}>
                        <Text style={styles.welcome}>Welcome</Text>
                        <Text style={[styles.welcome, { fontSize: 18, fontStyle: 'italic', marginTop: 1 }]}> ♡</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 5, alignItems: 'center' }}>

                        <Text style={styles.title}>
                            Let's find your
                        </Text>
                        <Text style={[styles.title, { color: COLORS.primary }]}>
                            perfect match 💙
                        </Text>
                    </View>
                    <VerticalTabs
                        tabList={tabList}
                        activeTab={pathname}
                        onTabChange={(item) => { router.replace(item as any) }}
                    />
                    <Slot />
                </BlurView>
                <View>
                    <Span style={styles.footer}>
                        🔒 Secure metropolitan transit-based matching
                    </Span>

                </View>
            </ScrollView>

        </View>
    )
}

export default MainAuthLayout

const styles = StyleSheet.create({
    container: { position: 'relative', flex: 1 },
    background: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },

    heroOverlay: {
        ...StyleSheet.absoluteFill,
        backgroundColor: 'rgba(58, 76, 139, 0.5)',
    },
    logo: {
        width: responsiveSize(280),
        height: responsiveSize(200),
        resizeMode: 'contain',
    },
    logoContainer: {
        alignItems: 'center',
    },
    tagLine: {
        color: 'white',
        fontSize: 16,
        marginTop: -100
    },
    card: {
        marginHorizontal: responsiveSize(20),
        borderRadius: responsiveSize(36),
        padding: responsiveSize(24),
        overflow: 'hidden',
        backgroundColor: 'rgba(255,255,255,0.96)',
    },
    welcome: {
        textAlign: 'center',
        fontSize: responsiveSize(34),
        color: COLORS.primary,
        fontFamily: 'ImperialScript_400Regular',

    },
    title: {
        textAlign: 'center',
        fontSize: responsiveSize(18),
        color: COLORS.textPrimary,
        marginBottom: responsiveSize(25),
        fontFamily: 'Poppins_500Medium',
    },
    footer: {
        textAlign: 'center',
        color: 'white',
        marginTop: 25,
        fontSize: responsiveSize(10)
        // marginBottom: 20,
    },
})
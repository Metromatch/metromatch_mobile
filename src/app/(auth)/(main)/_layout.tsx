import React, { useState } from 'react'
import { router, Slot, usePathname } from 'expo-router'
import { Image, ImageBackground, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native'
import { COLORS } from '@/constants/theme'
import { BlurView } from 'expo-blur'
import VerticalTabs from '@/components/general/molecules/vertical_tabs'
import { responsiveSize } from '@/utils/responsive'
import { Span } from '@/components/general/atoms/span'
import GlassmorphicCard from '@/components/general/molecules/glass_morphic_card'
import DoubleHeartIcon from '@/components/shared/atoms/double_heart'

const MainAuthLayout = () => {
    const tabList = [{
        id: '/login',
        label: 'Login'
    }, {
        id: '/signup',
        label: 'Sign Up'
    }]
    const pathname = usePathname()

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1, marginTop: responsiveSize(30), paddingHorizontal: responsiveSize(20), paddingBottom: responsiveSize(30) }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.logoContainer}>
                        <Image
                            source={require('@/assets/images/logo_with_title.png')}
                            style={styles.logo}
                            resizeMode="contain"
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
                    <GlassmorphicCard>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 5, alignItems: 'center' }}>
                            <Text style={styles.welcome}>Welcome</Text>
                            <Text style={[styles.welcome, { fontSize: 18, fontStyle: 'italic', marginTop: 1 }]}> ♡</Text>
                        </View>
                        <View style={{ marginBottom: responsiveSize(25), flexDirection: 'row', justifyContent: 'center', gap: 5, alignItems: 'center' }}>

                            <Text style={styles.title}>
                                Let's find your
                            </Text>
                            <Text style={[styles.title, { color: COLORS.primary }]}>
                                perfect match
                            </Text>
                            <DoubleHeartIcon />
                        </View>
                        <VerticalTabs
                            tabList={tabList}
                            activeTab={pathname}
                            onTabChange={(item) => { router.replace(item as any) }}
                        />
                        <View style={{ height: responsiveSize(12) }} />
                        <Slot />
                    </GlassmorphicCard>
                    <View>
                        <Span style={styles.footer}>
                            🔒 Secure metropolitan transit-based matching
                        </Span>

                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    )
}

export default MainAuthLayout

const styles = StyleSheet.create({
    container: { flex: 1 },
    logo: {
        width: responsiveSize(280),
        height: responsiveSize(200),
    },
    logoContainer: {
        alignItems: 'center',
    },
    tagLine: {
        color: 'white',
        fontSize: 16,
        marginTop: -100
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
        fontFamily: 'Poppins_600SemiBold',
    },
    footer: {
        textAlign: 'center',
        color: 'white',
        marginTop: 25,
        fontSize: responsiveSize(10)
        // marginBottom: 20,
    },
})
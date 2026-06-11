import React from 'react'
import {
    View,
    Text,
    StyleSheet,
    Image,
    ImageBackground,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Dimensions,
} from 'react-native'

import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { BlurView } from 'expo-blur'

import Ionicons from '@expo/vector-icons/Ionicons'

export const COLORS = {
    primary: '#2F6BFF',
    primaryDark: '#1E4ED8',
    primaryLight: '#6EA8FF',

    backgroundStart: '#071C6B',
    backgroundMiddle: '#1A42D9',
    backgroundEnd: '#5C7BFF',

    card: 'rgba(255,255,255,0.95)',

    textPrimary: '#1B1F3B',
    textSecondary: '#7782A0',

    border: '#DDE5FF',

    white: '#FFFFFF',
}

export default function AuthScreen() {
    return (
        <View style={{ height: Dimensions.get('window').height, width: Dimensions.get('window').width, position: 'relative' }}>


            {/* <LinearGradient
                colors={[
                    COLORS.backgroundStart,
                    COLORS.backgroundMiddle,
                    COLORS.backgroundEnd,
                ]}
                style={StyleSheet.absoluteFill}
            /> */}

            <ImageBackground
                source={require('@/assets/images/couple_bg.png')}
                resizeMode="cover"
                style={styles.background}>
                <View style={styles.heroOverlay} />
            </ImageBackground>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 40 }}>

                <View style={styles.logoContainer}>
                    <Image
                        source={require('@/assets/images/metromatch_logo.png')}
                        style={styles.logo}
                    />
                    <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 5, alignItems: 'center' }}>
                        <Text style={styles.tagLine}>
                            Your match.
                        </Text>
                        <Text style={[styles.tagLine, { color: COLORS.primary }]}>
                            Next to you.
                        </Text>
                    </View>
                </View>

                <BlurView intensity={70} tint="light" style={styles.card}>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 5, alignItems: 'center' }}>
                        <Text style={styles.welcome}>Welcome</Text>
                        <Text style={[styles.welcome, { fontSize: 18, fontStyle: 'italic', marginTop: 1 }]}> ♡</Text>

                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 5, alignItems: 'center' }}>

                        <Text style={styles.title}>
                            Let's find your
                        </Text>
                        <Text style={[styles.title, { color: COLORS.primary }]}>
                            perfect match
                        </Text>
                    </View>



                    <View style={styles.toggle}>
                        <TouchableOpacity style={styles.inactiveTab}>
                            <Text style={styles.inactiveText}>
                                Login
                            </Text>
                        </TouchableOpacity>

                        <LinearGradient
                            colors={['#5EA3FF', '#2F6BFF']}
                            style={styles.activeTab}>
                            <Text style={styles.activeText}>
                                Sign Up
                            </Text>
                        </LinearGradient>
                    </View>



                    <View style={styles.inputContainer}>
                        <Ionicons
                            name="mail-outline"
                            size={22}
                            color="#7E89AA"
                        />

                        <TextInput
                            placeholder="Email Address"
                            placeholderTextColor="#9AA4C0"
                            style={styles.input}
                        />
                    </View>



                    <View style={styles.inputContainer}>
                        <Ionicons
                            name="lock-closed-outline"
                            size={22}
                            color="#7E89AA"
                        />

                        <TextInput
                            placeholder="Password"
                            secureTextEntry
                            placeholderTextColor="#9AA4C0"
                            style={styles.input}
                        />

                        <Ionicons
                            name="eye-outline"
                            size={22}
                            color="#7E89AA"
                        />
                    </View>



                    <View style={styles.inputContainer}>
                        <Ionicons
                            name="lock-closed-outline"
                            size={22}
                            color="#7E89AA"
                        />

                        <TextInput
                            placeholder="Confirm Password"
                            secureTextEntry
                            placeholderTextColor="#9AA4C0"
                            style={styles.input}
                        />
                    </View>

                    <Text style={styles.terms}>
                        By signing up, you agree to our
                        <Text style={styles.link}>
                            {' '}Terms
                        </Text>
                        {' & '}
                        <Text style={styles.link}>
                            Privacy Policy
                        </Text>
                    </Text>



                    <TouchableOpacity activeOpacity={0.9}>
                        <LinearGradient
                            colors={['#6EA8FF', '#2F6BFF']}
                            style={styles.createBtn}>
                            <Ionicons
                                name="heart"
                                size={22}
                                color="white"
                            />

                            <Text style={styles.createText}>
                                Create My Account
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    {/* <View style={styles.dividerRow}>
                        <View style={styles.line} />
                        <Text style={styles.or}>OR</Text>
                        <View style={styles.line} />
                    </View> */}


                    {/* <View style={styles.socialRow}>
                        <TouchableOpacity style={styles.socialBtn}>
                            <Text style={{ fontSize: 30 }}>G</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.socialBtn}>
                            <Ionicons
                                name="logo-apple"
                                size={30}
                                color="black"
                            />
                        </TouchableOpacity>
                    </View> */}
                </BlurView>

                <Text style={styles.footer}>
                    🔒 Secure metropolitan transit-based matching
                </Text>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    background: {
        width: '100%',
        height: '100%',
        // flex: 1,
        position: 'absolute',
        // top: -100
        // top: 0,
        // bottom: 0,
        // left: 0,
        // right: 0
    },

    heroOverlay: {
        ...StyleSheet.absoluteFill,
        backgroundColor: 'rgba(58, 76, 139, 0.5)',
    },

    logoContainer: {
        alignItems: 'center',
        // marginTop: -180,
        marginBottom: 25,
    },

    logo: {
        width: 180,
        height: 100,
        resizeMode: 'contain',
    },

    tagLine: {
        color: 'white',
        fontSize: 16,
        marginTop: -20
    },

    card: {
        marginHorizontal: 20,
        borderRadius: 36,
        padding: 24,
        overflow: 'hidden',
        backgroundColor: 'rgba(255,255,255,0.96)',
    },

    welcome: {
        textAlign: 'center',
        fontSize: 34,
        color: COLORS.primary,
        // marginBottom: 10,

        fontFamily: 'ImperialScript_400Regular',

    },

    title: {
        textAlign: 'center',
        fontSize: 18,
        // fontWeight: '700',
        color: COLORS.textPrimary,
        marginBottom: 25,
        fontFamily: 'Poppins_600SemiBold',
    },

    toggle: {
        flexDirection: 'row',
        backgroundColor: '#EEF3FF',
        borderRadius: 18,
        padding: 5,
        marginBottom: 20,
    },

    inactiveTab: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    activeTab: {
        flex: 1,
        height: 52,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },

    inactiveText: {
        fontSize: 17,
        fontWeight: '600',
    },

    activeText: {
        color: 'white',
        fontSize: 17,
        fontWeight: '700',
    },

    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 62,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 18,
        paddingHorizontal: 18,
        marginBottom: 16,
        backgroundColor: 'white',
    },

    input: {
        flex: 1,
        marginLeft: 12,
        fontSize: 16,
    },

    terms: {
        textAlign: 'center',
        color: COLORS.textSecondary,
        lineHeight: 24,
        marginTop: 5,
        fontFamily: 'Poppins_400Regular',
        fontSize: 10
    },

    link: {
        color: COLORS.primary,
        fontWeight: '600',
    },

    createBtn: {
        marginTop: 24,
        height: 62,
        borderRadius: 18,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',

        shadowColor: '#2F6BFF',
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 10,
    },

    createText: {
        color: 'white',
        fontSize: 20,
        fontWeight: '700',
        marginLeft: 10,
    },

    dividerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 25,
    },

    line: {
        flex: 1,
        height: 1,
        backgroundColor: '#DCE4FF',
    },

    or: {
        marginHorizontal: 15,
        color: '#6B7280',
    },

    guestBtn: {
        height: 58,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },

    guestText: {
        marginLeft: 10,
        fontSize: 18,
        fontWeight: '600',
    },

    socialRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 18,
    },

    socialBtn: {
        flex: 1,
        height: 58,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: COLORS.border,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },

    footer: {
        textAlign: 'center',
        color: 'white',
        marginTop: 25,
        marginBottom: 20,
    },
})
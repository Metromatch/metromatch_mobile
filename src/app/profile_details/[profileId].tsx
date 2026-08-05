import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    Dimensions,
    Platform,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS, TYPOGRAPHY } from '@/constants/theme';
import { responsiveSize } from '@/utils/responsive';
import { H3, H4 } from '@/components/general/atoms/heading_text';
import { B2, B3 } from '@/components/general/atoms/body_text';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PHOTO_HEIGHT = SCREEN_WIDTH * 1.1;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getAge(dob: string): number {
    const birth = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
}

function fmtDistance(meters?: number): string {
    if (!meters) return '';
    if (meters < 1000) return `${meters}m`;
    return `${(meters / 1000).toFixed(1)} km`;
}

// ─── 2-col Info Cell ─────────────────────────────────────────────────────────

function InfoCell({ emoji, label, value }: { emoji: string; label: string; value: string }) {
    return (
        <View style={styles.infoCell}>
            <Text style={styles.infoCellEmoji}>{emoji}</Text>
            <View>
                <Text style={styles.infoCellLabel}>{label}</Text>
                <Text style={styles.infoCellValue}>{value}</Text>
            </View>
        </View>
    );
}

const InfoBox = ({ label, value, icon }: { label: string; value: string; icon: any }) => {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: responsiveSize(8), marginTop: responsiveSize(8), flex: 1 }}>
            <View style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', justifyContent: 'center', alignItems: 'center', width: responsiveSize(40), height: responsiveSize(40), borderRadius: responsiveSize(8) }}>
                <Ionicons name={icon} size={responsiveSize(20)} color="white" />
            </View>
            <View>
                <B3 type="medium" text={label} textColor='rgba(253, 250, 250, 0.82)' />
                <B2 type="regular" text={value || 'Not Specified'} textColor="white" />
            </View>
        </View>
    )
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function ProfileDetailScreen() {
    const params = useLocalSearchParams<{
        profileId: string;
        name: string;
        dob: string;
        gender?: string;
        profession?: string;
        religion?: string;
        height?: string;
        diet?: string;
        drinkingHabits?: string;
        smokingHabits?: string;
        travelFrequency?: string;
        relationshipPreference?: string;
        interestedIn?: string;
        travelTimeSlots?: string;
        distanceMeters?: string;
        imageUrl?: string[];
        primaryImage?: string;
        bio: string
    }>();

    const age = params.dob ? getAge(params.dob) : null;
    const travelTimeSlots: string[] = params.travelTimeSlots
        ? JSON.parse(params.travelTimeSlots)
        : [];
    // console.log('params', params?.imageUrl?.split?.(','))
    // Build 2-column grid pairs
    const infoCells: { emoji: string; label: string; value: string }[] = [
        params.profession ? { emoji: '💼', label: 'Profession', value: params.profession } : null,
        params.religion ? { emoji: '🙏', label: 'Religion', value: params.religion } : null,
        params.diet ? { emoji: '🍽️', label: 'Food', value: params.diet } : null,
        params.smokingHabits ? { emoji: '🚬', label: 'Smoking', value: params.smokingHabits } : null,
        params.drinkingHabits ? { emoji: '🥂', label: 'Drinking', value: params.drinkingHabits } : null,
        travelTimeSlots[0] ? { emoji: '🚇', label: 'Metro', value: travelTimeSlots[0] } : null,
        params.travelFrequency ? { emoji: '✈️', label: 'Travel', value: params.travelFrequency } : null,
        params.interestedIn ? { emoji: '❤️', label: 'Interested In', value: params.interestedIn } : null,
    ].filter(Boolean) as { emoji: string; label: string; value: string }[];

    // Group into rows of 2
    const infoRows: (typeof infoCells)[] = [];
    for (let i = 0; i < infoCells.length; i += 2) {
        infoRows.push(infoCells.slice(i, i + 2));
    }
    const imageUrls = params?.imageUrl?.split?.(',') || []
    return (

        <ScrollView
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scroll}
        >

            <View style={styles.heroWrap}>
                {params.imageUrl ? (
                    <Image
                        source={{ uri: params.primaryImage }}
                        style={styles.heroPhoto}
                        resizeMode="cover"
                    />
                ) : (
                    <LinearGradient colors={['#1A42D9', '#5C7BFF']} style={styles.heroPhoto}>
                        <Ionicons name="person" size={90} color="rgba(255,255,255,0.25)" />
                    </LinearGradient>
                )}

                {/* Deep gradient fade at bottom of photo */}
                <LinearGradient
                    colors={['transparent', 'rgba(7,22,80,0.6)', COLORS.backgroundStart]}
                    style={styles.heroFade}
                />

                {/* Floating close button */}
                <SafeAreaView edges={['top']} style={styles.heroTopBar}>
                    <TouchableOpacity style={styles.floatBtn} onPress={() => router.back()} hitSlop={10}>
                        <Ionicons name="close" size={20} color="white" />
                    </TouchableOpacity>
                    {params.distanceMeters ? (
                        <View style={styles.distancePill}>
                            <Ionicons name="location-outline" size={12} color={COLORS.primaryLight} />
                            <Text style={styles.distancePillText}>
                                {fmtDistance(Number(params.distanceMeters))} away
                            </Text>
                        </View>
                    ) : <View />}
                </SafeAreaView>

                {/* Name / age / verified overlaid at photo bottom */}
                <View style={styles.heroNameRow}>
                    <H3 type="bold" text={params.name} textColor='white' />
                    <H4 type="semibold" text={`, ${age}`} textColor='white' />
                    <View style={styles.verifiedBadge}>
                        <Ionicons name="checkmark" size={11} color="white" />
                    </View>
                </View>
            </View>

            <View style={styles.bioContainer}>
                <B2 type="semibold" text="ABOUT ME" textColor='rgba(255,255,255,0.4)' />
                <B2 type="regular" text={params.bio} textColor='white' />
            </View>

            {/* ───────────────── PILL BADGES ───────────────── */}
            <View style={styles.pillRow}>
                {params.height ? (
                    <View style={styles.pill}>
                        <Ionicons name="body-outline" size={13} color={COLORS.primaryLight} />
                        <Text style={styles.pillText}>{params.height}</Text>
                    </View>
                ) : null}
                {params.relationshipPreference ? (
                    <View style={styles.pill}>
                        <Ionicons name="heart-outline" size={13} color={COLORS.primaryLight} />
                        <Text style={styles.pillText}>{params.relationshipPreference}</Text>
                    </View>
                ) : null}
                {params.gender ? (
                    <View style={styles.pill}>
                        <Ionicons name="person-outline" size={13} color={COLORS.primaryLight} />
                        <Text style={styles.pillText}>{params.gender}</Text>
                    </View>
                ) : null}
            </View>

            <View style={[styles.bioContainer, { gap: responsiveSize(4) }]}>
                <View style={{ flexDirection: 'row', gap: responsiveSize(16) }}>
                    <InfoBox label='Profession' value={params.profession || ''} icon='briefcase' />
                    <InfoBox label='Diet' value={params.diet || ''} icon='diet' />
                </View>
                <View style={{ flexDirection: 'row', gap: responsiveSize(16) }}>
                    <InfoBox label='Smoking' value={params.smokingHabits || ''} icon='smoking' />
                    <InfoBox label='Drinking' value={params.drinkingHabits || ''} icon='drinking' />
                </View>
                <View style={{ flexDirection: 'row', gap: responsiveSize(16) }}>
                    <InfoBox label='Metro' value={params.travelTimeSlots ? JSON.parse(params.travelTimeSlots)[0] : '-'} icon='metro' />
                    <InfoBox label='Commute' value={params.travelTimeSlots ? JSON.parse(params.travelTimeSlots)[1] : '-'} icon='commute' />
                </View>

            </View>
            {imageUrls?.map((image) => (
                <Image
                    source={{ uri: image }}
                    style={styles.heroPhoto}
                    resizeMode="cover"
                />
            ))}

        </ScrollView>

    );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    scroll: {
        paddingBottom: 40,
    },

    // ── Hero photo ──────────────────────────────────────────────────
    heroWrap: {
        width: SCREEN_WIDTH,
        height: PHOTO_HEIGHT,
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
    },
    heroPhoto: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    heroFade: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '55%',
    },
    heroTopBar: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: Platform.OS === 'android' ? 12 : 0,
    },
    floatBtn: {
        marginTop: responsiveSize(20),
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: 'rgba(251, 251, 251, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    distancePill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: 'rgba(0,0,0,0.45)',
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    distancePillText: {
        color: COLORS.primaryLight,
        fontFamily: TYPOGRAPHY.medium,
        fontSize: 12,
    },
    heroNameRow: {
        position: 'absolute',
        bottom: 22,
        left: 20,
        right: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    heroName: {
        color: 'white',
        fontFamily: TYPOGRAPHY.bold,
        fontSize: 28,
    },
    heroAge: {
        color: 'rgba(255,255,255,0.85)',
        fontFamily: TYPOGRAPHY.regular,
        fontSize: 26,
    },
    verifiedBadge: {
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bioContainer: {
        paddingHorizontal: responsiveSize(20),
        paddingVertical: responsiveSize(10)
        // marginTop: responsiveSize(10),
    },
    // ── Pill badges ──────────────────────────────────────────────────
    pillRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        paddingHorizontal: 20,
        paddingVertical: 14,
    },
    pill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.18)',
    },
    pillText: {
        color: 'white',
        fontFamily: TYPOGRAPHY.medium,
        fontSize: 13,
    },

    // ── Card ─────────────────────────────────────────────────────────
    card: {
        marginHorizontal: 16,
        backgroundColor: 'rgba(255,255,255,0.07)',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.12)',
        paddingHorizontal: 18,
        paddingVertical: 20,
        gap: 4,
    },

    // ── Section label ────────────────────────────────────────────────
    sectionLabel: {
        color: 'rgba(255,255,255,0.4)',
        fontFamily: TYPOGRAPHY.semibold,
        fontSize: 11,
        letterSpacing: 1.5,
        textTransform: 'uppercase',
        marginBottom: 12,
        marginTop: 8,
    },

    // ── Metro route ──────────────────────────────────────────────────
    metroRouteRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: 'rgba(47,107,255,0.15)',
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 11,
        marginBottom: 4,
        borderWidth: 1,
        borderColor: 'rgba(110,168,255,0.2)',
    },
    metroRouteText: {
        color: COLORS.primaryLight,
        fontFamily: TYPOGRAPHY.medium,
        fontSize: 13,
        flex: 1,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.08)',
        marginVertical: 16,
    },

    // ── 2-col info grid ──────────────────────────────────────────────
    infoGrid: {
        gap: 10,
    },
    infoGridRow: {
        flexDirection: 'row',
        gap: 10,
    },
    infoCell: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: 'rgba(255,255,255,0.06)',
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 11,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.09)',
    },
    infoCellEmoji: {
        fontSize: 18,
    },
    infoCellLabel: {
        color: 'rgba(255,255,255,0.4)',
        fontFamily: TYPOGRAPHY.regular,
        fontSize: 10,
        marginBottom: 1,
    },
    infoCellValue: {
        color: 'white',
        fontFamily: TYPOGRAPHY.medium,
        fontSize: 13,
    },

    // ── Bottom action bar ────────────────────────────────────────────
    actionBar: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 32,
        paddingBottom: Platform.OS === 'ios' ? 34 : 20,
        paddingTop: 16,
    },
    actionBtnPass: {
        width: 62,
        height: 62,
        borderRadius: 31,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#FF4458',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 6,
    },
    actionBtnLike: {
        width: 72,
        height: 72,
        borderRadius: 36,
        overflow: 'hidden',
        shadowColor: '#E91E8C',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
        elevation: 8,
    },
    actionBtnLikeGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS, TYPOGRAPHY } from '@/constants/theme';
import { responsiveSize } from '@/utils/responsive';
import ProfilePicture from '@/components/shared/molecules/profile_picture';
import GlassmorphicCard from '@/components/general/molecules/glass_morphic_card';
import { H2 } from '@/components/general/atoms/heading_text';
import { B2 } from '@/components/general/atoms/body_text';
import dayjs from 'dayjs';
import Toast from 'react-native-toast-message';

// ─── Helpers ─────────────────────────────────────────────────────────────────
function getAge(dob: string | null | undefined): string {
    if (!dob) return '';
    const age = dayjs().diff(dayjs(dob), 'year');
    return `${age} yrs`;
}

function capitalize(str: string | null | undefined): string {
    if (!str) return '—';
    return str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, ' ');
}

// ─── Types ────────────────────────────────────────────────────────────────────
export interface ProfileHeroProps {
    /** Animated scroll-driven scale for the avatar (optional) */
    avatarScale?: Animated.AnimatedInterpolation<number>;
    /** Profile data */
    name?: string;
    dob?: string | null;
    profession?: string | null;
    gender?: string | null;
    profilePicture?: string;
    /** Stats */
    photoCount?: number;
    completionScore?: number;
    /** Edit mode state */
    isEditing?: boolean;
    isSaving?: boolean;
    /** Callbacks */
    onEditPress?: () => void;
    onSavePress?: () => void;
    onCancelPress?: () => void;
    onLogoutPress?: () => void;
    onAvatarPress?: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function ProfileHero({
    avatarScale,
    name,
    dob,
    profession,
    gender,
    profilePicture,
    photoCount = 0,
    completionScore = 0,
    isEditing = false,
    isSaving = false,
    onEditPress,
    onSavePress,
    onCancelPress,
    onLogoutPress,
    onAvatarPress,
}: ProfileHeroProps) {
    const avatarTransform = avatarScale ? [{ scale: avatarScale }] : [];

    return (
        <View style={styles.hero}>
            {/* ─── Avatar ─────────────────────────────────────────────── */}
            <Animated.View style={[styles.avatarContainer, { transform: avatarTransform }]}>
                <ProfilePicture imageUri={profilePicture ?? ''} />

                {/* Online badge */}
                <View style={styles.onlineBadge}>
                    <View style={styles.onlineDot} />
                </View>

                {/* Camera edit button (only in edit mode) */}
                {isEditing && (
                    <TouchableOpacity
                        style={styles.avatarEditBtn}
                        activeOpacity={0.8}
                        onPress={onAvatarPress ?? (() => Toast.show({ type: 'info', text1: 'Photo picker coming soon!' }))}
                    >
                        <LinearGradient colors={['#6EA8FF', '#2F6BFF']} style={styles.avatarEditGradient}>
                            <Ionicons name="camera" size={16} color="white" />
                        </LinearGradient>
                    </TouchableOpacity>
                )}
            </Animated.View>

            {/* ─── Name & Profession ──────────────────────────────────── */}
            <H2 textColor="white" text={name ? `${name}${dob ? `, ${getAge(dob)}` : ''}` : 'Your Profile'} />
            {profession && <B2 textColor="white" text={capitalize(profession)} />}

            {/* ─── Stats Row ──────────────────────────────────────────── */}
            <GlassmorphicCard intensity={30} style={styles.statsRow}>
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>{photoCount}</Text>
                    <Text style={styles.statLabel}>Photos</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>{completionScore}%</Text>
                    <Text style={styles.statLabel}>Complete</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>
                        {gender ? capitalize(gender).charAt(0) : '—'}
                    </Text>
                    <Text style={styles.statLabel}>Gender</Text>
                </View>
            </GlassmorphicCard>

            {/* ─── Action Buttons ─────────────────────────────────────── */}
            <View style={styles.heroActions}>
                {isEditing ? (
                    <>
                        {/* Cancel */}
                        <TouchableOpacity
                            style={styles.cancelBtn}
                            onPress={onCancelPress}
                            activeOpacity={0.8}
                        >
                            <Ionicons name="close" size={16} color="rgba(255,255,255,0.7)" />
                            <Text style={styles.cancelBtnText}>Cancel</Text>
                        </TouchableOpacity>

                        {/* Save */}
                        <TouchableOpacity
                            style={styles.saveBtn}
                            onPress={onSavePress}
                            activeOpacity={0.8}
                            disabled={isSaving}
                        >
                            <LinearGradient colors={['#6EA8FF', '#2F6BFF']} style={styles.saveBtnGradient}>
                                {isSaving ? (
                                    <ActivityIndicator size="small" color="white" />
                                ) : (
                                    <>
                                        <Ionicons name="checkmark" size={16} color="white" />
                                        <Text style={styles.saveBtnText}>Save Changes</Text>
                                    </>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>
                    </>
                ) : (
                    <>
                        {/* Edit */}
                        <TouchableOpacity
                            style={styles.editBtn}
                            onPress={onEditPress}
                            activeOpacity={0.8}
                        >
                            <LinearGradient colors={['#6EA8FF', '#2F6BFF']} style={styles.editBtnGradient}>
                                <Ionicons name="pencil" size={16} color="white" />
                                <Text style={styles.editBtnText}>Edit Profile</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        {/* Logout */}
                        <TouchableOpacity
                            style={styles.logoutBtn}
                            onPress={onLogoutPress}
                            activeOpacity={0.8}
                        >
                            <BlurView intensity={20} tint="dark" style={styles.logoutBtnInner}>
                                <Ionicons name="log-out-outline" size={18} color="rgba(255,255,255,0.7)" />
                            </BlurView>
                        </TouchableOpacity>
                    </>
                )}
            </View>
        </View>
    );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    hero: {
        alignItems: 'center',
        gap: responsiveSize(10),
    },

    // Avatar
    avatarContainer: {
        position: 'relative',
    },
    onlineBadge: {
        position: 'absolute',
        bottom: 4,
        right: 4,
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: '#22C55E',
        borderWidth: 2.5,
        borderColor: 'rgba(7,28,107,0.8)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    onlineDot: {
        width: 7,
        height: 7,
        borderRadius: 4,
        backgroundColor: 'white',
    },
    avatarEditBtn: {
        position: 'absolute',
        bottom: -2,
        right: -2,
    },
    avatarEditGradient: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'rgba(7,28,107,0.8)',
    },

    // Stats row
    statsRow: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 16,
        paddingVertical: 12,
        paddingHorizontal: 24,
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
        fontSize: 18,
        color: 'white',
    },
    statLabel: {
        fontFamily: TYPOGRAPHY.regular,
        fontSize: 11,
        color: 'rgba(255,255,255,0.55)',
        marginTop: 2,
    },
    statDivider: {
        width: 1,
        height: 28,
        backgroundColor: 'rgba(255,255,255,0.2)',
        marginVertical: responsiveSize(10),
    },

    // Action buttons
    heroActions: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
    },
    editBtn: {
        borderRadius: 14,
        overflow: 'hidden',
    },
    editBtnGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 24,
        paddingVertical: 11,
    },
    editBtnText: {
        fontFamily: TYPOGRAPHY.semibold,
        fontSize: 14,
        color: 'white',
    },
    logoutBtn: {
        borderRadius: 14,
        overflow: 'hidden',
    },
    logoutBtnInner: {
        width: 42,
        height: 42,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
        borderRadius: 14,
    },
    saveBtn: {
        borderRadius: 14,
        overflow: 'hidden',
        flex: 1,
    },
    saveBtnGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 11,
    },
    saveBtnText: {
        fontFamily: TYPOGRAPHY.semibold,
        fontSize: 14,
        color: 'white',
    },
    cancelBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 18,
        paddingVertical: 11,
        borderRadius: 14,
        backgroundColor: 'rgba(255,255,255,0.12)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    cancelBtnText: {
        fontFamily: TYPOGRAPHY.medium,
        fontSize: 14,
        color: 'rgba(255,255,255,0.7)',
    },
});

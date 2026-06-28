import React from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import { TYPOGRAPHY } from '@/constants/theme';
import { responsiveSize } from '@/utils/responsive';
import ProfilePicture from '@/components/shared/molecules/profile_picture';
import { H2 } from '@/components/general/atoms/heading_text';
import { B2 } from '@/components/general/atoms/body_text';
import dayjs from 'dayjs';
import Toast from 'react-native-toast-message';
import StatusRow from '@/components/shared/molecules/profile/status_row';

function getAge(dob: string | null | undefined): string {
    if (!dob) return '';
    const age = dayjs().diff(dayjs(dob), 'year');
    return `${age} yrs`;
}

function capitalize(str: string | null | undefined): string {
    if (!str) return '—';
    return str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, ' ');
}

export interface ProfileHeroProps {
    avatarScale?: Animated.AnimatedInterpolation<number>;
    name?: string;
    dob?: string | null;
    profession?: string | null;
    gender?: string | null;
    profilePicture?: string;
    photoCount?: number;
    completionScore?: number;
    isEditing?: boolean;
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

            <StatusRow
                photoCount={photoCount}
                completionScore={completionScore}
                gender={gender ? capitalize(gender).charAt(0) : '-'}
            />
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

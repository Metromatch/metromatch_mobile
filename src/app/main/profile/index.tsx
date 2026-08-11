import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Dimensions,
    Alert,
    Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS, TYPOGRAPHY } from '@/constants/theme';
import useProfileService from '@/hooks/services/useProfileService';
import useAuthService from '@/hooks/services/useAuthService';
import { responsiveSize } from '@/utils/responsive';
import ProfileHero from '@/components/shared/organisms/profile/hero';
import ProfileCompletionCard from '@/components/shared/organisms/profile/completion_card';
import VerticalTabs from '@/components/general/molecules/vertical_tabs';
import About from '@/components/shared/organisms/profile/about';
import Preference from '@/components/shared/organisms/profile/preference';
import EditAbout from '@/components/shared/templates/my_profile/edit_about';
import EditPreferences from '@/components/shared/templates/my_profile/edit_preferences';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── Completion Progress ──────────────────────────────────────────────────────
function getCompletionScore(profile: any): { score: number; items: { label: string; done: boolean }[] } {
    const items = [
        { label: 'Basic Info', done: true },
        { label: 'About Me', done: true },
        { label: 'Lifestyle', done: !!profile.height && !!profile.religion && !!profile.diet && !!profile.drinkingHabits && !!profile.smokingHabits },
        { label: 'Looking For', done: true },
        { label: 'Preferences', done: !!profile.prefDiet && !!profile.prefMaxHeight && !!profile.prefMinHeight && !!profile.prefReligion },
        { label: 'Photos', done: true },
    ];
    const done = items.filter((i) => i.done).length;
    return { score: Math.round((done / items.length) * 100), items };
}

// ─── Section Header ───────────────────────────────────────────────────────────
function SectionHeader({ icon, title }: { icon: keyof typeof Ionicons.glyphMap; title: string }) {
    return (
        <View style={styles.sectionHeader}>
            <View style={styles.sectionIconWrap}>
                <Ionicons name={icon} size={15} color={COLORS.primary} />
            </View>
            <Text style={styles.sectionTitle}>{title}</Text>
        </View>
    );
}

// ─── Photo Card ──────────────────────────────────────────────────────────────
function PhotoCard({ uri }: {
    uri: string;
}) {
    return (
        <View style={styles.photoCard}>
            {uri ? <Image
                source={{ uri }}
                style={styles.photoCard}
            /> : <LinearGradient
                colors={['#1A42D9', '#5C7BFF']}
                style={styles.photoGradient}
            >
                <Ionicons name="image-outline" size={28} color="rgba(255,255,255,0.5)" />
            </LinearGradient>}
            {/* {isEditing && (
                <TouchableOpacity style={styles.photoRemoveBtn} onPress={onRemove} activeOpacity={0.8}>
                    <View style={styles.photoRemoveBg}>
                        <Ionicons name="close" size={12} color="white" />
                    </View>
                </TouchableOpacity>
            )} */}
        </View>
    );
}


const tabList: any = [
    { id: "about", label: "About", activeIcon: "person", inactiveIcon: "person-outline" },
    { id: "preferences", label: "Preferences", activeIcon: "heart", inactiveIcon: "heart-outline" },
    { id: "photos", label: "Photos", activeIcon: "image", inactiveIcon: "image-outline" },
];


// ─── Main Profile Screen ──────────────────────────────────────────────────────
export default function ProfileScreen() {
    const { myProfile } = useProfileService({ fetchMyProfile: true });
    const { logout, isLogoutLoading } = useAuthService();

    const [editType, setEditType] = useState<null | string>(null);
    const [activeSection, setActiveSection] = useState<'about' | 'preferences' | 'photos'>('about');
    const scrollY = useRef(new Animated.Value(0)).current;

    const profile = myProfile?.profile;
    const preferences = myProfile?.preferences;
    const photos: string[] = myProfile?.photos || [];

    const { score, items: completionItems } = getCompletionScore({
        ...preferences, ...profile, prefSmokingHabits: preferences?.smokingHabits, prefDrinkingHabits: preferences?.drinkingHabits
    });

    const avatarScale = scrollY.interpolate({
        inputRange: [0, 100],
        outputRange: [1, 0.75],
        extrapolate: 'clamp',
    });

    const handleLogout = () => {
        // logout()
        Alert.alert(
            'Sign Out',
            'Are you sure you want to sign out?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Sign Out',
                    style: 'destructive',
                    onPress: () => logout(),
                },
            ]
        );
    };

    // ─── Photos Section ───────────────────────────────────────────────────────
    const renderPhotos = () => (
        <View style={styles.section}>
            <View style={styles.card}>
                <SectionHeader icon="images-outline" title="My Photos" />
                {photos.length === 0 && (
                    <View style={styles.noPhotosContainer}>
                        <Ionicons name="camera-outline" size={40} color={COLORS.textSecondary} />
                        <Text style={styles.noPhotosText}>No photos yet</Text>
                        <Text style={styles.noPhotosHint}>Tap Edit to add photos and attract more matches</Text>
                    </View>
                )}
                <View style={styles.photosGrid}>
                    {photos.map((photo, i) => (
                        <PhotoCard
                            key={i}
                            uri={photo.imageUrl}
                        />
                    ))}

                </View>
            </View>

            {/* Photo Tips */}
            <View style={[styles.card, styles.tipsCard]}>
                <SectionHeader icon="bulb-outline" title="Photo Tips" />
                {[
                    { icon: '😊', tip: 'Use a clear, smiling face photo as your main picture' },
                    { icon: '☀️', tip: 'Good lighting makes a big difference' },
                    { icon: '🎯', tip: 'Show your hobbies and personality' },
                    { icon: '🚫', tip: 'Avoid group photos as your main picture' },
                ].map((t, i) => (
                    <View key={i} style={styles.tipRow}>
                        <Text style={styles.tipEmoji}>{t.icon}</Text>
                        <Text style={styles.tipText}>{t.tip}</Text>
                    </View>
                ))}
            </View>
        </View>
    );

    return (

        <Animated.ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                { useNativeDriver: false }
            )}
            scrollEventThrottle={16}
            contentContainerStyle={{ gap: responsiveSize(16), paddingBottom: responsiveSize(90) }}
        >

            <ProfileHero
                avatarScale={avatarScale}
                name={profile?.name}
                dob={profile?.dob}
                profession={profile?.profession}
                gender={profile?.gender}
                profilePicture={myProfile?.photos?.[0]?.imageUrl}
                photoCount={photos.length}
                completionScore={score}
            // isEditing={isEditing}
            />

            <ProfileCompletionCard score={score} items={completionItems} />
            <View style={{ height: responsiveSize(6) }} />
            <VerticalTabs
                tabList={tabList}
                activeTab={activeSection}
                onTabChange={(item) => setActiveSection(item as any)}
            />

            {activeSection === 'about' && <About profile={profile} onEdit={() => setEditType('about')} />}
            {activeSection === 'preferences' && <Preference profile={profile} preference={preferences} onEdit={() => setEditType('preferences')} />}
            {activeSection === 'photos' && renderPhotos()}


            <TouchableOpacity
                id="logout-button"
                style={[styles.logoutBtn, isLogoutLoading && { opacity: 0.6 }]}
                onPress={handleLogout}
                disabled={isLogoutLoading}
                activeOpacity={0.8}
            >
                <View style={styles.logoutBtnInner}>
                    <Ionicons name="log-out-outline" size={18} color="white" />
                    <Text style={styles.logoutBtnText}>
                        {isLogoutLoading ? 'Signing out…' : 'Sign Out'}
                    </Text>
                </View>
            </TouchableOpacity>
            {editType === 'about' && <EditAbout onClose={() => setEditType(null)} />}
            {editType === 'preferences' && <EditPreferences onClose={() => setEditType(null)} />}

        </Animated.ScrollView>

    );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: 'transparent',
    },

    logoutBtn: {
        backgroundColor: 'rgba(220,53,69,0.15)',
        borderWidth: 1,
        borderColor: 'rgba(220,53,69,0.5)',
        padding: responsiveSize(14),
        borderRadius: responsiveSize(14),
        marginBottom: responsiveSize(8),
    },
    logoutBtnInner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    logoutBtnText: {
        color: '#FF6B6B',
        fontFamily: TYPOGRAPHY.semibold,
        fontSize: 15,
    },

    subscriptionBtn: {
        borderRadius: responsiveSize(14),
        overflow: 'hidden',
        marginBottom: responsiveSize(10),
        shadowColor: '#C8952A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 10,
        elevation: 6,
    },
    subscriptionBtnInner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        paddingVertical: responsiveSize(14),
        paddingHorizontal: 20,
    },
    subscriptionBtnText: {
        color: 'white',
        fontFamily: TYPOGRAPHY.bold,
        fontSize: 15,
        flex: 1,
        textAlign: 'center',
    },

    // Floating header

    scrollView: {
        flex: 1,
        paddingHorizontal: responsiveSize(20),
        // marginTop: responsiveSize(16),
        paddingBottom: responsiveSize(50)
    },


    // Sections
    section: {
        // paddingHorizontal: 16,
        gap: 12,
    },
    card: {
        backgroundColor: 'rgba(255,255,255,0.07)',
        borderRadius: 18,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.12)',
    },
    tipsCard: {
        backgroundColor: 'rgba(47,107,255,0.1)',
        borderColor: 'rgba(47,107,255,0.25)',
    },

    // Section header
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 14,
    },
    sectionIconWrap: {
        width: 26,
        height: 26,
        borderRadius: 8,
        backgroundColor: 'rgba(47,107,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    sectionTitle: {
        fontFamily: TYPOGRAPHY.semibold,
        fontSize: 14,
        color: 'white',
    },

    // Info rows

    // Photos
    photosGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    photoCard: {
        width: (SCREEN_WIDTH - 32 - 36) / 3,
        height: (SCREEN_WIDTH - 32 - 36) / 3,
        borderRadius: 14,
        overflow: 'hidden',
        position: 'relative',
    },
    photoGradient: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    photoRemoveBtn: {
        position: 'absolute',
        top: 5,
        right: 5,
    },
    photoRemoveBg: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: 'rgba(255,0,0,0.7)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    addPhotoCard: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(47,107,255,0.15)',
        borderWidth: 1.5,
        borderColor: 'rgba(110,168,255,0.4)',
        borderStyle: 'dashed',
        borderRadius: 14,
        gap: 4,
    },
    addPhotoText: {
        fontFamily: TYPOGRAPHY.medium,
        fontSize: 11,
        color: COLORS.primary,
    },
    noPhotosContainer: {
        alignItems: 'center',
        paddingVertical: 24,
        gap: 8,
    },
    noPhotosText: {
        fontFamily: TYPOGRAPHY.semibold,
        fontSize: 15,
        color: 'rgba(255,255,255,0.5)',
    },
    noPhotosHint: {
        fontFamily: TYPOGRAPHY.regular,
        fontSize: 12,
        color: 'rgba(255,255,255,0.35)',
        textAlign: 'center',
    },
    photosHint: {
        fontFamily: TYPOGRAPHY.regular,
        fontSize: 11,
        color: 'rgba(255,255,255,0.35)',
        marginTop: 12,
        lineHeight: 16,
    },

    // Tips
    tipRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
        marginBottom: 10,
    },
    tipEmoji: {
        fontSize: 16,
        lineHeight: 20,
    },
    tipText: {
        fontFamily: TYPOGRAPHY.regular,
        fontSize: 13,
        color: 'rgba(255,255,255,0.65)',
        flex: 1,
        lineHeight: 18,
    },
});

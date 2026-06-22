import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Dimensions,
    Platform,
    ActivityIndicator,
    TextInput,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS, TYPOGRAPHY } from '@/constants/theme';
import useProfileService from '@/hooks/services/useProfileService';
import dayjs from 'dayjs';
import Toast from 'react-native-toast-message';
import { clearStore } from '@/utils/authUtils';
import { useRouter } from 'expo-router';
import AppContainer from '@/components/shared/layout/app_container';
import { responsiveSize } from '@/utils/responsive';
import ProfileHero from '@/components/shared/organisms/profile/hero';
import ProfileCompletionCard from '@/components/shared/organisms/profile/completion_card';
import { BlurView } from 'expo-blur';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── Helpers ─────────────────────────────────────────────────────────────────
function getAge(dob: string | null): string {
    if (!dob) return '';
    const age = dayjs().diff(dayjs(dob), 'year');
    return `${age} yrs`;
}

function formatDob(dob: string | null): string {
    if (!dob) return '—';
    return dayjs(dob).format('DD MMM YYYY');
}

function capitalize(str: string | null | undefined): string {
    if (!str) return '—';
    return str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, ' ');
}

// ─── Completion Progress ──────────────────────────────────────────────────────
function getCompletionScore(profile: any): { score: number; items: { label: string; done: boolean }[] } {
    const items = [
        { label: 'Name', done: !!profile?.name },
        { label: 'Date of Birth', done: !!profile?.dob },
        { label: 'Gender', done: !!profile?.gender },
        { label: 'Bio', done: !!profile?.bio },
        { label: 'Profession', done: !!profile?.profession },
        { label: 'Height', done: !!profile?.height },
        { label: 'Religion', done: !!profile?.religion },
        { label: 'Diet', done: !!profile?.diet },
        { label: 'Photos', done: !!profile?.photos?.length },
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

// ─── Info Row ─────────────────────────────────────────────────────────────────
function InfoRow({ label, value, onEdit, editing, editValue, onChangeText, multiline = false }: {
    label: string;
    value: string;
    onEdit?: () => void;
    editing?: boolean;
    editValue?: string;
    onChangeText?: (t: string) => void;
    multiline?: boolean;
}) {
    return (
        <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{label}</Text>
            {editing ? (
                <TextInput
                    style={[styles.infoInput, multiline && styles.infoInputMulti]}
                    value={editValue}
                    onChangeText={onChangeText}
                    multiline={multiline}
                    numberOfLines={multiline ? 3 : 1}
                    placeholderTextColor={COLORS.textSecondary}
                    placeholder={`Enter ${label.toLowerCase()}`}
                />
            ) : (
                <Text style={styles.infoValue}>{value || '—'}</Text>
            )}
        </View>
    );
}

// ─── Chip Selector ────────────────────────────────────────────────────────────
function ChipSelector({ options, selected, onSelect }: {
    options: string[];
    selected: string;
    onSelect: (val: string) => void;
}) {
    return (
        <View style={styles.chipRow}>
            {options.map((opt) => (
                <TouchableOpacity
                    key={opt}
                    onPress={() => onSelect(opt)}
                    activeOpacity={0.8}
                    style={[styles.chip, selected === opt && styles.chipActive]}
                >
                    {selected === opt && (
                        <LinearGradient
                            colors={['#6EA8FF', '#2F6BFF']}
                            style={StyleSheet.absoluteFill}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        />
                    )}
                    <Text style={[styles.chipText, selected === opt && styles.chipTextActive]}>
                        {capitalize(opt)}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
}

// ─── Photo Card ──────────────────────────────────────────────────────────────
function PhotoCard({ uri, onRemove, isEditing }: {
    uri: string;
    onRemove?: () => void;
    isEditing: boolean;
}) {
    return (
        <View style={styles.photoCard}>
            <LinearGradient
                colors={['#1A42D9', '#5C7BFF']}
                style={styles.photoGradient}
            >
                <Ionicons name="image-outline" size={28} color="rgba(255,255,255,0.5)" />
            </LinearGradient>
            {isEditing && (
                <TouchableOpacity style={styles.photoRemoveBtn} onPress={onRemove} activeOpacity={0.8}>
                    <View style={styles.photoRemoveBg}>
                        <Ionicons name="close" size={12} color="white" />
                    </View>
                </TouchableOpacity>
            )}
        </View>
    );
}

function AddPhotoCard({ onPress }: { onPress: () => void }) {
    return (
        <TouchableOpacity style={styles.photoCard} onPress={onPress} activeOpacity={0.8}>
            <View style={styles.addPhotoCard}>
                <Ionicons name="add" size={28} color={COLORS.primary} />
                <Text style={styles.addPhotoText}>Add</Text>
            </View>
        </TouchableOpacity>
    );
}


// ─── Main Profile Screen ──────────────────────────────────────────────────────
export default function ProfileScreen() {
    const { myProfile, isMyProfileLoading, refetchMyProfile, updateProfile, isUpdateProfileLoading } =
        useProfileService({ fetchMyProfile: true });
    const router = useRouter();

    // const { clearAuthDetails } = useAuthStore();
    const onPressSignout = () => {
        clearStore();
        router.replace('/login');
    }

    const [isEditing, setIsEditing] = useState(false);
    const [editValues, setEditValues] = useState<Record<string, string>>({});
    const [activeSection, setActiveSection] = useState<'about' | 'preferences' | 'photos'>('about');
    const scrollY = useRef(new Animated.Value(0)).current;

    const profile = myProfile?.profile;
    const preferences = myProfile?.preferences;
    const photos: string[] = myProfile?.photos || [];

    const { score, items: completionItems } = getCompletionScore({ ...profile, photos });

    // Header animations
    const headerOpacity = scrollY.interpolate({
        inputRange: [0, 120],
        outputRange: [0, 1],
        extrapolate: 'clamp',
    });

    const avatarScale = scrollY.interpolate({
        inputRange: [0, 100],
        outputRange: [1, 0.75],
        extrapolate: 'clamp',
    });

    // Start editing — pre-populate edit values
    const handleStartEdit = () => {
        setEditValues({
            bio: profile?.bio || '',
            profession: profile?.profession || '',
            height: profile?.height || '',
            religion: profile?.religion || '',
            diet: profile?.diet || '',
            drinkingHabits: profile?.drinkingHabits || '',
            smokingHabits: profile?.smokingHabits || '',
            travelFrequency: profile?.travelFrequency || '',
            relationshipPreference: profile?.relationshipPreference || '',
        });
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditValues({});
    };

    const handleSaveEdit = async () => {
        try {
            await updateProfile({ payload: editValues });
            await refetchMyProfile();
            setIsEditing(false);
            setEditValues({});
            Toast.show({ type: 'success', text1: 'Profile updated!' });
        } catch {
            Toast.show({ type: 'error', text1: 'Failed to update profile', text2: 'Please try again' });
        }
    };

    const handleLogout = () => {
        Alert.alert(
            'Sign Out',
            'Are you sure you want to sign out?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Sign Out',
                    style: 'destructive',
                    onPress: () => onPressSignout(),
                },
            ]
        );
    };

    const setEdit = (key: string, val: string) => {
        setEditValues((prev) => ({ ...prev, [key]: val }));
    };

    // Tab Selector
    const renderTabBar = () => (
        <View style={styles.tabBar}>
            {(['about', 'preferences', 'photos'] as const).map((tab) => (
                <TouchableOpacity
                    key={tab}
                    onPress={() => setActiveSection(tab)}
                    activeOpacity={0.8}
                    style={[styles.tab, activeSection === tab && styles.tabActive]}
                >
                    {activeSection === tab && (
                        <LinearGradient
                            colors={['rgba(110,168,255,0.25)', 'rgba(47,107,255,0.25)']}
                            style={StyleSheet.absoluteFill}
                        />
                    )}
                    <Ionicons
                        name={
                            tab === 'about' ? (activeSection === tab ? 'person' : 'person-outline') :
                                tab === 'preferences' ? (activeSection === tab ? 'heart' : 'heart-outline') :
                                    (activeSection === tab ? 'images' : 'images-outline')
                        }
                        size={16}
                        color={activeSection === tab ? COLORS.primaryLight : 'rgba(255,255,255,0.5)'}
                    />
                    <Text style={[styles.tabText, activeSection === tab && styles.tabTextActive]}>
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );

    // ─── About Section ────────────────────────────────────────────────────────
    const renderAbout = () => (
        <View style={styles.section}>
            {/* Basic Info Card */}
            <View style={styles.card}>
                <SectionHeader icon="information-circle-outline" title="Basic Info" />

                <InfoRow
                    label="Full Name"
                    value={profile?.name || '—'}
                />
                <View style={styles.divider} />
                <InfoRow
                    label="Date of Birth"
                    value={`${formatDob(profile?.dob)}${profile?.dob ? ` (${getAge(profile.dob)})` : ''}`}
                />
                <View style={styles.divider} />
                <InfoRow
                    label="Gender"
                    value={capitalize(profile?.gender)}
                />
                <View style={styles.divider} />
                <InfoRow
                    label="Email"
                    value={profile?.email || '—'}
                />
                <View style={styles.divider} />
                <InfoRow
                    label="Phone"
                    value={profile?.phone || '—'}
                />
            </View>

            {/* Bio Card */}
            <View style={styles.card}>
                <SectionHeader icon="chatbubble-ellipses-outline" title="About Me" />
                <InfoRow
                    label="Bio"
                    value={profile?.bio || 'No bio yet — tell the world about yourself!'}
                    editing={isEditing}
                    editValue={editValues.bio}
                    onChangeText={(t) => setEdit('bio', t)}
                    multiline
                />
            </View>

            {/* Lifestyle Card */}
            <View style={styles.card}>
                <SectionHeader icon="sparkles-outline" title="Lifestyle" />
                {isEditing ? (
                    <>
                        <Text style={styles.editSectionLabel}>Profession</Text>
                        <TextInput
                            style={styles.infoInput}
                            value={editValues.profession}
                            onChangeText={(t) => setEdit('profession', t)}
                            placeholder="Your profession"
                            placeholderTextColor={COLORS.textSecondary}
                        />
                        <Text style={[styles.editSectionLabel, { marginTop: 14 }]}>Height</Text>
                        <ChipSelector
                            options={['4_10', '5_0', '5_2', '5_4', '5_5', '5_6', '5_8', '5_10', '6_0', '6_2']}
                            selected={editValues.height}
                            onSelect={(v) => setEdit('height', v)}
                        />
                        <Text style={[styles.editSectionLabel, { marginTop: 14 }]}>Religion</Text>
                        <ChipSelector
                            options={['hindu', 'muslim', 'christian', 'sikh', 'jain', 'buddhist', 'other']}
                            selected={editValues.religion}
                            onSelect={(v) => setEdit('religion', v)}
                        />
                        <Text style={[styles.editSectionLabel, { marginTop: 14 }]}>Diet</Text>
                        <ChipSelector
                            options={['vegetarian', 'non_vegetarian', 'vegan', 'jain', 'other']}
                            selected={editValues.diet}
                            onSelect={(v) => setEdit('diet', v)}
                        />
                        <Text style={[styles.editSectionLabel, { marginTop: 14 }]}>Drinking</Text>
                        <ChipSelector
                            options={['never', 'occasionally', 'socially', 'regularly']}
                            selected={editValues.drinkingHabits}
                            onSelect={(v) => setEdit('drinkingHabits', v)}
                        />
                        <Text style={[styles.editSectionLabel, { marginTop: 14 }]}>Smoking</Text>
                        <ChipSelector
                            options={['non-smoker', 'occasionally', 'regularly']}
                            selected={editValues.smokingHabits}
                            onSelect={(v) => setEdit('smokingHabits', v)}
                        />
                    </>
                ) : (
                    <>
                        <InfoRow label="Profession" value={capitalize(profile?.profession)} />
                        <View style={styles.divider} />
                        <InfoRow label="Height" value={profile?.height ? profile.height.replace('_', "'") + '"' : '—'} />
                        <View style={styles.divider} />
                        <InfoRow label="Religion" value={capitalize(profile?.religion)} />
                        <View style={styles.divider} />
                        <InfoRow label="Diet" value={capitalize(profile?.diet)} />
                        <View style={styles.divider} />
                        <InfoRow label="Drinking" value={capitalize(profile?.drinkingHabits)} />
                        <View style={styles.divider} />
                        <InfoRow label="Smoking" value={capitalize(profile?.smokingHabits)} />
                    </>
                )}
            </View>
        </View>
    );

    // ─── Preferences Section ──────────────────────────────────────────────────
    const renderPreferences = () => (
        <View style={styles.section}>
            <View style={styles.card}>
                <SectionHeader icon="heart-outline" title="Looking For" />
                {isEditing ? (
                    <>
                        <Text style={styles.editSectionLabel}>Relationship Type</Text>
                        <ChipSelector
                            options={['long-term', 'casual', 'friendship', 'undecided']}
                            selected={editValues.relationshipPreference}
                            onSelect={(v) => setEdit('relationshipPreference', v)}
                        />
                    </>
                ) : (
                    <InfoRow label="Relationship" value={capitalize(profile?.relationshipPreference)} />
                )}
            </View>

            <View style={styles.card}>
                <SectionHeader icon="options-outline" title="My Preferences" />
                <InfoRow label="Interested In" value={capitalize(preferences?.interestedIn)} />
                <View style={styles.divider} />
                <InfoRow
                    label="Age Range"
                    value={preferences?.prefMinAge && preferences?.prefMaxAge
                        ? `${preferences.prefMinAge} – ${preferences.prefMaxAge} yrs`
                        : '—'}
                />
                <View style={styles.divider} />
                <InfoRow
                    label="Height Range"
                    value={preferences?.prefMinHeight && preferences?.prefMaxHeight
                        ? `${preferences.prefMinHeight} – ${preferences.prefMaxHeight}`
                        : '—'}
                />
                <View style={styles.divider} />
                <InfoRow label="Religion" value={capitalize(preferences?.prefReligion)} />
                <View style={styles.divider} />
                <InfoRow label="Diet" value={capitalize(preferences?.prefDiet)} />
            </View>

            <View style={styles.card}>
                <SectionHeader icon="subway-outline" title="Metro Travel" />
                {(profile?.travelTimeSlots?.length > 0) ? (
                    <View style={styles.travelSlots}>
                        {profile.travelTimeSlots.map((slot: string, i: number) => (
                            <View key={i} style={styles.travelSlotChip}>
                                <Ionicons name="location-outline" size={12} color={COLORS.primaryLight} />
                                <Text style={styles.travelSlotText}>{slot}</Text>
                            </View>
                        ))}
                    </View>
                ) : (
                    <Text style={styles.emptyHint}>No metro stations added yet</Text>
                )}
            </View>
        </View>
    );

    // ─── Photos Section ───────────────────────────────────────────────────────
    const renderPhotos = () => (
        <View style={styles.section}>
            <View style={styles.card}>
                <SectionHeader icon="images-outline" title="My Photos" />
                {!isEditing && photos.length === 0 && (
                    <View style={styles.noPhotosContainer}>
                        <Ionicons name="camera-outline" size={40} color={COLORS.textSecondary} />
                        <Text style={styles.noPhotosText}>No photos yet</Text>
                        <Text style={styles.noPhotosHint}>Tap Edit to add photos and attract more matches</Text>
                    </View>
                )}
                <View style={styles.photosGrid}>
                    {photos.map((uri, i) => (
                        <PhotoCard
                            key={i}
                            uri={uri}
                            isEditing={isEditing}
                            onRemove={() =>
                                Alert.alert('Remove Photo', 'Remove this photo from your profile?', [
                                    { text: 'Cancel', style: 'cancel' },
                                    { text: 'Remove', style: 'destructive', onPress: () => { } },
                                ])
                            }
                        />
                    ))}
                    {isEditing && photos.length < 6 && (
                        <AddPhotoCard onPress={() => Toast.show({ type: 'info', text1: 'Photo picker coming soon!' })} />
                    )}
                </View>
                {isEditing && (
                    <Text style={styles.photosHint}>
                        <Ionicons name="information-circle-outline" size={12} /> Add up to 6 photos. Your first photo is your main profile picture.
                    </Text>
                )}
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

    if (isMyProfileLoading) {
        return (
            <View style={styles.loadingScreen}>
                <ActivityIndicator size="large" color={COLORS.primaryLight} />
                <Text style={styles.loadingText}>Loading your profile…</Text>
            </View>
        );
    }

    return (
        <AppContainer>
            {/* Floating header (appears on scroll) */}
            <Animated.View style={[styles.floatingHeader, { opacity: headerOpacity }]}>
                <BlurView intensity={40} style={styles.floatingHeaderBlur}>
                    <Text style={styles.floatingHeaderTitle}>
                        {profile?.name || 'Your Profile'}
                    </Text>
                </BlurView>
            </Animated.View>

            <Animated.ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                )}
                scrollEventThrottle={16}
            >
                <SafeAreaView style={{ gap: responsiveSize(16) }} edges={['top']}>

                    <ProfileHero
                        avatarScale={avatarScale}
                        name={profile?.name}
                        dob={profile?.dob}
                        profession={profile?.profession}
                        gender={profile?.gender}
                        profilePicture={profile?.profilePicture}
                        photoCount={photos.length}
                        completionScore={score}
                        isEditing={isEditing}
                        isSaving={isUpdateProfileLoading}
                        onEditPress={handleStartEdit}
                        onSavePress={handleSaveEdit}
                        onCancelPress={handleCancelEdit}
                        onLogoutPress={handleLogout}
                    />

                    <ProfileCompletionCard score={score} items={completionItems} />


                    {/* 
                    {renderTabBar()}


                    {activeSection === 'about' && renderAbout()}
                    {activeSection === 'preferences' && renderPreferences()}
                    {activeSection === 'photos' && renderPhotos()} */}


                    <View style={{ height: 100 }} />
                </SafeAreaView>
            </Animated.ScrollView>
        </AppContainer>
    );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    loadingScreen: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },
    loadingText: {
        color: 'rgba(255,255,255,0.7)',
        fontFamily: TYPOGRAPHY.regular,
        fontSize: 14,
    },

    // Floating header
    floatingHeader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
    },
    floatingHeaderBlur: {
        paddingTop: Platform.OS === 'ios' ? 50 : 30,
        paddingBottom: 12,
        alignItems: 'center',
    },
    floatingHeaderTitle: {
        fontFamily: TYPOGRAPHY.semibold,
        fontSize: 16,
        color: 'white',
    },

    scrollView: {
        flex: 1,
        paddingHorizontal: responsiveSize(20),
        marginTop: responsiveSize(16),
    },




    // Tab bar
    tabBar: {
        flexDirection: 'row',
        marginHorizontal: 16,
        marginBottom: 12,
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: 14,
        padding: 4,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.12)',
        gap: 4,
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5,
        paddingVertical: 9,
        borderRadius: 11,
        overflow: 'hidden',
    },
    tabActive: {
        borderWidth: 1,
        borderColor: 'rgba(110,168,255,0.3)',
    },
    tabText: {
        fontFamily: TYPOGRAPHY.medium,
        fontSize: 12,
        color: 'rgba(255,255,255,0.5)',
    },
    tabTextActive: {
        color: COLORS.primaryLight,
        fontFamily: TYPOGRAPHY.semibold,
    },

    // Sections
    section: {
        paddingHorizontal: 16,
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
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingVertical: 2,
    },
    infoLabel: {
        fontFamily: TYPOGRAPHY.regular,
        fontSize: 13,
        color: 'rgba(255,255,255,0.5)',
        flex: 1,
    },
    infoValue: {
        fontFamily: TYPOGRAPHY.medium,
        fontSize: 13,
        color: 'white',
        flex: 2,
        textAlign: 'right',
    },
    infoInput: {
        flex: 2,
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(110,168,255,0.3)',
        paddingHorizontal: 12,
        paddingVertical: 8,
        color: 'white',
        fontFamily: TYPOGRAPHY.regular,
        fontSize: 13,
        textAlign: 'right',
    },
    infoInputMulti: {
        minHeight: 70,
        textAlign: 'left',
        textAlignVertical: 'top',
        flex: undefined,
        width: '100%',
        marginTop: 8,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.08)',
        marginVertical: 10,
    },

    // Edit section label
    editSectionLabel: {
        fontFamily: TYPOGRAPHY.medium,
        fontSize: 12,
        color: 'rgba(255,255,255,0.5)',
        marginBottom: 8,
    },

    // Chips
    chipRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    chip: {
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
        overflow: 'hidden',
    },
    chipActive: {
        borderColor: 'transparent',
    },
    chipText: {
        fontFamily: TYPOGRAPHY.medium,
        fontSize: 12,
        color: 'rgba(255,255,255,0.6)',
    },
    chipTextActive: {
        color: 'white',
    },

    // Travel slots
    travelSlots: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    travelSlotChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: 'rgba(47,107,255,0.2)',
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderWidth: 1,
        borderColor: 'rgba(110,168,255,0.3)',
    },
    travelSlotText: {
        fontFamily: TYPOGRAPHY.medium,
        fontSize: 12,
        color: COLORS.primaryLight,
    },
    emptyHint: {
        fontFamily: TYPOGRAPHY.regular,
        fontSize: 13,
        color: 'rgba(255,255,255,0.35)',
        fontStyle: 'italic',
    },

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

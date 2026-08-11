import React, { useRef, useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Animated,
    PanResponder,
    Image,
    ActivityIndicator,
    Platform,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { COLORS, TYPOGRAPHY } from '@/constants/theme';
import useDiscoverService, { NearbyProfile, SwipeType } from '@/hooks/services/useDiscoverService';
import useFavoriteService from '@/hooks/services/useFavoriteService';
import useMasterListQuery from '@/hooks/services/useMasterListQuery';
import AppContainer from '@/components/shared/layout/app_container';
import RemainigTimeTab from '@/components/shared/organisms/remaining_time_tab';
import PreferenceFilter from '@/components/shared/templates/preference_filter';
import useProfileService from '@/hooks/services/useProfileService';
import MainHeader from '@/components/shared/molecules/main_header';


const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 32;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.28;
const ROTATION_FACTOR = 12;

// ─── helper ────────────────────────────────────────────────────────────────
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
    if (meters < 1000) return `${meters}m away`;
    return `${(meters / 1000).toFixed(1)} km away`;
}

// ─── Interest chips ─────────────────────────────────────────────────────────
function InterestChip({ label, icon }: { label: string; icon: string }) {
    return (
        <View style={styles.chip}>
            <Text style={styles.chipIcon}>{icon}</Text>
            <Text style={styles.chipText}>{label}</Text>
        </View>
    );
}

// ─── Match Modal ─────────────────────────────────────────────────────────────
function MatchModal({
    visible,
    profile,
    onClose,
}: {
    visible: boolean;
    profile: NearbyProfile | null;
    onClose: () => void;
}) {
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    tension: 60,
                    friction: 8,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 250,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            scaleAnim.setValue(0);
            opacityAnim.setValue(0);
        }
    }, [visible]);

    if (!visible || !profile) return null;

    return (
        <Animated.View style={[styles.matchOverlay, { opacity: opacityAnim }]}>
            <Animated.View
                style={[styles.matchCard, { transform: [{ scale: scaleAnim }] }]}
            >
                <LinearGradient
                    colors={['#1A42D9', '#5C3DD8']}
                    style={styles.matchGradient}
                >
                    <Text style={styles.matchEmoji}>💙</Text>
                    <Text style={styles.matchTitle}>It's a Match!</Text>
                    <Text style={styles.matchSubtitle}>
                        You and{' '}
                        <Text style={{ fontFamily: TYPOGRAPHY.semibold }}>
                            {profile.name}
                        </Text>{' '}
                        liked each other
                    </Text>

                    <View style={styles.matchAvatarRow}>
                        <View style={styles.matchAvatarBorder}>
                            <View style={styles.matchAvatarPlaceholder}>
                                <Ionicons name="person" size={32} color={COLORS.primary} />
                            </View>
                        </View>
                        <View style={styles.matchHeartBadge}>
                            <Text style={{ fontSize: 18 }}>❤️</Text>
                        </View>
                        <View style={styles.matchAvatarBorder}>
                            <View style={styles.matchAvatarPlaceholder}>
                                <Ionicons name="person" size={32} color="#E91E8C" />
                            </View>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={styles.matchMessageBtn}
                        onPress={onClose}
                        activeOpacity={0.85}
                    >
                        <LinearGradient
                            colors={['#6EA8FF', '#2F6BFF']}
                            style={styles.matchMessageGradient}
                        >
                            <Ionicons name="chatbubble-ellipses" size={18} color="white" />
                            <Text style={styles.matchMessageText}>Send Message</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={onClose} style={{ marginTop: 12 }}>
                        <Text style={styles.matchKeepText}>Keep Swiping</Text>
                    </TouchableOpacity>
                </LinearGradient>
            </Animated.View>
        </Animated.View>
    );
}



// ─── Swipeable Card ──────────────────────────────────────────────────────────
function SwipeCard({
    profile,
    onSwipe,
    onPress,
    isTop,
    stackIndex,
}: {
    profile: NearbyProfile;
    onSwipe: (profileId: string, swipeType: SwipeType) => void;
    onPress: (profile: NearbyProfile) => void;
    isTop: boolean;
    stackIndex: number;
}) {
    const position = useRef(new Animated.ValueXY()).current;
    const likeOpacity = useRef(new Animated.Value(0)).current;
    const nopeOpacity = useRef(new Animated.Value(0)).current;
    const superLikeOpacity = useRef(new Animated.Value(0)).current;

    // Keep a mutable ref so PanResponder callbacks always read the latest value.
    // Without this, the closure inside useRef(PanResponder.create(...)) captures
    // isTop from the FIRST render only, causing all non-first cards to be
    // un-swipeable even after they become the top card.
    const isTopRef = useRef(isTop);
    isTopRef.current = isTop;   // update on every render — no useEffect needed

    const rotate = position.x.interpolate({
        inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
        outputRange: [`-${ROTATION_FACTOR}deg`, '0deg', `${ROTATION_FACTOR}deg`],
        extrapolate: 'clamp',
    });

    const cardOpacity = position.x.interpolate({
        inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
        outputRange: [0.6, 1, 0.6],
        extrapolate: 'clamp',
    });

    // Track total drag distance to distinguish taps from swipes
    const dragDistanceRef = useRef(0);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => false,
            onMoveShouldSetPanResponder: () => isTopRef.current,
            onPanResponderGrant: () => {
                dragDistanceRef.current = 0;
            },
            onPanResponderMove: (_, { dx, dy }) => {
                dragDistanceRef.current = Math.max(Math.abs(dx), Math.abs(dy));
                position.setValue({ x: dx, y: dy });
                // Update stamp opacities
                const absDx = Math.abs(dx);
                if (dy < -60 && absDx < 60) {
                    superLikeOpacity.setValue(Math.min((-dy - 60) / 60, 1));
                    likeOpacity.setValue(0);
                    nopeOpacity.setValue(0);
                } else if (dx > 0) {
                    likeOpacity.setValue(Math.min(dx / SWIPE_THRESHOLD, 1));
                    nopeOpacity.setValue(0);
                    superLikeOpacity.setValue(0);
                } else {
                    nopeOpacity.setValue(Math.min(-dx / SWIPE_THRESHOLD, 1));
                    likeOpacity.setValue(0);
                    superLikeOpacity.setValue(0);
                }
            },
            onPanResponderRelease: (_, { dx, dy }) => {
                const absDx = Math.abs(dx);
                // If barely moved — treat as a tap → open profile sheet
                if (dragDistanceRef.current < 8) {
                    onPress(profile);
                    return;
                }
                if (dy < -100 && absDx < 80) {
                    // Super like — swipe up
                    Animated.spring(position, {
                        toValue: { x: 0, y: -SCREEN_HEIGHT },
                        useNativeDriver: true,
                    }).start(() => onSwipe(profile.id, 'super_like'));
                } else if (dx > SWIPE_THRESHOLD) {
                    // Like — swipe right
                    Animated.spring(position, {
                        toValue: { x: SCREEN_WIDTH + 100, y: dy },
                        useNativeDriver: true,
                    }).start(() => onSwipe(profile.id, 'like'));
                } else if (dx < -SWIPE_THRESHOLD) {
                    // Pass — swipe left
                    Animated.spring(position, {
                        toValue: { x: -SCREEN_WIDTH - 100, y: dy },
                        useNativeDriver: true,
                    }).start(() => onSwipe(profile.id, 'pass'));
                } else {
                    // Snap back
                    Animated.parallel([
                        Animated.spring(position, {
                            toValue: { x: 0, y: 0 },
                            tension: 40,
                            friction: 6,
                            useNativeDriver: true,
                        }),
                        Animated.timing(likeOpacity, { toValue: 0, duration: 150, useNativeDriver: true }),
                        Animated.timing(nopeOpacity, { toValue: 0, duration: 150, useNativeDriver: true }),
                        Animated.timing(superLikeOpacity, { toValue: 0, duration: 150, useNativeDriver: true }),
                    ]).start();
                }
            },
        })
    ).current;

    const scale = isTop ? 1 : Math.max(0.94 - (stackIndex - 1) * 0.03, 0.85);
    const translateY = isTop ? 0 : (stackIndex - 1) * 10;

    const interests: { label: string; icon: string }[] = [
        profile.diet ? { label: profile.diet, icon: '🥗' } : null,
        profile.travelFrequency ? { label: profile.travelFrequency, icon: '✈️' } : null,
        profile.smokingHabits === 'non-smoker' ? null : profile.smokingHabits ? { label: profile.smokingHabits, icon: '🚬' } : null,
        profile.drinkingHabits ? { label: profile.drinkingHabits, icon: '☕' } : null,
    ].filter(Boolean) as { label: string; icon: string }[];

    return (
        <Animated.View
            style={[
                styles.card,
                {
                    transform: [
                        { scale },
                        { translateY },
                        ...(isTop
                            ? [
                                { translateX: position.x },
                                { translateY: position.y },
                                { rotate },
                            ]
                            : []),
                    ],
                    opacity: isTop ? cardOpacity : 1,
                    zIndex: isTop ? 10 : 10 - stackIndex,
                },
            ]}
            {...(isTop ? panResponder.panHandlers : {})}
        >
            {/* Photo */}
            <View style={styles.cardPhotoContainer}>
                <LinearGradient
                    colors={['#1A42D9', '#5C7BFF']}
                    style={styles.cardPhotoPlaceholder}
                >
                    <Image
                        source={{ uri: profile.imageUrl }}
                        style={styles.cardPhotoPlaceholder}
                        resizeMode='cover'
                    // onError={}
                    />
                    {/* <Ionicons name="person" size={80} color="rgba(255,255,255,0.4)" /> */}
                </LinearGradient>
                {/* //image */}

                {/* Online badge */}
                <View style={styles.onlineBadge}>
                    <View style={styles.onlineDot} />
                    <Text style={styles.onlineText}>Online</Text>
                </View>

                {/* More options */}
                <TouchableOpacity style={styles.moreBtn}>
                    <Ionicons name="ellipsis-horizontal" size={18} color="white" />
                </TouchableOpacity>

                {/* Like stamp */}
                <Animated.View
                    style={[styles.stamp, styles.likeStamp, { opacity: likeOpacity }]}
                >
                    <Text style={styles.stampText}>LIKE</Text>
                </Animated.View>

                {/* Nope stamp */}
                <Animated.View
                    style={[styles.stamp, styles.nopeStamp, { opacity: nopeOpacity }]}
                >
                    <Text style={[styles.stampText, { color: '#FF4458' }]}>NOPE</Text>
                </Animated.View>

                {/* Super Like stamp */}
                <Animated.View
                    style={[styles.stamp, styles.superStamp, { opacity: superLikeOpacity }]}
                >
                    <Text style={[styles.stampText, { color: '#00B4D8' }]}>SUPER</Text>
                </Animated.View>

                {/* Bottom gradient on photo */}
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.85)']}
                    style={styles.cardPhotoGradient}
                />
            </View>

            {/* Info */}
            <BlurView intensity={40} tint="dark" style={styles.cardInfo}>
                {/* Name + age + verified */}
                <View style={styles.nameRow}>
                    <Text style={styles.nameText}>
                        {profile.name}
                        {profile.dob ? `, ${getAge(profile.dob)}` : ''}
                    </Text>
                    <View style={styles.verifiedBadge}>
                        <Ionicons name="checkmark" size={11} color="white" />
                    </View>
                    {profile.distanceMeters != null && (
                        <View style={styles.distanceBadge}>
                            <Ionicons name="location-outline" size={12} color={COLORS.primary} />
                            <Text style={styles.distanceText}>
                                {fmtDistance(profile.distanceMeters)}
                            </Text>
                        </View>
                    )}
                </View>

                {/* Metro route row */}
                {(profile.travelTimeSlots?.length ?? 0) > 0 && (
                    <View style={styles.metroRow}>
                        <Ionicons name="subway-outline" size={14} color={COLORS.primaryLight} />
                        <Text style={styles.metroText} numberOfLines={1}>
                            {profile.travelTimeSlots?.slice(0, 2).join(' → ')}
                        </Text>
                    </View>
                )}

                {/* Interest chips */}
                {interests.length > 0 && (
                    <View style={styles.chipsRow}>
                        {interests.slice(0, 3).map((it, i) => (
                            <InterestChip key={i} label={it.label} icon={it.icon} />
                        ))}
                    </View>
                )}

                {/* Bio line */}
                {profile.relationshipPreference && (
                    <Text style={styles.bioText} numberOfLines={2}>
                        Looking for {profile.relationshipPreference.toLowerCase()} 💙
                    </Text>
                )}
            </BlurView>
        </Animated.View>
    );
}

// ─── Action Buttons ──────────────────────────────────────────────────────────
function ActionButtons({
    onPass,
    onLike,
    onMarkFavorite,
    disabled,
}: {
    onPass: () => void;
    onLike: () => void;
    onMarkFavorite: () => void;
    disabled: boolean;
}) {
    return (
        <View style={styles.actionRow}>
            {/* Undo */}
            {/* <TouchableOpacity
                onPress={onUndo}
                style={[styles.actionBtn, styles.actionBtnSm]}
                activeOpacity={0.8}
                disabled={disabled}
            >
                <Ionicons name="refresh" size={22} color={COLORS.textSecondary} />
            </TouchableOpacity> */}

            {/* Pass */}
            <TouchableOpacity
                onPress={onPass}
                style={[styles.actionBtn, styles.actionBtnLg]}
                activeOpacity={0.8}
                disabled={disabled}
            >
                <LinearGradient colors={['#FF6B8A', '#FF4458']} style={styles.actionGradient}>
                    <Ionicons name="close" size={30} color="white" />
                </LinearGradient>
            </TouchableOpacity>

            {/* Like */}
            <TouchableOpacity
                onPress={onLike}
                style={[styles.actionBtn, styles.actionBtnXl]}
                activeOpacity={0.8}
                disabled={disabled}
            >
                <LinearGradient colors={['#FF6BAA', '#E91E8C']} style={styles.actionGradient}>
                    <Ionicons name="heart" size={34} color="white" />
                </LinearGradient>
            </TouchableOpacity>

            {/* Super Like */}
            <TouchableOpacity
                onPress={onMarkFavorite}
                style={[styles.actionBtn, styles.actionBtnLg]}
                activeOpacity={0.8}
                disabled={disabled}
            >
                <LinearGradient colors={['#6EA8FF', '#2F6BFF']} style={styles.actionGradient}>
                    <Ionicons name="star" size={26} color="white" />
                </LinearGradient>
            </TouchableOpacity>

            {/* Spacer for symmetry */}
            {/* <View style={[styles.actionBtn, styles.actionBtnSm]} /> */}
        </View>
    );
}



// ─── Main Screen ─────────────────────────────────────────────────────────────
export default function DiscoverScreen() {
    const [showFilter, setShowFilter] = useState(false)
    const [activeFilter, setActiveFilter] = useState({});
    const {
        nearbyProfiles,
        isDiscoveryLoading,
        refetchDiscovery,
        refresh,
        locationStatus,
        swipe,
        isSwipePending,
    } = useDiscoverService({ radius: 1000, limit: 20, filters: activeFilter });

    const [cardStack, setCardStack] = useState<NearbyProfile[]>([]);
    const [matchedProfile, setMatchedProfile] = useState<NearbyProfile | null>(null);
    const [showMatch, setShowMatch] = useState(false);

    const stackDepletedFetch = useRef(false);

    const { markFavorite } = useFavoriteService({});
    const { masterlist } = useMasterListQuery();

    const { myProfile } = useProfileService({})

    React.useEffect(() => {
        if ((nearbyProfiles?.length || 0) > 0) {
            setCardStack([...(nearbyProfiles || [])]);
            stackDepletedFetch.current = false;
        }
    }, [nearbyProfiles]);

    React.useEffect(() => {
        if (
            !isDiscoveryLoading &&
            locationStatus === 'ready' &&
            cardStack.length === 0 &&
            !stackDepletedFetch.current
        ) {
            stackDepletedFetch.current = true; // prevent re-firing until new cards load
            refetchDiscovery();
        }
    }, [cardStack.length, isDiscoveryLoading, locationStatus]);

    const handleSwipe = useCallback(
        async (profileId: string, swipeType: SwipeType) => {
            // Remove card from stack immediately for snappy UX
            setCardStack((prev) => prev.filter((p) => p.id !== profileId));

            try {
                const res = await swipe({ toProfileId: profileId, swipeType });
                const data = res.data;
                if (data?.matched && swipeType !== 'pass') {
                    const matchedP = nearbyProfiles?.find((p) => p.id === profileId);
                    if (matchedP) {
                        setMatchedProfile(matchedP);
                        setShowMatch(true);
                    }
                }
            } catch (_) {
                // swipe errors are handled by http interceptor (toast)
            }
        },
        [nearbyProfiles, swipe]
    );

    const onMarkFavorite = () => {
        const top = cardStack[0];
        markFavorite(top.id)
    }

    const handleButtonSwipe = (type: SwipeType) => {
        if (cardStack.length === 0) return;
        const top = cardStack[0];
        handleSwipe(top.id, type);
    };

    const renderEmpty = () => {
        if (locationStatus === 'denied') {
            return (
                <View style={styles.emptyContainer}>
                    <Text style={{ fontSize: 48 }}>📍</Text>
                    <Text style={styles.emptyTitle}>Location Access Needed</Text>
                    <Text style={styles.emptySubtitle}>
                        MetroMatch needs your location to find people near your metro route.
                        Please enable location in Settings and try again.
                    </Text>
                    <TouchableOpacity
                        style={styles.refreshBtn}
                        onPress={refresh}
                        activeOpacity={0.85}
                    >
                        <LinearGradient colors={['#6EA8FF', '#2F6BFF']} style={styles.refreshGradient}>
                            <Ionicons name="location" size={18} color="white" />
                            <Text style={styles.refreshText}>Try Again</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            );
        }

        if (locationStatus === 'error') {
            return (
                <View style={styles.emptyContainer}>
                    <Text style={{ fontSize: 48 }}>⚠️</Text>
                    <Text style={styles.emptyTitle}>Connection Error</Text>
                    <Text style={styles.emptySubtitle}>
                        Couldn't reach the server. Check your connection and try again.
                    </Text>
                    <TouchableOpacity
                        style={styles.refreshBtn}
                        onPress={refresh}
                        activeOpacity={0.85}
                    >
                        <LinearGradient colors={['#6EA8FF', '#2F6BFF']} style={styles.refreshGradient}>
                            <Ionicons name="refresh" size={18} color="white" />
                            <Text style={styles.refreshText}>Retry</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            );
        }

        return (
            <View style={styles.emptyContainer}>
                <Text style={{ fontSize: 48 }}>🚉</Text>
                <Text style={styles.emptyTitle}>No one nearby</Text>
                <Text style={styles.emptySubtitle}>
                    Expand your radius or check back later when more commuters are online
                </Text>
                <TouchableOpacity
                    style={styles.refreshBtn}
                    onPress={() => {
                        setCardStack([]);
                        refetchDiscovery();
                    }}
                    activeOpacity={0.85}
                >
                    <LinearGradient colors={['#6EA8FF', '#2F6BFF']} style={styles.refreshGradient}>
                        <Ionicons name="refresh" size={18} color="white" />
                        <Text style={styles.refreshText}>Refresh</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        );
    };

    const setDefaultFilters = () => {
        const pref = myProfile?.preferences
        if (!pref) return;
        setActiveFilter({
            prefMinAge: String(pref.prefMinAge),
            prefMaxAge: String(pref.prefMaxAge),
            prefMinHeight: pref.prefMinHeight,
            prefMaxHeight: pref.prefMaxHeight,
            prefReligion: pref.prefReligion,
            prefDiet: pref.prefDiet,
            prefDrinkingHabits: pref.drinkingHabits,
            prefSmokingHabits: pref.smokingHabits
        })
    }

    React.useEffect(() => {
        if (!myProfile) return;
        setDefaultFilters()
    }, [myProfile]);

    return (
        <View style={{ flex: 1 }}>

            <ScrollView >
                {/* <View style={styles.header}>
                        <TouchableOpacity style={styles.headerIcon}>
                            <Ionicons name="menu" size={24} color="white" />
                        </TouchableOpacity>

                        <View style={styles.logoRow}>
                            <Image
                                source={require('@/assets/images/metromatch_logo.png')}
                                style={styles.headerLogo}
                                resizeMode="contain"
                            />
                        </View>

                        <TouchableOpacity style={styles.headerIcon} onPress={() => setShowFilter(true)}>
                            <Ionicons name="options-outline" size={24} color="white" />
                        </TouchableOpacity>
                    </View> */}
                {/* <MainHeader /> */}

                <RemainigTimeTab />

                <View style={styles.cardArea}>
                    {isDiscoveryLoading || locationStatus === 'requesting' || locationStatus === 'updating' ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="white" />
                            <Text style={styles.loadingText}>
                                {locationStatus === 'requesting'
                                    ? 'Requesting location access…'
                                    : locationStatus === 'updating'
                                        ? 'Updating your location…'
                                        : 'Finding people near you…'}
                            </Text>
                        </View>
                    ) : cardStack.length === 0 ? (
                        renderEmpty()
                    ) : (
                        cardStack
                            .slice(0, 3)
                            .reverse()
                            .map((profile, reverseIdx) => {
                                const stackIndex = Math.min(cardStack.slice(0, 3).length - 1 - reverseIdx, 2);
                                const isTop = stackIndex === 0;
                                return (
                                    <SwipeCard
                                        key={profile.id}
                                        profile={{
                                            name: profile.name,
                                            id: profile.id,
                                            dob: profile.dob ?? '',
                                            profession: profile.profession ?? '',
                                            gender: masterlist?.gender?.find((g: any) => g.value === profile.gender)?.label,
                                            userId: profile.userId,
                                            travelTimeSlots: profile.travelTimeSlots?.map((t: string) => masterlist?.travelTimeRange?.find((r: any) => r.value === t)?.label ?? ''),
                                            diet: masterlist?.diet?.find((d: any) => d.value === profile.diet)?.label,
                                            drinkingHabits: masterlist?.drinkingHabits?.find((d: any) => d.value === profile.drinkingHabits)?.label,
                                            smokingHabits: masterlist?.smokingHabits?.find((s: any) => s.value === profile.smokingHabits)?.label,
                                            travelFrequency: masterlist?.travelFrequency?.find((t: any) => t.value === profile.travelFrequency)?.label,
                                            relationshipPreference: masterlist?.relationshipPreference?.find((r: any) => r.value === profile.relationshipPreference)?.label,
                                            interestedIn: masterlist?.interestedIn?.find((i: any) => i.value === profile.interestedIn)?.label,
                                            imageUrl: profile.photos?.find((p: any) => p.isPrimary)?.imageUrl ?? ''
                                        }}
                                        onSwipe={handleSwipe}
                                        onPress={() => {
                                            router.push({
                                                pathname: '/profile_details/[profileId]',
                                                params: {
                                                    profileId: profile.id,
                                                    name: profile.name,
                                                    dob: profile.dob ?? '',
                                                    gender: profile.gender ?? '',
                                                    profession: profile.profession ?? '',
                                                    religion: profile.religion ?? '',
                                                    height: profile.height ?? '',
                                                    diet: 'Non veg',
                                                    drinkingHabits: profile.drinkingHabits ?? '',
                                                    smokingHabits: profile.smokingHabits ?? '',
                                                    travelFrequency: profile.travelFrequency ?? '',
                                                    relationshipPreference: profile.relationshipPreference ?? '',
                                                    interestedIn: profile.interestedIn ?? '',
                                                    travelTimeSlots: JSON.stringify(profile.travelTimeSlots ?? []),
                                                    distanceMeters: String(profile.distanceMeters ?? ''),
                                                    imageUrl: profile.photos?.filter((photo: any) => !photo.isPrimary)?.map((photo: any) => photo.imageUrl) ?? [],
                                                    primaryImage: profile.photos?.find((photo: any) => photo.isPrimary)?.imageUrl || '',
                                                    bio: profile.bio,
                                                },
                                            });
                                        }}
                                        isTop={isTop}
                                        stackIndex={stackIndex}
                                    />
                                );
                            })
                    )}
                </View>

                {cardStack.length > 0 && !isDiscoveryLoading && (
                    <ActionButtons
                        disabled={isSwipePending}
                        onPass={() => handleButtonSwipe('pass')}
                        onLike={() => handleButtonSwipe('like')}
                        onMarkFavorite={() => onMarkFavorite()}
                    />
                )}
            </ScrollView>


            {/* ─── Match modal ─────────────────────────────────────────── */}
            <MatchModal
                visible={showMatch}
                profile={matchedProfile}
                onClose={() => setShowMatch(false)}
            />

            {showFilter && (
                <PreferenceFilter
                    onClose={setShowFilter}
                    onApply={(values) => {
                        setActiveFilter(values);
                        setShowFilter(false);
                    }}
                    onReset={() => {
                        setDefaultFilters();
                        setShowFilter(false);
                    }}
                    selectedFilters={activeFilter}
                />
            )}


        </View>
    );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: 'transparent',
        paddingBottom: 70
    },
    bgOverlay: {
        ...StyleSheet.absoluteFill,
        backgroundColor: 'rgba(7, 28, 107, 0.40)',
    },
    safeArea: {
        flex: 1,
        position: 'relative'
    },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    headerIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.15)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerLogo: {
        width: 130,
        height: 36,
    },

    // Filters
    filterRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.12)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        overflow: 'hidden',
    },
    filterChipActive: {
        borderColor: 'transparent',
    },
    filterText: {
        color: 'rgba(255,255,255,0.7)',
        fontFamily: TYPOGRAPHY.medium,
        fontSize: 13,
    },
    filterTextActive: {
        color: 'white',
        fontFamily: TYPOGRAPHY.semibold,
    },

    // Card area
    cardArea: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
    },

    // Card
    card: {
        position: 'absolute',
        width: CARD_WIDTH,
        top: 40,
        height: CARD_WIDTH * 4 / 3,
        borderRadius: 24,
        overflow: 'hidden',
        backgroundColor: '#1a2461',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 20,
        elevation: 12,
    },
    cardPhotoContainer: {
        flex: 1,
        position: 'relative',
    },
    cardPhotoPlaceholder: {
        ...StyleSheet.absoluteFill,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardPhotoGradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '55%',
    },
    onlineBadge: {
        position: 'absolute',
        top: 14,
        left: 14,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.45)',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12,
        gap: 5,
    },
    onlineDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#4CAF50',
    },
    onlineText: {
        color: 'white',
        fontSize: 12,
        fontFamily: TYPOGRAPHY.medium,
    },
    moreBtn: {
        position: 'absolute',
        top: 14,
        right: 14,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Stamps
    stamp: {
        position: 'absolute',
        top: 30,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 3,
        transform: [{ rotate: '-15deg' }],
    },
    likeStamp: {
        left: 20,
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.15)',
        transform: [{ rotate: '-15deg' }],
    },
    nopeStamp: {
        right: 20,
        borderColor: '#FF4458',
        backgroundColor: 'rgba(255, 68, 88, 0.15)',
        transform: [{ rotate: '15deg' }],
    },
    superStamp: {
        alignSelf: 'center',
        left: '30%',
        top: 30,
        borderColor: '#00B4D8',
        backgroundColor: 'rgba(0, 180, 216, 0.15)',
        transform: [{ rotate: '-5deg' }],
    },
    stampText: {
        fontFamily: TYPOGRAPHY.bold,
        fontSize: 22,
        letterSpacing: 2,
        color: '#4CAF50',
    },

    // Card info
    cardInfo: {
        paddingHorizontal: 16,
        paddingVertical: 14,
        backgroundColor: 'rgba(0, 0, 0, 1)',
        position: 'absolute',
        bottom: 0,
        width: '100%'
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        flexWrap: 'wrap',
        marginBottom: 4,
    },
    nameText: {
        color: 'white',
        fontFamily: TYPOGRAPHY.bold,
        fontSize: 20,
    },
    verifiedBadge: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    distanceBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.12)',
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 3,
        gap: 3,
        marginLeft: 'auto',
    },
    distanceText: {
        color: COLORS.primaryLight,
        fontSize: 11,
        fontFamily: TYPOGRAPHY.medium,
    },
    metroRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 8,
    },
    metroText: {
        color: 'rgba(255,255,255,0.75)',
        fontSize: 12,
        fontFamily: TYPOGRAPHY.regular,
        flex: 1,
    },
    chipsRow: {
        flexDirection: 'row',
        gap: 6,
        flexWrap: 'wrap',
        marginBottom: 6,
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 14,
        paddingHorizontal: 10,
        paddingVertical: 4,
        gap: 4,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
    },
    chipIcon: { fontSize: 12 },
    chipText: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 11,
        fontFamily: TYPOGRAPHY.medium,
    },
    bioText: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 12,
        fontFamily: TYPOGRAPHY.regular,
        lineHeight: 18,
        marginTop: 2,
    },

    // Action buttons
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        paddingHorizontal: 20,
        paddingBottom: Platform.OS === 'ios' ? 20 : 16,
        paddingTop: 10,
    },
    actionBtn: {
        position: 'relative',
        top: 40 + CARD_WIDTH * 4 / 3,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 6,
        backgroundColor: 'white',
    },
    actionBtnSm: { width: 48, height: 48 },
    actionBtnLg: { width: 62, height: 62 },
    actionBtnXl: { width: 72, height: 72 },
    actionGradient: {
        width: '100%',
        height: '100%',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Empty state
    emptyContainer: {
        alignItems: 'center',
        gap: 12,
        paddingHorizontal: 32,
    },
    emptyTitle: {
        color: 'white',
        fontFamily: TYPOGRAPHY.semibold,
        fontSize: 22,
    },
    emptySubtitle: {
        color: 'rgba(255,255,255,0.65)',
        fontFamily: TYPOGRAPHY.regular,
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 21,
    },
    refreshBtn: {
        marginTop: 8,
        borderRadius: 24,
        overflow: 'hidden',
    },
    refreshGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 28,
        paddingVertical: 14,
    },
    refreshText: {
        color: 'white',
        fontFamily: TYPOGRAPHY.semibold,
        fontSize: 15,
    },

    // Loading
    loadingContainer: {
        alignItems: 'center',
        gap: 14,
    },
    loadingText: {
        color: 'rgba(255,255,255,0.75)',
        fontFamily: TYPOGRAPHY.medium,
        fontSize: 15,
    },

    // Match modal
    matchOverlay: {
        ...StyleSheet.absoluteFill,
        backgroundColor: 'rgba(0,0,0,0.75)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
    },
    matchCard: {
        width: SCREEN_WIDTH - 48,
        borderRadius: 28,
        overflow: 'hidden',
    },
    matchGradient: {
        padding: 32,
        alignItems: 'center',
    },
    matchEmoji: { fontSize: 48, marginBottom: 8 },
    matchTitle: {
        color: 'white',
        fontFamily: TYPOGRAPHY.bold,
        fontSize: 28,
        marginBottom: 8,
    },
    matchSubtitle: {
        color: 'rgba(255,255,255,0.8)',
        fontFamily: TYPOGRAPHY.regular,
        fontSize: 15,
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 22,
    },
    matchAvatarRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 0,
        marginBottom: 28,
    },
    matchAvatarBorder: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 3,
        borderColor: 'white',
        overflow: 'hidden',
    },
    matchAvatarPlaceholder: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.15)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    matchHeartBadge: {
        zIndex: 1,
        marginHorizontal: -10,
    },
    matchMessageBtn: {
        width: '100%',
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 4,
    },
    matchMessageGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 16,
    },
    matchMessageText: {
        color: 'white',
        fontFamily: TYPOGRAPHY.semibold,
        fontSize: 16,
    },
    matchKeepText: {
        color: 'rgba(255,255,255,0.6)',
        fontFamily: TYPOGRAPHY.medium,
        fontSize: 14,
        paddingVertical: 8,
    },

    // ─── Profile Bottom Sheet ───────────────────────────────────────────────
    sheetBackdrop: {
        ...StyleSheet.absoluteFill,
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    sheet: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        maxHeight: SCREEN_HEIGHT * 0.88,
        backgroundColor: '#0D1B6E',
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -6 },
        shadowOpacity: 0.4,
        shadowRadius: 20,
        elevation: 20,
    },
    sheetHandle: {
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: 'rgba(255,255,255,0.3)',
        alignSelf: 'center',
        marginTop: 12,
        marginBottom: 8,
    },
    sheetScroll: {
        paddingBottom: 40,
    },
    sheetPhotoWrap: {
        width: '100%',
        height: 280,
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sheetPhoto: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sheetPhotoGradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '60%',
    },
    sheetNameOverlay: {
        position: 'absolute',
        bottom: 16,
        left: 20,
        right: 20,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
    },
    sheetName: {
        color: 'white',
        fontFamily: TYPOGRAPHY.bold,
        fontSize: 26,
        flex: 1,
        marginRight: 12,
    },
    sheetDistanceBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 5,
        gap: 4,
    },
    sheetDistanceText: {
        color: COLORS.primaryLight,
        fontSize: 12,
        fontFamily: TYPOGRAPHY.medium,
    },
    sheetMetroBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginHorizontal: 20,
        marginTop: 16,
        backgroundColor: 'rgba(47,107,255,0.18)',
        borderRadius: 14,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: 'rgba(110,168,255,0.25)',
    },
    sheetMetroText: {
        color: COLORS.primaryLight,
        fontFamily: TYPOGRAPHY.medium,
        fontSize: 13,
        flex: 1,
    },
    sheetSection: {
        marginTop: 20,
        marginHorizontal: 20,
    },
    sheetSectionTitle: {
        color: 'rgba(255,255,255,0.5)',
        fontFamily: TYPOGRAPHY.semibold,
        fontSize: 11,
        letterSpacing: 1.4,
        textTransform: 'uppercase',
        marginBottom: 12,
    },
    sheetGrid: {
        gap: 10,
    },
    sheetGridItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        backgroundColor: 'rgba(255,255,255,0.07)',
        borderRadius: 14,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    sheetGridIcon: {
        fontSize: 20,
        width: 28,
        textAlign: 'center',
    },
    sheetGridLabel: {
        color: 'rgba(255,255,255,0.45)',
        fontFamily: TYPOGRAPHY.regular,
        fontSize: 11,
        marginBottom: 2,
    },
    sheetGridValue: {
        color: 'white',
        fontFamily: TYPOGRAPHY.medium,
        fontSize: 14,
    },
    sheetChipsWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    sheetChipItem: {
        backgroundColor: 'rgba(47,107,255,0.2)',
        borderRadius: 20,
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderWidth: 1,
        borderColor: 'rgba(110,168,255,0.3)',
    },
    sheetChipText: {
        color: COLORS.primaryLight,
        fontFamily: TYPOGRAPHY.medium,
        fontSize: 13,
    },
    sheetCloseBtn: {
        position: 'absolute',
        top: 16,
        right: 16,
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: 'rgba(0,0,0,0.45)',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

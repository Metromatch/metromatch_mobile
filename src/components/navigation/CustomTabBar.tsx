import React, { useRef, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Platform,
    Dimensions,
} from 'react-native';
// import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, TYPOGRAPHY } from '@/constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── Tab config ───────────────────────────────────────────────────────────────

const TAB_CONFIG: Record<
    string,
    {
        label: string;
        icon: keyof typeof Ionicons.glyphMap;
        activeIcon: keyof typeof Ionicons.glyphMap;
        badge?: number;
    }
> = {
    discover: {
        label: 'Discover',
        icon: 'heart-outline',
        activeIcon: 'heart',
    },
    messages: {
        label: 'Messages',
        icon: 'chatbubble-ellipses-outline',
        activeIcon: 'chatbubble-ellipses',
    },
    matches: {
        label: 'Matches',
        icon: 'star-outline',
        activeIcon: 'star',
    },
    map: {
        label: 'Map',
        icon: 'heart-circle-outline',
        activeIcon: 'heart-circle',
        badge: 12,
    },
    ['profile/index']: {
        label: 'Profile',
        icon: 'person-outline',
        activeIcon: 'person',
    },
};

// ─── Single Tab Item ──────────────────────────────────────────────────────────

function TabItem({
    routeName,
    isFocused,
    onPress,
    onLongPress,
}: {
    routeName: string;
    isFocused: boolean;
    onPress: () => void;
    onLongPress: () => void;
}) {
    const config = TAB_CONFIG[routeName];
    if (!config) return null;

    const scaleAnim = useRef(new Animated.Value(1)).current;
    const opacityAnim = useRef(new Animated.Value(isFocused ? 1 : 0)).current;
    const translateYAnim = useRef(new Animated.Value(isFocused ? -2 : 0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.spring(scaleAnim, {
                toValue: isFocused ? 1.12 : 1,
                useNativeDriver: true,
                tension: 200,
                friction: 12,
            }),
            Animated.timing(opacityAnim, {
                toValue: isFocused ? 1 : 0,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.spring(translateYAnim, {
                toValue: isFocused ? -2 : 0,
                useNativeDriver: true,
                tension: 200,
                friction: 12,
            }),
        ]).start();
    }, [isFocused]);

    return (
        <TouchableOpacity
            onPress={onPress}
            onLongPress={onLongPress}
            activeOpacity={0.7}
            style={styles.tabItem}
            accessibilityRole="button"
            accessibilityState={{ selected: isFocused }}
            accessibilityLabel={config.label}
        >
            <Animated.View
                style={[
                    styles.tabItemInner,
                    { transform: [{ scale: scaleAnim }, { translateY: translateYAnim }] },
                ]}
            >
                {/* Active pill background */}
                <Animated.View style={[styles.activePill, { opacity: opacityAnim }]}>
                    {/* <LinearGradient
                        colors={['#2F6BFF', '#1E4ED8']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={StyleSheet.absoluteFill}
                    /> */}
                </Animated.View>

                {/* Icon */}
                <View style={styles.iconContainer}>
                    <Ionicons
                        name={isFocused ? config.activeIcon : config.icon}
                        size={22}
                        color={isFocused ? '#2F6BFF' : 'rgba(80,100,160,0.7)'}

                    />
                    {/* Badge */}
                    {config.badge != null && config.badge > 0 && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>
                                {config.badge > 99 ? '99+' : config.badge}
                            </Text>
                        </View>
                    )}
                </View>

                {/* Label */}
                <Text
                    style={[
                        styles.tabLabel,
                        isFocused ? styles.tabLabelActive : styles.tabLabelInactive,
                    ]}
                    numberOfLines={1}
                >
                    {config.label}
                </Text>
            </Animated.View>
        </TouchableOpacity>
    );
}

// ─── Custom Tab Bar ───────────────────────────────────────────────────────────

export default function CustomTabBar({ state, descriptors, navigation }: any) {
    const insets = useSafeAreaInsets();

    // Only render visible tabs (those in TAB_CONFIG)
    const visibleRoutes = state.routes.filter((r: any) => TAB_CONFIG[r.name]);

    return (
        <View
            style={[
                styles.container,
                { bottom: Math.max(insets.bottom, 12) },
            ]}
            pointerEvents="box-none"
        >
            {/* Glassmorphic card */}
            <View style={styles.card}>
                {Platform.OS === 'ios' ? (
                    <BlurView intensity={60} tint="light" style={StyleSheet.absoluteFill} />
                ) : (
                    <View style={[StyleSheet.absoluteFill, styles.androidBlur]} />
                )}

                {/* Subtle top border shine */}
                <View style={styles.topShine} />

                {/* Tab row */}
                <View style={styles.tabRow}>
                    {visibleRoutes.map((route: any) => {
                        const routeIndex = state.routes.findIndex((r: any) => r.key === route.key);
                        const isFocused = state.index === routeIndex;

                        const onPress = () => {
                            const event = navigation.emit({
                                type: 'tabPress',
                                target: route.key,
                                canPreventDefault: true,
                            });
                            if (!isFocused && !event.defaultPrevented) {
                                navigation.navigate(route.name);
                            }
                        };

                        const onLongPress = () => {
                            navigation.emit({
                                type: 'tabLongPress',
                                target: route.key,
                            });
                        };

                        return (
                            <TabItem
                                key={route.key}
                                routeName={route.name}
                                isFocused={isFocused}
                                onPress={onPress}
                                onLongPress={onLongPress}
                            />
                        );
                    })}
                </View>
            </View>
        </View>
    );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const TAB_BAR_WIDTH = SCREEN_WIDTH * 0.94;

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: (SCREEN_WIDTH - TAB_BAR_WIDTH) / 2,
        width: TAB_BAR_WIDTH,
        zIndex: 100,
    },
    card: {
        borderRadius: 28,
        overflow: 'hidden',
        backgroundColor: 'rgba(255, 255, 255, 0.88)',
        // Elevation shadow (Android)
        elevation: 20,
        // Shadow (iOS)
        shadowColor: '#2F6BFF',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.18,
        shadowRadius: 24,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.9)',
    },
    androidBlur: {
        backgroundColor: 'rgba(245, 247, 255, 0.92)',
    },
    topShine: {
        position: 'absolute',
        top: 0,
        left: 20,
        right: 20,
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.95)',
        borderRadius: 1,
    },
    tabRow: {
        flexDirection: 'row',
        paddingHorizontal: 8,
        paddingVertical: 10,
        alignItems: 'center',
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
    },
    tabItemInner: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
        borderRadius: 18,
        minWidth: 56,
        gap: 3,
    },
    activePill: {
        ...StyleSheet.absoluteFill,
        borderRadius: 18,
        overflow: 'hidden',
    },
    iconContainer: {
        position: 'relative',
    },
    badge: {
        position: 'absolute',
        top: -5,
        right: -8,
        minWidth: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: '#FF4458',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 3,
        borderWidth: 1.5,
        borderColor: 'white',
    },
    badgeText: {
        color: 'white',
        fontSize: 8,
        fontFamily: TYPOGRAPHY.bold,
        lineHeight: 12,
    },
    tabLabel: {
        fontSize: 9.5,
        fontFamily: TYPOGRAPHY.medium,
        letterSpacing: 0.1,
    },
    tabLabelActive: {
        color: '#2F6BFF',
        fontFamily: TYPOGRAPHY.semibold,
    },
    tabLabelInactive: {
        color: 'rgba(80,100,160,0.65)',
    },
});

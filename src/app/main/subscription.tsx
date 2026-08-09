import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Animated,
    Dimensions,
    Platform,
    Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { COLORS, TYPOGRAPHY } from '@/constants/theme';
import usePaymentService from '@/hooks/services/usePaymentService';
import useProfileService from '@/hooks/services/useProfileService';
import RazorpayCheckout from 'react-native-razorpay';
const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── Plan Data ────────────────────────────────────────────────────────────────

const PLANS = [
    {
        id: 'free',
        name: 'Free',
        badge: null,
        price: '₹0',
        period: 'Forever',
        color: ['#2A3A7A', '#1A2461'] as const,
        borderColor: 'rgba(255,255,255,0.12)',
        features: [
            { icon: 'heart-outline', label: '10 likes per day', included: true },
            { icon: 'location-outline', label: 'Nearby discovery', included: true },
            { icon: 'eye-outline', label: 'See who liked you', included: false },
            { icon: 'flash-outline', label: 'Unlimited super likes', included: false },
            { icon: 'refresh-outline', label: 'Rewind last swipe', included: false },
            { icon: 'shield-checkmark-outline', label: 'Priority in discovery', included: false },
            { icon: 'chatbubble-outline', label: 'Message before match', included: false },
        ],
    },
    {
        id: 'gold',
        name: 'MetroGold',
        badge: 'Most Popular',
        price: '₹499',
        period: 'per month',
        color: ['#C8952A', '#8B5E0A'] as const,
        borderColor: 'rgba(200,149,42,0.6)',
        features: [
            { icon: 'heart-outline', label: 'Unlimited likes', included: true },
            { icon: 'location-outline', label: 'Nearby discovery', included: true },
            { icon: 'eye-outline', label: 'See who liked you', included: true },
            { icon: 'flash-outline', label: '5 super likes per day', included: true },
            { icon: 'refresh-outline', label: 'Rewind last swipe', included: true },
            { icon: 'shield-checkmark-outline', label: 'Priority in discovery', included: false },
            { icon: 'chatbubble-outline', label: 'Message before match', included: false },
        ],
    },
    {
        id: 'platinum',
        name: 'MetroPlatinum',
        badge: 'Best Value',
        price: '₹899',
        period: 'per month',
        color: ['#5C3DD8', '#1A42D9'] as const,
        borderColor: 'rgba(110,168,255,0.6)',
        features: [
            { icon: 'heart-outline', label: 'Unlimited likes', included: true },
            { icon: 'location-outline', label: 'Nearby discovery', included: true },
            { icon: 'eye-outline', label: 'See who liked you', included: true },
            { icon: 'flash-outline', label: 'Unlimited super likes', included: true },
            { icon: 'refresh-outline', label: 'Rewind last swipe', included: true },
            { icon: 'shield-checkmark-outline', label: 'Priority in discovery', included: true },
            { icon: 'chatbubble-outline', label: 'Message before match', included: true },
        ],
    },
];

// ─── Feature Row ─────────────────────────────────────────────────────────────

function FeatureRow({
    icon,
    label,
    included,
}: {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    included: boolean;
}) {
    return (
        <View style={styles.featureRow}>
            <Ionicons
                name={included ? 'checkmark-circle' : 'close-circle-outline'}
                size={18}
                color={included ? '#4CAF50' : 'rgba(255,255,255,0.25)'}
            />
            <Text style={[styles.featureText, !included && styles.featureTextOff]}>
                {label}
            </Text>
        </View>
    );
}

// ─── Plan Card ───────────────────────────────────────────────────────────────

function PlanCard({
    plan,
    selected,
    onSelect,
}: {
    plan: typeof PLANS[0];
    selected: boolean;
    onSelect: () => void;
}) {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true, speed: 30 }).start();
    };
    const handlePressOut = () => {
        Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 30 }).start();
    };

    return (
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={onSelect}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
            >
                <View
                    style={[
                        styles.planCard,
                        { borderColor: selected ? plan.borderColor : 'rgba(255,255,255,0.1)' },
                        selected && styles.planCardSelected,
                    ]}
                >
                    {/* Header gradient */}
                    <LinearGradient colors={plan.color} style={styles.planHeader}>
                        <View style={styles.planHeaderTop}>
                            <Text style={styles.planName}>{plan.name}</Text>
                            {plan.badge && (
                                <View style={styles.badgePill}>
                                    <Text style={styles.badgeText}>{plan.badge}</Text>
                                </View>
                            )}
                        </View>
                        <View style={styles.priceRow}>
                            <Text style={styles.priceText}>{plan.price}</Text>
                            <Text style={styles.periodText}> / {plan.period}</Text>
                        </View>
                    </LinearGradient>

                    {/* Features */}
                    <View style={styles.featuresWrap}>
                        {plan.features.map((f) => (
                            <FeatureRow
                                key={f.label}
                                icon={f.icon as keyof typeof Ionicons.glyphMap}
                                label={f.label}
                                included={f.included}
                            />
                        ))}
                    </View>

                    {/* Selected indicator */}
                    {selected && (
                        <View style={styles.selectedDot}>
                            <Ionicons name="checkmark-circle" size={22} color="#4CAF50" />
                        </View>
                    )}
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function SubscriptionScreen() {
    const [selected, setSelected] = useState<string>('gold');

    const selectedPlan = PLANS.find((p) => p.id === selected)!;
    const { createPaymentOrder, verifyPayment, cancelPayment } = usePaymentService({});
    const { myProfile } = useProfileService({})

    const makePaymnet = async (planId: string) => {
        setSelected(planId);
        const order = await createPaymentOrder({ planId: 'eec7f39d-f6f6-42aa-b37d-1b389c49ff55' });
        // console.log('order', order)


        const options = {
            key: order.key,
            amount: order.amount,
            currency: order.currency,
            name: 'MetroGold',
            description: 'Includes Chat',
            order_id: order.orderId,
            // prefill: {
            //     email: 'one@gmail.com',
            //     contact: '+919947711917',
            //     name: "One",
            // },
            // theme: { color: '#2563EB' },
        };


        try {
            const payment: any = await RazorpayCheckout.open(options).catch((error) => {
                console.log('error', error)
            });

            await verifyPayment({
                planId: 'eec7f39d-f6f6-42aa-b37d-1b389c49ff55',
                razorpayOrderId: payment.razorpay_order_id,
                razorpayPaymentId: payment.razorpay_payment_id,
                razorpaySignature: payment.razorpay_signature,
            });

            Alert.alert(
                'Success',
                'Premium Activated',
            );
        } catch (error) {
            Alert.alert(
                `Payment Cancelled: ${error}`,
            );
            cancelPayment({ orderId: order.orderId })
        }

    }

    return (
        <LinearGradient
            colors={[COLORS.backgroundStart, COLORS.backgroundMiddle, COLORS.backgroundEnd]}
            style={StyleSheet.absoluteFill}
        >
            <SafeAreaView style={styles.container} edges={['top']}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backBtn}
                        onPress={() => router.back()}
                        hitSlop={12}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="arrow-back" size={22} color="white" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Upgrade Plan</Text>
                    <View style={{ width: 40 }} />
                </View>

                {/* Hero blurb */}
                <View style={styles.heroWrap}>
                    <Text style={styles.heroEmoji}>🚇✨</Text>
                    <Text style={styles.heroTitle}>Find Your Metro Match</Text>
                    <Text style={styles.heroSub}>
                        Unlock premium features and connect with more commuters on your route.
                    </Text>
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scroll}
                >
                    {PLANS.map((plan) => (
                        <PlanCard
                            key={plan.id}
                            plan={plan}
                            selected={selected === plan.id}
                            onSelect={() => makePaymnet(plan.id)}
                        />
                    ))}

                    {/* Fine print */}
                    <Text style={styles.finePrint}>
                        Cancel anytime. Subscriptions renew automatically each month. Prices are in INR and include applicable taxes.
                    </Text>

                    <View style={{ height: 120 }} />
                </ScrollView>

                {/* CTA bar */}
                <View style={styles.ctaBar}>
                    {selected === 'free' ? (
                        <TouchableOpacity style={styles.ctaFree} activeOpacity={0.7} onPress={() => router.back()}>
                            <Text style={styles.ctaFreeText}>Continue with Free</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity activeOpacity={0.85} onPress={() => { }}>
                            <LinearGradient
                                colors={selectedPlan.color}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.ctaGradient}
                            >
                                <Ionicons name="flash" size={20} color="white" />
                                <Text style={styles.ctaText}>
                                    Get {selectedPlan.name} — {selectedPlan.price}/mo
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    )}
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        color: 'white',
        fontFamily: TYPOGRAPHY.bold,
        fontSize: 17,
    },

    // Hero
    heroWrap: {
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingBottom: 20,
        paddingTop: 4,
    },
    heroEmoji: {
        fontSize: 36,
        marginBottom: 8,
    },
    heroTitle: {
        color: 'white',
        fontFamily: TYPOGRAPHY.bold,
        fontSize: 22,
        marginBottom: 6,
        textAlign: 'center',
    },
    heroSub: {
        color: 'rgba(255,255,255,0.55)',
        fontFamily: TYPOGRAPHY.regular,
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
    },

    // Scroll
    scroll: {
        paddingHorizontal: 16,
        gap: 14,
    },

    // Plan card
    planCard: {
        borderRadius: 20,
        borderWidth: 1.5,
        overflow: 'hidden',
        backgroundColor: 'rgba(255,255,255,0.05)',
        position: 'relative',
    },
    planCardSelected: {
        shadowColor: '#6EA8FF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    planHeader: {
        paddingHorizontal: 18,
        paddingVertical: 16,
    },
    planHeaderTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    planName: {
        color: 'white',
        fontFamily: TYPOGRAPHY.bold,
        fontSize: 18,
    },
    badgePill: {
        backgroundColor: 'rgba(255,255,255,0.25)',
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 3,
    },
    badgeText: {
        color: 'white',
        fontFamily: TYPOGRAPHY.semibold,
        fontSize: 11,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    priceText: {
        color: 'white',
        fontFamily: TYPOGRAPHY.bold,
        fontSize: 28,
    },
    periodText: {
        color: 'rgba(255,255,255,0.7)',
        fontFamily: TYPOGRAPHY.regular,
        fontSize: 13,
    },

    // Features
    featuresWrap: {
        paddingHorizontal: 18,
        paddingVertical: 14,
        gap: 10,
    },
    featureRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    featureText: {
        color: 'rgba(255,255,255,0.9)',
        fontFamily: TYPOGRAPHY.regular,
        fontSize: 14,
    },
    featureTextOff: {
        color: 'rgba(255,255,255,0.3)',
        textDecorationLine: 'line-through',
    },

    // Selected checkmark
    selectedDot: {
        position: 'absolute',
        top: 14,
        right: 14,
    },

    // Fine print
    finePrint: {
        color: 'rgba(255,255,255,0.3)',
        fontFamily: TYPOGRAPHY.regular,
        fontSize: 11,
        textAlign: 'center',
        lineHeight: 16,
        paddingHorizontal: 12,
        marginTop: 4,
    },

    // CTA
    ctaBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 20,
        paddingBottom: Platform.OS === 'ios' ? 34 : 20,
        paddingTop: 16,
        backgroundColor: 'rgba(7,22,80,0.9)',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.1)',
    },
    ctaGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        paddingVertical: 16,
        borderRadius: 16,
    },
    ctaText: {
        color: 'white',
        fontFamily: TYPOGRAPHY.bold,
        fontSize: 16,
    },
    ctaFree: {
        alignItems: 'center',
        paddingVertical: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    ctaFreeText: {
        color: 'rgba(255,255,255,0.6)',
        fontFamily: TYPOGRAPHY.medium,
        fontSize: 15,
    },
});

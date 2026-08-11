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
    ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from 'expo-router';
import { COLORS, TYPOGRAPHY } from '@/constants/theme';
import usePaymentService from '@/hooks/services/usePaymentService';
import RazorpayCheckout from 'react-native-razorpay';
import useSubscriptionService, { SubscriptionPlan } from '@/hooks/services/useSubscriptionService';
import { responsiveSize } from '@/utils/responsive';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Pick a gradient palette based on plan index so each card looks distinct */
const PLAN_PALETTES: Array<{ colors: [string, string]; borderColor: string }> = [
    { colors: ['#2A3A7A', '#1A2461'], borderColor: 'rgba(110,168,255,0.5)' },
    { colors: ['#C8952A', '#8B5E0A'], borderColor: 'rgba(200,149,42,0.6)' },
    { colors: ['#5C3DD8', '#1A42D9'], borderColor: 'rgba(92,61,216,0.6)' },
    { colors: ['#1A7A5E', '#0A4A38'], borderColor: 'rgba(26,122,94,0.6)' },
];

function getPalette(index: number) {
    return PLAN_PALETTES[index % PLAN_PALETTES.length];
}

function formatPrice(price: number) {
    return `₹${Number(price).toLocaleString('en-IN')}`;
}

// ─── Feature Row ──────────────────────────────────────────────────────────────

function FeatureRow({
    icon,
    label,
}: {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
}) {
    return (
        <View style={styles.featureRow}>
            <Ionicons name={icon} size={16} color={COLORS.primaryLight} />
            <Text style={styles.featureText}>{label}</Text>
        </View>
    );
}

// ─── Plan Card ────────────────────────────────────────────────────────────────

function PlanCard({
    plan,
    index,
    onBuy,
    loading,
}: {
    plan: SubscriptionPlan;
    index: number;
    onBuy: (planId: string) => void;
    loading: boolean;
}) {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const palette = getPalette(index);

    const handlePressIn = () =>
        Animated.spring(scaleAnim, { toValue: 0.98, useNativeDriver: true, speed: 30 }).start();
    const handlePressOut = () =>
        Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 30 }).start();

    const durationLabel =
        plan.durationDays >= 365
            ? `${Math.round(plan.durationDays / 365)} year`
            : plan.durationDays >= 30
                ? `${Math.round(plan.durationDays / 30)} month`
                : `${plan.durationDays} days`;

    return (
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <View
                style={[
                    styles.planCard,
                    { borderColor: palette.borderColor },
                ]}
            >
                {/* Header gradient */}
                <LinearGradient colors={palette.colors} style={styles.planHeader}>
                    <View style={styles.planHeaderTop}>
                        <View>
                            <Text style={styles.planName}>{formatPrice(plan.price)}</Text>
                            <Text style={styles.durationLabel}>Valid for {durationLabel}</Text>
                        </View>
                        <View style={styles.creditsCircle}>
                            <Text style={styles.creditsNumber}>{plan.credits}</Text>
                            <Text style={styles.creditsLabel}>Credits</Text>
                        </View>
                    </View>
                </LinearGradient>

                {/* Feature list */}
                <View style={styles.featuresWrap}>
                    <FeatureRow icon="heart-outline" label={`${plan.noOfLikes} likes included`} />
                    <FeatureRow icon="git-branch-outline" label={`${plan.noOfExtensions} profile extensions`} />
                    <FeatureRow icon="flash-outline" label={`${plan.credits} credits`} />
                    <FeatureRow icon="calendar-outline" label={`Active for ${durationLabel}`} />
                </View>

                {/* Buy Now button */}
                <View style={styles.buyWrap}>
                    <TouchableOpacity
                        activeOpacity={0.85}
                        onPressIn={handlePressIn}
                        onPressOut={handlePressOut}
                        onPress={() => onBuy(plan.id)}
                        disabled={loading}
                        style={styles.buyBtn}
                    >
                        <LinearGradient
                            colors={palette.colors}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.buyBtnGradient}
                        >
                            {loading ? (
                                <ActivityIndicator size="small" color="white" />
                            ) : (
                                <>
                                    <Ionicons name="flash" size={16} color="white" />
                                    <Text style={styles.buyBtnText}>
                                        Buy Now · {formatPrice(plan.price)}
                                    </Text>
                                </>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>
        </Animated.View>
    );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function PlanListScreen() {
    const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);
    const navigate = useNavigation();

    const { createPaymentOrder, verifyPayment, cancelPayment } = usePaymentService({});
    const { subscriptionPlans, isSubscriptionPlansLoading, refetchCredits } = useSubscriptionService();

    const makePayment = async (planId: string) => {
        setLoadingPlanId(planId);
        try {
            const order = await createPaymentOrder({ planId });

            const options = {
                key: order.key,
                amount: order.amount,
                currency: order.currency,
                name: 'MetroMatch',
                description: 'Subscription Plan',
                order_id: order.orderId,
            };

            const payment: any = await RazorpayCheckout.open(options).catch((error: any) => {
                console.log('Razorpay error', error);
            });

            if (!payment) throw new Error('Payment cancelled');

            await verifyPayment({
                planId,
                razorpayOrderId: payment.razorpay_order_id,
                razorpayPaymentId: payment.razorpay_payment_id,
                razorpaySignature: payment.razorpay_signature,
            });
            refetchCredits();
            navigate.goBack();
            Alert.alert('Success 🎉', 'Your plan is now active!');
        } catch (error) {
            Alert.alert('Payment Cancelled', 'Your payment was not completed.');
            cancelPayment({ orderId: '' });
        } finally {
            setLoadingPlanId(null);
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backBtn}
                    onPress={() => navigate.goBack()}
                    hitSlop={12}
                    activeOpacity={0.8}
                >
                    <Ionicons name="arrow-back" size={22} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Get More Credits</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scroll}
            >
                {/* Hero — credit costs card */}
                <View style={styles.heroCard}>
                    <View style={styles.heroCardHeader}>
                        <Ionicons name="flash" size={18} color={COLORS.primaryLight} />
                        <Text style={styles.heroCardTitle}>How Credits Work</Text>
                    </View>

                    <View style={styles.heroCardDivider} />

                    <View style={styles.creditRow}>
                        <View style={styles.creditIconWrap}>
                            <Ionicons name="time-outline" size={18} color="#FFD166" />
                        </View>
                        <View style={styles.creditInfo}>
                            <Text style={styles.creditAction}>Extend session</Text>
                            <Text style={styles.creditDesc}>+10 min on your current commute</Text>
                        </View>
                        <View style={styles.creditCostPill}>
                            <Text style={styles.creditCostText}>10 credits</Text>
                        </View>
                    </View>

                    <View style={styles.creditRow}>
                        <View style={[styles.creditIconWrap, { backgroundColor: 'rgba(255,107,107,0.15)' }]}>
                            <Ionicons name="heart-outline" size={18} color="#FF6B6B" />
                        </View>
                        <View style={styles.creditInfo}>
                            <Text style={styles.creditAction}>Like a profile</Text>
                            <Text style={styles.creditDesc}>Send a like to someone nearby</Text>
                        </View>
                        <View style={[styles.creditCostPill, { backgroundColor: 'rgba(255,107,107,0.18)', borderColor: 'rgba(255,107,107,0.4)' }]}>
                            <Text style={[styles.creditCostText, { color: '#FF6B6B' }]}>2 credits</Text>
                        </View>
                    </View>
                </View>

                {/* Plans */}
                {isSubscriptionPlansLoading ? (
                    <View style={styles.loadingWrap}>
                        <ActivityIndicator size="large" color={COLORS.primaryLight} />
                        <Text style={styles.loadingText}>Loading plans…</Text>
                    </View>
                ) : (
                    (subscriptionPlans ?? []).map((plan, index) => (
                        <PlanCard
                            key={plan.id}
                            plan={plan}
                            index={index}
                            onBuy={() => makePayment(plan.id)}
                            loading={loadingPlanId === plan.id}
                        />
                    ))
                )}

                {/* Fine print */}
                <Text style={styles.finePrint}>
                    Prices are in INR and include applicable taxes. Credits do not expire with your plan period.
                </Text>

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
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

    // Hero card
    heroCard: {
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: 18,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.14)',
        padding: 16,
        gap: 12,
    },
    heroCardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    heroCardTitle: {
        color: 'white',
        fontFamily: TYPOGRAPHY.semibold,
        fontSize: 15,
    },
    heroCardDivider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    creditRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    creditIconWrap: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: 'rgba(255,209,102,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    creditInfo: {
        flex: 1,
        gap: 2,
    },
    creditAction: {
        color: 'white',
        fontFamily: TYPOGRAPHY.semibold,
        fontSize: 13,
    },
    creditDesc: {
        color: 'rgba(255,255,255,0.5)',
        fontFamily: TYPOGRAPHY.regular,
        fontSize: 12,
    },
    creditCostPill: {
        backgroundColor: 'rgba(110,168,255,0.18)',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(110,168,255,0.4)',
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    creditCostText: {
        color: COLORS.primaryLight,
        fontFamily: TYPOGRAPHY.semibold,
        fontSize: 12,
    },

    // Scroll
    scroll: {
        paddingHorizontal: 16,
        gap: 16,
    },

    // Plan card
    planCard: {
        borderRadius: 20,
        borderWidth: 1.5,
        overflow: 'hidden',
        backgroundColor: 'rgba(255,255,255,0.06)',
    },
    planHeader: {
        paddingHorizontal: 18,
        paddingVertical: 18,
    },
    planHeaderTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    planName: {
        color: 'white',
        fontFamily: TYPOGRAPHY.bold,
        fontSize: 26,
        marginBottom: 2,
    },
    durationLabel: {
        color: 'rgba(255,255,255,0.65)',
        fontFamily: TYPOGRAPHY.regular,
        fontSize: 13,
    },
    creditsCircle: {
        width: responsiveSize(64),
        height: responsiveSize(64),
        borderRadius: responsiveSize(32),
        backgroundColor: 'rgba(255,255,255,0.18)',
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.35)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    creditsNumber: {
        color: 'white',
        fontFamily: TYPOGRAPHY.bold,
        fontSize: 20,
        lineHeight: 22,
    },
    creditsLabel: {
        color: 'rgba(255,255,255,0.7)',
        fontFamily: TYPOGRAPHY.regular,
        fontSize: 10,
    },

    // Features
    featuresWrap: {
        paddingHorizontal: 18,
        paddingTop: 14,
        paddingBottom: 6,
        gap: 10,
    },
    featureRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    featureText: {
        color: 'rgba(255,255,255,0.85)',
        fontFamily: TYPOGRAPHY.regular,
        fontSize: 14,
    },

    // Buy button
    buyWrap: {
        paddingHorizontal: 18,
        paddingVertical: 14,
    },
    buyBtn: {
        borderRadius: 14,
        overflow: 'hidden',
    },
    buyBtnGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 14,
        borderRadius: 14,
    },
    buyBtnText: {
        color: 'white',
        fontFamily: TYPOGRAPHY.bold,
        fontSize: 15,
    },

    // Loading
    loadingWrap: {
        alignItems: 'center',
        paddingVertical: 40,
        gap: 12,
    },
    loadingText: {
        color: 'rgba(255,255,255,0.5)',
        fontFamily: TYPOGRAPHY.regular,
        fontSize: 14,
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
});

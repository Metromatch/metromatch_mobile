import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
} from 'react-native';
import { BlurView } from 'expo-blur';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS, TYPOGRAPHY } from '@/constants/theme';
import { responsiveSize } from '@/utils/responsive';
import GlassmorphicCard from '@/components/general/molecules/glass_morphic_card';

// ─── Types ────────────────────────────────────────────────────────────────────
export interface CompletionItem {
    label: string;
    done: boolean;
}

export interface ProfileCompletionCardProps {
    score: number;
    items: CompletionItem[];
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function ProfileCompletionCard({ score, items }: ProfileCompletionCardProps) {
    const [expanded, setExpanded] = useState(false);
    const anim = useRef(new Animated.Value(0)).current;

    const toggle = () => {
        setExpanded((v) => !v);
        Animated.timing(anim, {
            toValue: expanded ? 0 : 1,
            duration: 250,
            useNativeDriver: false,
        }).start();
    };

    const barColor = score >= 80 ? '#22C55E' : score >= 50 ? '#F59E0B' : COLORS.primary;

    return (
        <TouchableOpacity onPress={toggle} activeOpacity={0.9} style={styles.card}>
            <GlassmorphicCard intensity={30} style={styles.inner}>
                {/* Top row: title + shield icon */}
                <View style={styles.top}>
                    <View>
                        <Text style={styles.title}>Profile Strength</Text>
                        <Text style={styles.scoreText}>{score}% Complete</Text>
                    </View>
                    <View style={styles.badge}>
                        {score >= 80 ? (
                            <Ionicons name="shield-checkmark" size={28} color="#22C55E" />
                        ) : (
                            <Ionicons name="shield-half" size={28} color={COLORS.primaryLight} />
                        )}
                    </View>
                </View>

                {/* Progress bar */}
                <View style={styles.progressBg}>
                    <Animated.View
                        style={[
                            styles.progressFill,
                            { width: `${score}%` as any, backgroundColor: barColor },
                        ]}
                    />
                </View>

                {/* Expandable item list */}
                {expanded && (
                    <View style={styles.list}>
                        {items.map((item) => (
                            <View key={item.label} style={styles.listItem}>
                                <Ionicons
                                    name={item.done ? 'checkmark-circle' : 'ellipse-outline'}
                                    size={16}
                                    color={item.done ? '#22C55E' : COLORS.textSecondary}
                                />
                                <Text style={[styles.listItemText, !item.done && styles.listItemMuted]}>
                                    {item.label}
                                </Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* Footer toggle hint */}
                <View style={styles.footer}>
                    <Ionicons
                        name={expanded ? 'chevron-up' : 'chevron-down'}
                        size={14}
                        color="rgba(255,255,255,0.5)"
                    />
                    <Text style={styles.hint}>{expanded ? 'Hide details' : 'Tap to see details'}</Text>
                </View>
            </GlassmorphicCard>
        </TouchableOpacity>
    );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    card: {
        borderRadius: responsiveSize(18),
        overflow: 'hidden',
    },
    inner: {
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.12)',
        borderRadius: 18,
    },
    top: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    title: {
        fontFamily: TYPOGRAPHY.medium,
        fontSize: 12,
        color: 'rgba(255,255,255,0.6)',
        marginBottom: 2,
    },
    scoreText: {
        fontFamily: TYPOGRAPHY.bold,
        fontSize: 18,
        color: 'white',
    },
    badge: {
        padding: 4,
    },
    progressBg: {
        height: 6,
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: 3,
        marginBottom: 8,
    },
    progressFill: {
        height: '100%',
        borderRadius: 3,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        marginTop: 4,
    },
    hint: {
        fontFamily: TYPOGRAPHY.regular,
        fontSize: 11,
        color: 'rgba(255,255,255,0.4)',
    },
    list: {
        marginTop: 12,
        gap: 8,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    listItemText: {
        fontFamily: TYPOGRAPHY.regular,
        fontSize: 13,
        color: 'rgba(255,255,255,0.8)',
    },
    listItemMuted: {
        color: 'rgba(255,255,255,0.4)',
    },
});

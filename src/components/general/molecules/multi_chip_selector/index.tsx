import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { responsiveSize } from '@/utils/responsive';
import { COLORS, TYPOGRAPHY } from '@/constants/theme';
import Label from '@/components/general/molecules/label';
import { Span } from '@/components/general/atoms/span';

export interface ChipOption {
    label: string;
    value: string;
    icon?: keyof typeof Ionicons.glyphMap;
    iconColor?: string;
}

interface ChipSelectorProps {
    label?: string;
    required?: boolean;
    options: ChipOption[];
    value: string[] | null;
    onChange: (value: string[]) => void;
    style?: ViewStyle;
    chipStyle?: ViewStyle;
    activeIconMode?: 'check' | 'none';
    direction?: 'horizontal' | 'vertical';
    error?: string;
}

const MultiChipSelector: React.FC<ChipSelectorProps> = ({
    label, required, options, value = [], onChange, style, chipStyle, activeIconMode = 'none', direction = 'horizontal', error
}) => {
    const handleChipPress = (chipValue: string) => {
        let newSelectedValues: string[];
        if (value?.includes(chipValue)) {
            newSelectedValues = value.filter((v) => v !== chipValue);
        } else {
            newSelectedValues = [...(value || []), chipValue];
        }
        onChange(newSelectedValues);
    };
    return (
        <View style={[styles.container, style]}>
            {label && <Label text={label} required={required} />}
            <View style={[styles.chipContainer, {
                flexDirection: direction === 'horizontal' ? 'row' : 'column',
                flexWrap: direction === 'horizontal' ? 'wrap' : 'nowrap',
            }]}>
                {options.map((option) => {
                    const isActive = value?.includes(option.value);
                    return (
                        <TouchableOpacity
                            key={option.value}
                            activeOpacity={0.7}
                            style={[
                                styles.chip,
                                chipStyle,
                                isActive ? styles.activeChip : styles.inactiveChip,
                            ]}
                            onPress={() => handleChipPress(option.value)}
                        >
                            <View style={styles.chipContent}>
                                {option.icon && activeIconMode === 'none' && (
                                    <Ionicons
                                        name={option.icon}
                                        size={responsiveSize(16)}
                                        color={isActive ? '#FFF' : option.iconColor}
                                        style={styles.iconLeft}
                                    />
                                )}
                                <Text style={[
                                    styles.chipText,
                                    isActive ? styles.activeText : styles.inactiveText
                                ]}>
                                    {option.label}
                                </Text>
                            </View>
                            {isActive && activeIconMode === 'check' && (
                                <Ionicons
                                    name="checkmark-circle"
                                    size={responsiveSize(18)}
                                    color={COLORS.white}
                                />
                            )}
                        </TouchableOpacity>
                    );
                })}
            </View>
            {error && (
                <Span text={error} style={styles.error} />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        // marginBottom: responsiveSize(15),
    },
    chipContainer: {
        // flexDirection: 'row',
        // flexWrap: 'wrap',
        gap: responsiveSize(10),
    },
    chip: {
        borderRadius: responsiveSize(10),
        paddingVertical: responsiveSize(6),
        paddingHorizontal: responsiveSize(16),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        flexGrow: 1
    },
    activeChip: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    inactiveChip: {
        backgroundColor: '#FFFF',
        borderColor: '#EAEAEA',
    },
    chipContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconLeft: {
        marginRight: responsiveSize(6),
    },
    chipText: {
        fontFamily: TYPOGRAPHY.medium,
        fontSize: responsiveSize(13),
    },
    activeText: {
        color: COLORS.white,
    },
    inactiveText: {
        color: COLORS.textPrimary,
    },
    error: {
        paddingLeft: responsiveSize(2),
        color: 'red',
        marginTop: responsiveSize(4),
    },
});

export default MultiChipSelector;

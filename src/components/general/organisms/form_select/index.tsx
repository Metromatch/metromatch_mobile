import React, { useState } from 'react';
import { TouchableOpacity, ViewStyle, View, StyleSheet, ScrollView, Text, Pressable } from 'react-native';
import FormInput from '@/components/general/atoms/form_input';
import { Ionicons } from '@expo/vector-icons';
import { responsiveSize } from '@/utils/responsive';
import { COLORS, TYPOGRAPHY } from '@/constants/theme';
import BottomSheet from '@/components/general/organisms/bottom_sheet';
import { B2 } from '@/components/general/atoms/body_text';
import Label from '@/components/general/molecules/label';
import { Span } from '@/components/general/atoms/span';

export interface SelectionOption {
    label: string;
    value: string | number;
}
interface FormSelectProps {
    label?: string;
    placeholder: string;
    value: string | null | number;
    containerStyle?: ViewStyle;
    flex1?: boolean;
    icon?: keyof typeof Ionicons.glyphMap;
    options: SelectionOption[];
    onChange: (value: string | number | null) => void;
    required?: boolean
    error?: string
    labelColor?: string
}

const FormSelect = ({ label, placeholder, value, onChange, containerStyle, flex1, icon, options, required, error, labelColor }: FormSelectProps) => {
    const [isVisible, setIsVisible] = useState(false);

    const renderOption = (option: SelectionOption) => {
        const isSelected = value === option.value;
        return (
            <TouchableOpacity
                key={option.value}
                activeOpacity={0.7}
                style={[
                    styles.optionContainer,
                    isSelected ? styles.optionSelected : styles.optionUnselected
                ]}
                onPress={() => {
                    onChange(option.value);
                    setTimeout(() => {
                        setIsVisible(false);
                    }, 200);
                }}
            >
                <Text style={[
                    styles.optionText,
                    isSelected ? styles.optionTextSelected : styles.optionTextUnselected
                ]}>
                    {option.label}
                </Text>
                {isSelected ? (
                    <View style={styles.radioSelected}>
                        <Ionicons name="checkmark" size={responsiveSize(12)} color="white" />
                    </View>
                ) : (
                    <View style={styles.radioUnselected} />
                )}
            </TouchableOpacity>
        );
    };
    return (
        <>
            <View style={[styles.container, flex1 ? { flex: 1 } : {}, containerStyle]}>
                {label && <Label text={label} required={required} textColor={labelColor} />}
                <TouchableOpacity activeOpacity={0.7} onPress={() => setIsVisible(true)} style={[styles.select]}>
                    {icon ? <Ionicons name={icon} size={responsiveSize(18)} color={COLORS.textSecondary} /> : undefined}
                    {value ? <B2 text={options.find((option) => option.value === value)?.label} flex1 numberOfLines={1} /> : <B2 text={placeholder} textColor={COLORS.textSecondary} flex1 numberOfLines={1} />}
                    {value ? <Pressable onPress={() => onChange(null)} >
                        <Ionicons name="close-outline" size={responsiveSize(18)} color={COLORS.textSecondary} />
                    </Pressable> : <Ionicons name="chevron-down-outline" size={responsiveSize(18)} color={COLORS.textSecondary} />}

                </TouchableOpacity>
                {error && (
                    <Span text={error} style={styles.error} />
                )}
            </View>
            {isVisible && (<BottomSheet
                isVisible
                onClose={() => setIsVisible(false)}
                title={`Select ${label}`}
            >
                <ScrollView
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {options.map(renderOption)}
                </ScrollView>
            </BottomSheet>)}
        </>
    );
};


const styles = StyleSheet.create({
    container: {
        position: 'relative'
    },
    select: {
        position: 'relative',
        backgroundColor: '#fff',
        borderRadius: responsiveSize(10),
        borderWidth: 1,
        borderColor: COLORS.border,
        height: responsiveSize(45),
        paddingHorizontal: responsiveSize(8),
        flexDirection: 'row',
        alignItems: 'center',
        gap: responsiveSize(4)
    },
    error: {
        paddingLeft: responsiveSize(2),
        color: 'red',
        // position: "absolute",
        // bottom: -responsiveSize(22)
    },

    scrollView: {
        maxHeight: responsiveSize(450), // Prevent it from taking entire screen
    },
    scrollContent: {
        gap: responsiveSize(8),
    },
    optionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: responsiveSize(10),
        paddingHorizontal: responsiveSize(20),
        borderRadius: responsiveSize(12),
        // marginBottom: responsiveSize(12),
        borderWidth: 1,
    },
    optionSelected: {
        backgroundColor: '#E8F0FE', // Light blue background
        borderColor: '#3B82F6', // Blue border
    },
    optionUnselected: {
        backgroundColor: '#FFFFFF',
        borderColor: '#F3F4F6', // Light gray border
    },
    optionText: {
        fontFamily: TYPOGRAPHY.medium,
        fontSize: responsiveSize(14),
    },
    optionTextSelected: {
        color: '#1A237E',
    },
    optionTextUnselected: {
        color: '#4B5563',
    },
    radioSelected: {
        width: responsiveSize(22),
        height: responsiveSize(22),
        borderRadius: responsiveSize(11),
        backgroundColor: '#3B82F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioUnselected: {
        width: responsiveSize(22),
        height: responsiveSize(22),
        borderRadius: responsiveSize(11),
        borderWidth: 2,
        borderColor: '#E5E7EB',
        backgroundColor: '#FFFFFF',
    },
});

export default FormSelect;

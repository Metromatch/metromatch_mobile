import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { responsiveSize } from '@/utils/responsive';
import { COLORS } from '@/constants/theme';

interface IconButtonProps {
    iconName: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
    containerStyle?: ViewStyle;
    iconColor?: string;
    iconSize?: number;
}

const IconButton = ({ iconName, onPress, containerStyle, iconColor = COLORS.textPrimary, iconSize = 24 }: IconButtonProps) => {
    return (
        <TouchableOpacity activeOpacity={0.7} style={[styles.button, containerStyle]} onPress={onPress}>
            <Ionicons name={iconName} size={responsiveSize(iconSize)} color={iconColor} />
        </TouchableOpacity>
    );
};

export default IconButton;

const styles = StyleSheet.create({
    button: {
        width: responsiveSize(50),
        height: responsiveSize(50),
        borderRadius: responsiveSize(16),
        backgroundColor: '#F5F7FA', // Light greyish background
        justifyContent: 'center',
        alignItems: 'center',
    },
});

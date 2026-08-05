import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { responsiveSize } from '@/utils/responsive';
import { B2 } from '../body_text';
import { COLORS, Colors } from '@/constants/theme';

interface SecondaryButtonProps {
    onPress: () => void;
    containerStyle?: ViewStyle;
    title: string
}

const SecondaryButton = ({ onPress, containerStyle, title }: SecondaryButtonProps) => {
    return (
        <TouchableOpacity activeOpacity={0.7} style={[styles.button, containerStyle]} onPress={onPress}>
            <B2 type="medium" text={title} />
        </TouchableOpacity>
    );
};

export default SecondaryButton;

const styles = StyleSheet.create({
    button: {
        // width: responsiveSize(50),
        // height: responsiveSize(50),
        borderRadius: responsiveSize(16),
        backgroundColor: 'white', // Light greyish background
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: COLORS.textSecondary,
        borderWidth: 1
    },
});

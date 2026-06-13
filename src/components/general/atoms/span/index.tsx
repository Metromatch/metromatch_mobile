import { COLORS, TYPOGRAPHY } from '@/constants/theme';
import { responsiveSize } from '@/utils/responsive';
import React from 'react';
import {
  StyleSheet,
  Text,
  TextProps,
  TextStyle,
} from 'react-native';

interface Properties extends TextProps {
  text?: string | number;
  type?: 'medium' | 'regular' | 'semibold' | 'bold';
  children?: React.ReactNode;
  style?: TextStyle;
  flex1?: boolean;
  textColor?: string
}

export const Span = ({
  text,
  type = 'regular',
  style,
  children,
  flex1,
  textColor,
  ...remaining
}: Properties) => {
  return (
    <Text
      // allowFontScaling={true}
      // maxFontSizeMultiplier={1.5}
      style={[styles.base, styles[type], flex1 && { flex: 1 }, { color: textColor || COLORS.textSecondary }, style]}
      {...remaining}
    >
      {text ?? children}
    </Text>
  );
};


const styles = StyleSheet.create({
  base: {
    fontSize: responsiveSize(13)
  },
  regular: {
    fontFamily: TYPOGRAPHY.regular
  },
  medium: {
    fontFamily: TYPOGRAPHY.medium
  },
  semibold: {
    fontFamily: TYPOGRAPHY.semibold
  },
  bold: {
    fontFamily: TYPOGRAPHY.bold
  },
});

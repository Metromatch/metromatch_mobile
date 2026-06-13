import { COLORS, TYPOGRAPHY } from '@/constants/theme'
import { responsiveSize } from '@/utils/responsive'
import React from 'react'
import { StyleSheet, Text, TextProps, TextStyle, StyleProp } from 'react-native'

interface Properties extends TextProps {
  text: string | number
  type?: 'medium' | 'regular' | 'bold' | 'semibold'
  style?: StyleProp<TextStyle>
}

export const H1 = ({ text, type = 'semibold', style, ...props }: Properties) => {
  return (
    <Text allowFontScaling={false} style={[styles.h1, styles[type], style]} {...props}>
      {text || ''}
    </Text>
  )
}

export const H2 = ({ text, type = 'semibold', style, ...props }: Properties) => {
  return (
    <Text allowFontScaling={false} style={[styles.h2, styles[type], style]} {...props}>
      {text || ''}
    </Text>
  )
}

export const H3 = ({ text, type = 'semibold', style, ...props }: Properties) => {
  return (
    <Text allowFontScaling={false} style={[styles.h3, styles[type], style]} {...props}>
      {text || ''}
    </Text>
  )
}

export const H4 = ({ text, type = 'semibold', style, ...props }: Properties) => {
  return (
    <Text allowFontScaling={false} style={[styles.h4, styles[type], style]} {...props}>
      {text || ''}
    </Text>
  )
}

export const H5 = ({ text, type = 'semibold', style, ...props }: Properties) => {
  return (
    <Text allowFontScaling={false} style={[styles.h5, styles[type], style]} {...props}>
      {text || ''}
    </Text>
  )
}

export const H6 = ({ text, type = 'semibold', style }: Properties) => {
  return (
    <Text allowFontScaling={false} style={[styles.h6, styles[type], style]}>
      {text || ''}
    </Text>
  )
}

const styles = StyleSheet.create({
  h1: {
    fontSize: responsiveSize(32),
    lineHeight: responsiveSize(39),
    color: COLORS.textSecondary,
  },
  h2: {
    fontSize: responsiveSize(24),
    lineHeight: responsiveSize(29),
    color: COLORS.textSecondary,
  },
  h3: {
    fontSize: responsiveSize(20),
    lineHeight: responsiveSize(24),
    color: COLORS.textSecondary,
  },
  h4: {
    fontSize: responsiveSize(18),
    lineHeight: responsiveSize(22),
    color: COLORS.textSecondary,
  },
  h5: {
    fontSize: responsiveSize(16),
    lineHeight: responsiveSize(19),
    color: COLORS.textSecondary,
  },
  h6: {
    fontSize: responsiveSize(14),
    lineHeight: responsiveSize(17),
    color: COLORS.textSecondary,
  },
  regular: {
    fontFamily: TYPOGRAPHY.regular,
  },
  medium: {
    fontFamily: TYPOGRAPHY.medium,
  },
  semibold: {
    fontFamily: TYPOGRAPHY.semibold,
  },
  bold: {
    fontFamily: TYPOGRAPHY.bold,
  },
})

// import theme from 'config/theme'
COLORS
import { COLORS, TYPOGRAPHY } from '@/constants/theme'
import React from 'react'
import { StyleProp, StyleSheet, Text, TextProps, TextStyle } from 'react-native'

type Properties = TextProps & {
  children?: React.ReactNode
  text?: string | number
  type?: 'medium' | 'regular' | 'bold'
  style?: StyleProp<TextStyle>
  numberOfLines?: number
  flex1?: boolean
  textColor?: string
}

export const B1 = ({
  children,
  text,
  type = 'regular',
  style,
  numberOfLines,
  flex1,
  textColor,
  ...props
}: Properties) => {
  return (
    <Text
      style={[
        styles.b1,
        styles[type],
        flex1 && { flex: 1 },
        { color: textColor || COLORS.textSecondary },
        style,
      ]}
      numberOfLines={numberOfLines}
      {...props}
    >
      {text ?? children ?? ''}
    </Text>
  )
}

interface B2Props extends TextProps {
  children?: React.ReactNode
  text?: string | number
  type?: 'medium' | 'regular' | 'bold' | 'semibold'
  style?: StyleProp<TextStyle>
  flex1?: boolean
  textColor?: string
}

export const B2 = ({
  children,
  text,
  type = 'regular',
  style,
  flex1,
  textColor,
  ...props
}: B2Props) => {
  return (
    <Text
      style={[
        styles.b2,
        flex1 && { flex: 1 },
        { color: textColor || COLORS.textPrimary },
        styles[type],
        style,
      ]}
      {...props}
    >
      {text ?? children ?? ''}
    </Text>
  )
}

export const B3 = ({ text, type = 'regular', flex1, style, textColor, children }: Properties) => {
  return (
    <Text
      style={[
        styles.b3,
        styles[type],
        flex1 && { flex: 1 },
        { color: textColor || COLORS.textPrimary },
        style,
      ]}
    >
      {text ?? children ?? ''}
    </Text>
  )
}

const styles = StyleSheet.create({
  b1: {
    fontSize: TYPOGRAPHY.fontSize.md,
    lineHeight: TYPOGRAPHY.lineHeight.md,
  },
  b2: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    lineHeight: TYPOGRAPHY.lineHeight.sm,
  },
  b3: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    lineHeight: TYPOGRAPHY.lineHeight.xs,
  },
  regular: {
    fontFamily: TYPOGRAPHY.regular,
  },
  medium: {
    fontFamily: TYPOGRAPHY.medium,
  },
  bold: {
    fontFamily: TYPOGRAPHY.bold,
  },
  semibold: {
    fontFamily: TYPOGRAPHY.semibold,
  },
})

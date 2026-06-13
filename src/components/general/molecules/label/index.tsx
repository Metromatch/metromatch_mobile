
import React from 'react'
import { StyleSheet, Text, TextProps, View } from 'react-native'
import { B2 } from '../../atoms/body_text'
import { COLORS } from '@/constants/theme'
import { responsiveSize } from '@/utils/responsive'

interface LabelProps extends TextProps {
    text: string
    style?: any
    required?: boolean
}

const Label = ({ text, style, required, ...props }: LabelProps) => (
    <View style={styles.container}>
        <B2
            text={text}
            type="medium"
            style={style}
            textColor={COLORS.textPrimary}
            {...props}
        />
        {required && <Text style={styles.required}>*</Text>}
    </View>
)

export default Label;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: responsiveSize(2)
    },
    required: {
        color: "#d52f2fff",
    }
})
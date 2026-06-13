import { View, StyleSheet, TextInput, StyleProp, ViewStyle, Platform, TextInputProps, TextStyle } from 'react-native'
import React, { useRef, useState } from 'react'
import Label from '@/components/general/molecules/label'
import { responsiveSize } from '@/utils/responsive'
import { COLORS, TYPOGRAPHY } from '@/constants/theme'
import { Span } from '@/components/general/atoms/span'

interface InputType extends Omit<TextInputProps, 'error'> {
  value?: string
  label?: string
  labelColor?: string
  placeholder?: string
  error?: string
  required?: boolean
  addonRight?: React.ReactNode
  containerStyle?: StyleProp<ViewStyle>
  flex1?: boolean
  inputStyle?: StyleProp<TextStyle>
  disabled?: boolean
}

const FormInput = ({
  label,
  style,
  error,
  required,
  addonRight,
  containerStyle,
  flex1,
  inputStyle,
  disabled = false,
  ...props
}: InputType) => {

  return (
    <View style={[flex1 ? { flex: 1 } : {}, containerStyle]}>
      {label && <Label text={label} required={required} />}
      <View
        style={[styles.inputContainer, {
          height: props.multiline ? 'auto' : responsiveSize(45),
          backgroundColor: disabled ? '#f0efefff' : '#fff',
        }]}
      >
        <TextInput
          {...props}
          editable={!disabled}
          textAlign="left"
          placeholderTextColor={COLORS.textSecondary}
          style={[
            styles.inputStyle,
            {
              height: props.multiline ? 'auto' : '100%',
              ...(Platform.OS === 'ios' && props.multiline && {
                minHeight: (props.numberOfLines || 4) * responsiveSize(26)
              }),
              maxHeight: props.multiline
                ? responsiveSize(26) * (props.numberOfLines || 5) + responsiveSize(29)
                : '100%',
              textAlignVertical: props.multiline ? 'top' : 'center',
            },
            inputStyle,
          ]}
        />
        {addonRight && <View style={styles.addonRight}>{addonRight}</View>}
      </View>

      {error && (
        <Span text={error} style={styles.error} />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  label: {
    marginLeft: responsiveSize(10),
  },
  inputContainer: {
    position: 'relative',
    backgroundColor: '#fff',
    borderRadius: responsiveSize(10),
  },
  inputStyle: {
    borderWidth: 1,
    borderRadius: responsiveSize(10),
    paddingHorizontal: responsiveSize(20),
    fontSize: responsiveSize(14),
    fontFamily: TYPOGRAPHY.regular,
    borderColor: COLORS.border
  },
  error: {
    paddingLeft: responsiveSize(10),
    color: 'red'
  },
  addonRight: {
    position: 'absolute',
    right: responsiveSize(20),
    height: '100%',
    justifyContent: 'center',
    // top: responsiveSize(10),
  },
})

export default FormInput

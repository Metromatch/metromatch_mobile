import { View, StyleSheet, TextInput, StyleProp, ViewStyle, Platform, TextInputProps, TextStyle, TouchableOpacity, ViewProps } from 'react-native'
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
  addonLeft?: React.ReactNode
  onPressAddonRight?: () => void
  containerProps?: ViewProps
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
  addonLeft,
  onPressAddonRight,
  containerProps,
  ...props
}: InputType) => {

  return (
    <View style={[styles.container, flex1 ? { flex: 1 } : {}, containerStyle]} {...containerProps}>
      {label && <Label text={label} required={required} />}
      <View
        style={[styles.inputContainer, {
          height: props.multiline ? 'auto' : responsiveSize(45),
          backgroundColor: disabled ? '#f0efefff' : '#fff',
        }]}
      >
        {addonLeft && <View style={styles.addonLeft}>{addonLeft}</View>}
        <TextInput
          {...props}
          editable={!disabled}
          textAlign="left"
          placeholderTextColor={COLORS.textSecondary}
          style={[
            styles.inputStyle,
            {
              height: props.multiline ? 'auto' : '100%',
              ...(props.multiline && {
                minHeight: (props.numberOfLines || 4) * responsiveSize(26),
                paddingVertical: responsiveSize(10)
              }),
              maxHeight: props.multiline
                ? responsiveSize(26) * (props.numberOfLines || 5) + responsiveSize(29)
                : '100%',
              textAlignVertical: props.multiline ? 'top' : 'center',
              paddingLeft: addonLeft ? responsiveSize(33) : responsiveSize(20),
              paddingRight: addonRight ? responsiveSize(48) : responsiveSize(20),
            },
            inputStyle,
          ]}
        />
        {addonRight && <TouchableOpacity onPress={onPressAddonRight} style={styles.addonRight}>{addonRight}</TouchableOpacity>}
      </View>

      {error && (
        <Span text={error} style={styles.error} />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'relative'
  },
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
    fontSize: responsiveSize(14),
    fontFamily: TYPOGRAPHY.regular,
    borderColor: COLORS.border,
    lineHeight: responsiveSize(14),
    // textAlignVertical: 'bottom',
    // backgroundColor: 'red'
    // paddingTop: responsiveSize(10)
    // padding: responsiveSize(20)
  },
  error: {
    paddingLeft: responsiveSize(2),
    color: 'red',
    // position: "absolute",
    // bottom: -responsiveSize(22)
  },
  addonLeft: {
    position: 'absolute',
    left: responsiveSize(10),
    height: '100%',
    justifyContent: 'center',
    // top: responsiveSize(10),
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

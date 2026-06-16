import React, { useState } from 'react'
import FormInput from '../../atoms/form_input'
import { StyleProp, ViewStyle, TouchableOpacity } from 'react-native'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import { Ionicons } from '@expo/vector-icons'
import { responsiveSize } from '@/utils/responsive'
import { COLORS } from '@/constants/theme'
import dayjs from 'dayjs'

interface FormDatePickerProps {
    label?: string
    value?: Date | null | ''
    onChange: (date: Date | null) => void
    placeholder?: string
    containerStyle?: StyleProp<ViewStyle>
    required?: boolean
    disabled?: boolean
    flex1?: boolean
    mode?: 'date' | 'time' | 'datetime',
    error?: string
}

const FormDatePicker = ({
    label,
    value,
    onChange,
    placeholder = 'Select Date',
    containerStyle,
    required,
    disabled = false,
    flex1 = true,
    mode = 'date',
    error,
}: FormDatePickerProps) => {
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const showDatePicker = () => {
        if (!disabled) {
            setDatePickerVisibility(true);
        }
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date: Date) => {
        hideDatePicker();
        onChange(date);
    };

    let formattedDate = '';
    if (mode === 'date') {
        formattedDate = dayjs(value).format('DD/MM/YYYY');
    } else if (mode === 'time') {
        formattedDate = dayjs(value).format('HH:mm');
    } else {
        formattedDate = dayjs(value).format('DD/MM/YYYY HH:mm');
    }

    return (
        <>
            <TouchableOpacity style={[flex1 && { flex: 1 }, containerStyle]} onPress={showDatePicker} activeOpacity={0.8} disabled={disabled}>
                <FormInput
                    label={label}
                    value={value ? formattedDate : ""}
                    onChangeText={() => { }}
                    placeholder={placeholder}
                    required={required}
                    flex1={false}
                    addonLeft={<Ionicons name="calendar-outline" size={responsiveSize(20)} color={COLORS.textSecondary} />}
                    containerProps={{ pointerEvents: "none" }}
                    error={error}
                />
            </TouchableOpacity>

            {isDatePickerVisible && (<DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode={mode}
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
            />)}
        </>
    )
}

export default FormDatePicker
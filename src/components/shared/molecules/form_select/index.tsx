import React from 'react';
import { TouchableOpacity, ViewStyle, View } from 'react-native';
import FormInput from '@/components/general/atoms/form_input';
import { Ionicons } from '@expo/vector-icons';
import { responsiveSize } from '@/utils/responsive';
import { COLORS } from '@/constants/theme';

interface FormSelectProps {
    label?: string;
    placeholder: string;
    value: string;
    onPress: () => void;
    containerStyle?: ViewStyle;
    flex1?: boolean;
    icon?: keyof typeof Ionicons.glyphMap;
}

const FormSelect = ({ label, placeholder, value, onPress, containerStyle, flex1, icon }: FormSelectProps) => {
    return (
        <TouchableOpacity activeOpacity={0.7} onPress={onPress} style={[flex1 && { flex: 1 }, containerStyle]}>
            <View pointerEvents="none">
                <FormInput
                    label={label}
                    placeholder={placeholder}
                    value={value}
                    editable={false}
                    addonLeft={icon ? <Ionicons name={icon} size={responsiveSize(18)} color={COLORS.textSecondary} /> : undefined}
                    addonRight={<Ionicons name="chevron-down-outline" size={responsiveSize(18)} color={COLORS.textSecondary} />}
                    containerStyle={{ marginBottom: 0 }}
                />
            </View>
        </TouchableOpacity>
    );
};

export default FormSelect;

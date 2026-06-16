import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { responsiveSize } from '@/utils/responsive';
import { COLORS, TYPOGRAPHY } from '@/constants/theme';
import Label from '@/components/general/molecules/label';
import { Span } from '@/components/general/atoms/span';

export type GenderType = 'male' | 'female' | 'other' | null;

interface GenderSelectorProps {
  value: GenderType;
  onChange: (value: GenderType) => void;
  error?: string;
  label?: string;
  required?: boolean;
}

const GenderSelector: React.FC<GenderSelectorProps> = ({ value, onChange, error, label, required }) => {
  const genders: { id: GenderType; label: string; icon: keyof typeof Ionicons.glyphMap; color: string }[] = [
    { id: 'male', label: 'Male', icon: 'male', color: '#2F6BFF' },
    { id: 'female', label: 'Female', icon: 'female', color: '#FF4D8D' },
    { id: 'other', label: 'Other', icon: 'male-female', color: '#9B51E0' },
  ];

  return (
    <View style={styles.container}>
      {label && <Label text={label} required={required} />}
      <View style={styles.row}>
        {genders.map((item) => {
          const isSelected = value === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.7}
              style={[
                styles.card,
                isSelected && styles.cardSelected,
              ]}
              onPress={() => onChange(item.id)}
            >
              <Ionicons
                name={item.icon}
                size={responsiveSize(28)}
                color={item.color}
                style={styles.icon}
              />
              <Text style={[styles.text, isSelected && styles.textSelected]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {error && <Span style={styles.error}>{error}</Span>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: responsiveSize(10),
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: responsiveSize(12),
    paddingVertical: responsiveSize(16),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  cardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: '#F0F4FF',
  },
  icon: {
    marginBottom: responsiveSize(8),
  },
  text: {
    fontFamily: TYPOGRAPHY.medium,
    fontSize: responsiveSize(12),
    color: COLORS.textPrimary,
  },
  textSelected: {
    color: COLORS.primary,
    fontFamily: TYPOGRAPHY.semibold,
  },
  error: {
    color: 'red',
    paddingLeft: responsiveSize(2),
    position: "absolute",
    bottom: -responsiveSize(22)
  },
});

export default GenderSelector;

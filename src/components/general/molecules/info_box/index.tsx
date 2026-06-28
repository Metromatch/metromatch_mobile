import profile from '@/app/main/profile';
import { COLORS, TYPOGRAPHY } from '@/constants/theme';
import { responsiveSize } from '@/utils/responsive';
import { Ionicons } from '@expo/vector-icons';
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

function SectionHeader({ icon, title }: { icon: keyof typeof Ionicons.glyphMap; title: string }) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionIconWrap}>
        <Ionicons name={icon} size={15} color={COLORS.primary} />
      </View>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
}

function InfoRow({ label, value }: {
  label: string;
  value: string;
}) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value || '—'}</Text>
    </View>
  );
}

const InfoBox = ({ list, title, icon }: { title: string, icon: keyof typeof Ionicons.glyphMap; list: { title: string, value: string }[] }) => {
  return (
    <View style={styles.card}>
      <SectionHeader icon={icon} title={title} />

      {list.map((item, index) => (
        <React.Fragment key={item.title}>
          <InfoRow
            label={item.title}
            value={item.value || '—'}
          />
          {index !== list.length - 1 && <View style={styles.divider} />}
        </React.Fragment>
      ))}
    </View>

  )
}

export default InfoBox

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: responsiveSize(18),
    padding: responsiveSize(16),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  tipsCard: {
    backgroundColor: 'rgba(47,107,255,0.1)',
    borderColor: 'rgba(47,107,255,0.25)',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginVertical: responsiveSize(10),
  },
  // Section header
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveSize(8),
    marginBottom: responsiveSize(14),
  },
  sectionIconWrap: {
    width: responsiveSize(26),
    height: responsiveSize(26),
    borderRadius: 8,
    backgroundColor: 'rgba(47,107,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontFamily: TYPOGRAPHY.semibold,
    fontSize: responsiveSize(14),
    color: 'white',
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: responsiveSize(2),
  },
  infoLabel: {
    fontFamily: TYPOGRAPHY.regular,
    fontSize: responsiveSize(13),
    color: 'rgba(255,255,255,0.5)',
    flex: 1,
  },
  infoValue: {
    fontFamily: TYPOGRAPHY.medium,
    fontSize: responsiveSize(13),
    color: 'white',
    flex: 2,
    textAlign: 'right',
  },
  infoInput: {
    flex: 2,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(110,168,255,0.3)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: 'white',
    fontFamily: TYPOGRAPHY.regular,
    fontSize: responsiveSize(13),
    textAlign: 'right',
  },
})

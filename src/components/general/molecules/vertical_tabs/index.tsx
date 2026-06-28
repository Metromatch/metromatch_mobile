import { LinearGradient } from 'expo-linear-gradient';
import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { B2 } from '../../atoms/body_text';
import { responsiveSize } from '@/utils/responsive';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS } from '@/constants/theme';

interface VerticalTabsProps {
    tabList: Array<{ id: string; label: string; activeIcon?: keyof typeof Ionicons.glyphMap, inactiveIcon?: keyof typeof Ionicons.glyphMap }>;
    activeTab: string;
    onTabChange: (tab: string) => void;
}

const VerticalTabs = ({ tabList, activeTab, onTabChange }: VerticalTabsProps) => {
    return (
        <View style={styles.toggle}>
            {tabList.map((tab) => (
                activeTab === tab.id ? (
                    <LinearGradient key={tab.id} style={styles.activeTab} colors={["#5EA3FF", "#2F6BFF"]}>
                        {tab.activeIcon && <Ionicons
                            name={tab.activeIcon}
                            size={(responsiveSize(16))}
                            color={COLORS.white}
                        />}
                        <B2 text={tab.label} type="medium" textColor='white' />
                    </LinearGradient>) : (
                    <TouchableOpacity key={tab.id} style={styles.inactiveTab} onPress={() => onTabChange(tab.id)}>
                        {tab.inactiveIcon && <Ionicons
                            name={tab.inactiveIcon}
                            size={(responsiveSize(16))}
                            color={COLORS.textPrimary}
                        />}
                        <B2 text={tab.label} type="medium" />
                    </TouchableOpacity>
                )
            ))}
        </View>
    );
}

export default VerticalTabs

const styles = StyleSheet.create({
    toggle: {
        flexDirection: 'row',
        backgroundColor: '#EEF3FF',
        borderRadius: responsiveSize(18),
        padding: responsiveSize(5),
    },
    inactiveTab: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        gap: responsiveSize(5)
    },

    activeTab: {
        flex: 1,
        height: responsiveSize(40),
        borderRadius: responsiveSize(15),
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        gap: responsiveSize(5)
    },
})
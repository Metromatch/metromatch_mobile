import { LinearGradient } from 'expo-linear-gradient';
import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { B2 } from '../../atoms/body_text';
import { responsiveSize } from '@/utils/responsive';

interface VerticalTabsProps {
    tabList: Array<{ id: string; label: string }>;
    activeTab: string;
    onTabChange: (tab: string) => void;
}

const VerticalTabs = ({ tabList, activeTab, onTabChange }: VerticalTabsProps) => {
    return (
        <View style={styles.toggle}>
            {tabList.map((tab) => (
                activeTab === tab.id ? (
                    <LinearGradient key={tab.id} style={styles.activeTab} colors={["#5EA3FF", "#2F6BFF"]}>
                        <B2 text={tab.label} type="semibold" textColor='white' />
                    </LinearGradient>) : (
                    <TouchableOpacity key={tab.id} style={styles.inactiveTab} onPress={() => onTabChange(tab.id)}>
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
        marginBottom: responsiveSize(20),
    },
    inactiveTab: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    activeTab: {
        flex: 1,
        height: responsiveSize(40),
        borderRadius: responsiveSize(15),
        justifyContent: 'center',
        alignItems: 'center',
    },
})
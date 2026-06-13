import { LinearGradient } from 'expo-linear-gradient';
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

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
                    <LinearGradient style={styles.activeTab} colors={["#5EA3FF", "#2F6BFF"]}>
                        <Text style={styles.activeText}>
                            {tab.label}
                        </Text>
                    </LinearGradient>) : (
                    <TouchableOpacity style={styles.inactiveTab} onPress={() => onTabChange(tab.id)}>
                        <Text style={styles.inactiveText}>{tab.label}</Text>
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
        borderRadius: 18,
        padding: 5,
        marginBottom: 20,
    },
    inactiveTab: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    activeTab: {
        flex: 1,
        height: 40,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inactiveText: {
        fontSize: 16,
        fontWeight: '600',
        color: 'grey'
    },

    activeText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '700',
    },
})
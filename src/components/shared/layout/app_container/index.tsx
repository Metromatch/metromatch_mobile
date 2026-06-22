import { COLORS } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';

export default function AppContainer({ children, ...props }: { children: React.ReactNode, props?: ViewProps }) {
    return (
        <LinearGradient
            colors={[
                COLORS.backgroundStart,
                COLORS.backgroundMiddle,
                COLORS.backgroundEnd,
            ]}
            style={[StyleSheet.absoluteFill, styles.container]}
            {...props}
        >
            <View style={styles.heroOverlay} />
            {children}
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    heroOverlay: {
        ...StyleSheet.absoluteFill,
        backgroundColor: 'rgba(58, 76, 139, 0.5)',
    },
});

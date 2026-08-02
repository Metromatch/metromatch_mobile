import { COLORS } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ImageBackground, StyleSheet, View, ViewProps } from 'react-native';

export default function AppContainer({ children, includeBgImage = false, ...props }: { children: React.ReactNode, includeBgImage?: boolean, props?: ViewProps }) {
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
            {includeBgImage && (<ImageBackground
                source={require('@/assets/images/couple_bg.png')}
                resizeMode="cover"
                style={styles.background}>
                <View style={styles.heroOverlay} />
            </ImageBackground>)}
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
    background: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
});

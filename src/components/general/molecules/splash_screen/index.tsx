import React from 'react';
import { StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '@/constants/theme';
import { responsiveSize } from '@/utils/responsive';

const SplashScreen = () => {
    return (
        <LinearGradient
            colors={[
                COLORS.backgroundStart,
                COLORS.backgroundMiddle,
                COLORS.backgroundEnd,
            ]}
            style={styles.container}
        >
            <Image
                source={require('@/assets/images/logo_with_title.png')}
                style={styles.logo}
                resizeMode="contain"
            />
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
    },
    logo: {
        width: responsiveSize(250),
        height: responsiveSize(150),
    },
});

export default SplashScreen;

import React from 'react';
import { StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '@/constants/theme';
import { responsiveSize } from '@/utils/responsive';
import { B1 } from '../../atoms/body_text';

const SplashScreen = ({ message = "" }: { message?: string }) => {
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
            {message && <B1 textColor='white'>{message}</B1>}
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

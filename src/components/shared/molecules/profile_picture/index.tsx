import { responsiveSize } from '@/utils/responsive';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react'
import { Image, StyleSheet } from 'react-native';

interface IProfilePicture {
    imageUri: string;
    size?: number;
}

const defaultSize = responsiveSize(120)
const ProfilePicture = ({
    imageUri,
    size = defaultSize,
}: IProfilePicture) => {

    if (imageUri) {
        return (
            <Image
                source={{ uri: imageUri }}
                // resizeMode="cover"
                style={[styles.avatar, { height: size, width: size, borderRadius: size / 2 }]}
            />
        )
    }

    return (
        <LinearGradient
            colors={['#1A42D9', '#5C7BFF']}
            style={[styles.avatar, { height: size, width: size, borderRadius: size / 2 }]}
        >
            <Ionicons name="person" size={responsiveSize(52)} color="rgba(255,255,255,0.5)" />
        </LinearGradient>
    )
}

export default ProfilePicture

const styles = StyleSheet.create({
    avatar: {
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: responsiveSize(3),
        borderColor: 'rgba(255,255,255,0.3)',
    },
})
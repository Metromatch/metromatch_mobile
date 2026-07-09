import React, { useState } from 'react';
import { View, StyleSheet, Text, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import { responsiveSize } from '@/utils/responsive';
import { COLORS, TYPOGRAPHY } from '@/constants/theme';
import PhotoGrid from '@/components/shared/molecules/photo_grid';
import PrimaryButton from '@/components/general/atoms/primary_button';
import IconButton from '@/components/general/atoms/icon_button';
import useMetromatchStore from '@/store';
import useProfileService from '@/hooks/services/useProfileService';

const OnboardingPhotos = () => {
    const router = useRouter();
    const [photos, setPhotos] = useState<string[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const { onboardingSteps: { formValues } } = useMetromatchStore();
    const { createProfile, isCreateProfileLoading } = useProfileService({});

    const handleAddPhoto = async () => {
        if (photos.length >= 6) {
            Alert.alert("Limit Reached", "You can only upload up to 6 photos.");
            return;
        }

        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            Alert.alert("Permission Required", "Please allow access to your photos to upload them.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [3, 4],
            quality: 0.8,
        });

        if (!result.canceled) {
            setIsAnalyzing(true);
            const uri = result.assets[0].uri;

            // Mock API Call for Face and AI Detection
            setTimeout(() => {
                setIsAnalyzing(false);

                const random = Math.random();
                if (random < 0.1) {
                    Alert.alert("Analysis Failed", "We couldn't detect a clear face in this photo. Please try another one.");
                } else if (random < 0.2) {
                    Alert.alert("Analysis Failed", "This image appears to be AI-generated. We only allow authentic photos.");
                } else {
                    setPhotos((prev) => [...prev, uri]);
                }
            }, 2000);
        }
    };

    const handleRemovePhoto = (index: number) => {
        setPhotos((prev) => prev.filter((_, i) => i !== index));
    };

    const handleMovePhoto = (fromIndex: number, toIndex: number) => {
        setPhotos((prev) => {
            const newPhotos = [...prev];
            const temp = newPhotos[fromIndex];
            newPhotos[fromIndex] = newPhotos[toIndex];
            newPhotos[toIndex] = temp;
            return newPhotos;
        });
    };

    const handleFinish = async () => {
        if (photos.length === 0) {
            Alert.alert("Photo Required", "Please upload at least one photo.");
            return;
        }

        await createProfile({ payload: formValues })
        router.replace('/main/discover');
    };

    const handleBack = () => {
        router.back();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.titleText}>Upload Photos</Text>
            <Text style={styles.subtitleText}>
                Add at least one photo to continue. The first photo will be your main profile picture.
            </Text>

            <PhotoGrid
                photos={photos}
                onAddPhoto={handleAddPhoto}
                onRemovePhoto={handleRemovePhoto}
                onMovePhoto={handleMovePhoto}
            />

            <View style={styles.footerButtons}>
                <IconButton
                    iconName="arrow-back-outline"
                    onPress={handleBack}
                    containerStyle={styles.backButton}
                />
                <PrimaryButton
                    title="Complete Profile"
                    onPress={handleFinish}
                    addonRight={<Ionicons name="checkmark-done" size={responsiveSize(20)} color="white" />}
                    containerStyle={styles.nextButton}
                    loading={isCreateProfileLoading}
                />
            </View>

            {isAnalyzing && (
                <View style={[StyleSheet.absoluteFill, styles.loadingOverlay]}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                    <Text style={styles.loadingText}>Analyzing image for faces...</Text>
                </View>
            )}
        </View>
    );
};

export default OnboardingPhotos;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    titleText: {
        fontFamily: TYPOGRAPHY.bold,
        fontSize: responsiveSize(22),
        color: COLORS.textPrimary,
        marginRight: responsiveSize(8),
        textAlign: 'center'
    },
    subtitleText: {
        textAlign: 'center',
        fontFamily: TYPOGRAPHY.medium,
        fontSize: responsiveSize(14),
        color: COLORS.textSecondary,
        marginBottom: responsiveSize(24),
    },
    footerButtons: {
        marginTop: responsiveSize(20),
        flexDirection: 'row',
        gap: responsiveSize(15),
    },
    backButton: {
        backgroundColor: '#F5F7FA',
        height: responsiveSize(50),
        width: responsiveSize(50),
        marginTop: 0,
    },
    nextButton: {
        flex: 1,
    },
    loadingOverlay: {
        backgroundColor: 'rgba(255,255,255,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
        borderRadius: responsiveSize(20),
    },
    loadingText: {
        marginTop: responsiveSize(10),
        fontFamily: TYPOGRAPHY.medium,
        color: COLORS.primary,
        fontSize: responsiveSize(16),
    }
});

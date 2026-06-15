import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { responsiveSize } from '@/utils/responsive';
import { COLORS, TYPOGRAPHY } from '@/constants/theme';

interface PhotoGridProps {
    photos: string[];
    onAddPhoto: () => void;
    onRemovePhoto: (index: number) => void;
    onMovePhoto: (fromIndex: number, toIndex: number) => void;
    maxPhotos?: number;
}

const PhotoGrid = ({ photos, onAddPhoto, onRemovePhoto, onMovePhoto, maxPhotos = 6 }: PhotoGridProps) => {
    
    const slots = Array.from({ length: maxPhotos }, (_, i) => photos[i] || null);

    return (
        <View style={styles.gridContainer}>
            {slots.map((photoUri, index) => {
                const isMainPhoto = index === 0;
                // Force user to add photos in order
                const canAdd = index === photos.length; 
                const isEmpty = !photoUri;

                return (
                    <View key={index} style={styles.slotWrapper}>
                        {!isEmpty ? (
                            <View style={styles.photoWrapper}>
                                <Image source={{ uri: photoUri }} style={styles.image} />
                                
                                {isMainPhoto && (
                                    <View style={styles.mainBadge}>
                                        <Text style={styles.mainBadgeText}>Main</Text>
                                    </View>
                                )}

                                <TouchableOpacity 
                                    style={styles.deleteButton} 
                                    onPress={() => onRemovePhoto(index)}
                                >
                                    <Ionicons name="close" size={responsiveSize(16)} color="#fff" />
                                </TouchableOpacity>

                                {/* Order Controls */}
                                <View style={styles.orderControls}>
                                    <TouchableOpacity 
                                        onPress={() => onMovePhoto(index, index - 1)}
                                        disabled={index === 0}
                                        style={styles.controlIcon}
                                    >
                                        <Ionicons 
                                            name="chevron-back" 
                                            size={responsiveSize(20)} 
                                            color={index === 0 ? 'rgba(255,255,255,0.3)' : '#fff'} 
                                        />
                                    </TouchableOpacity>
                                    
                                    <TouchableOpacity 
                                        onPress={() => onMovePhoto(index, index + 1)}
                                        disabled={index === photos.length - 1}
                                        style={styles.controlIcon}
                                    >
                                        <Ionicons 
                                            name="chevron-forward" 
                                            size={responsiveSize(20)} 
                                            color={index === photos.length - 1 ? 'rgba(255,255,255,0.3)' : '#fff'} 
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ) : (
                            <TouchableOpacity 
                                style={[styles.emptySlot, !canAdd && styles.disabledSlot]} 
                                onPress={onAddPhoto}
                                disabled={!canAdd}
                            >
                                <Ionicons 
                                    name="add" 
                                    size={responsiveSize(30)} 
                                    color={canAdd ? COLORS.primary : 'rgba(0,0,0,0.2)'} 
                                />
                            </TouchableOpacity>
                        )}
                    </View>
                );
            })}
        </View>
    );
};

export default PhotoGrid;

const styles = StyleSheet.create({
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: responsiveSize(10),
        justifyContent: 'space-between',
    },
    slotWrapper: {
        width: '31%', // 3 columns approx
        aspectRatio: 0.75, // 3:4 aspect ratio for portraits
        marginBottom: responsiveSize(10),
    },
    photoWrapper: {
        width: '100%',
        height: '100%',
        borderRadius: responsiveSize(12),
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#e1e1e1',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    emptySlot: {
        width: '100%',
        height: '100%',
        borderRadius: responsiveSize(12),
        borderWidth: 2,
        borderColor: COLORS.primary,
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.5)',
    },
    disabledSlot: {
        borderColor: 'rgba(0,0,0,0.1)',
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    mainBadge: {
        position: 'absolute',
        top: responsiveSize(5),
        left: responsiveSize(5),
        backgroundColor: COLORS.primary,
        paddingHorizontal: responsiveSize(6),
        paddingVertical: responsiveSize(2),
        borderRadius: responsiveSize(4),
    },
    mainBadgeText: {
        color: '#fff',
        fontSize: responsiveSize(10),
        fontFamily: TYPOGRAPHY.medium,
    },
    deleteButton: {
        position: 'absolute',
        top: responsiveSize(5),
        right: responsiveSize(5),
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: responsiveSize(12),
        width: responsiveSize(24),
        height: responsiveSize(24),
        justifyContent: 'center',
        alignItems: 'center',
    },
    orderControls: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: responsiveSize(30),
        backgroundColor: 'rgba(0,0,0,0.4)',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: responsiveSize(5),
    },
    controlIcon: {
        padding: responsiveSize(2),
    }
});

import React, { ReactNode } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { responsiveSize } from '@/utils/responsive';
import { COLORS, TYPOGRAPHY } from '@/constants/theme';
import { H4 } from '../../atoms/heading_text';

interface BottomSheetProps {
    isVisible: boolean;
    onClose: () => void;
    title?: string;
    icon?: ReactNode;
    children: ReactNode;
}

const BottomSheet = ({
    isVisible,
    onClose,
    title,
    icon,
    children
}: BottomSheetProps) => {

    return (
        <>
            <Modal
                visible={isVisible}
                transparent
                animationType="slide"
                onRequestClose={onClose}
            >
                <TouchableOpacity
                    style={styles.backdrop}
                    activeOpacity={1}
                    onPress={onClose}
                >
                    <TouchableWithoutFeedback>
                        <View style={styles.bottomSheetContainer}>
                            <View style={styles.dragHandleContainer}>
                                <View style={styles.dragHandle} />
                            </View>

                            {(title || icon) && (
                                <View style={styles.header}>
                                    <View style={styles.headerLeft}>
                                        {icon && <View style={styles.iconContainer}>{icon}</View>}
                                        {title && <H4 text={title} />}
                                    </View>
                                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                        <Ionicons name="close" size={responsiveSize(18)} color={COLORS.textPrimary} />
                                    </TouchableOpacity>
                                </View>
                            )}

                            <View style={styles.content}>
                                {children}
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </TouchableOpacity>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'flex-end',
        // position: 'fixed',
        // top: 0,
        // left: 0,
        // right: 0,
        // bottom: 0,
        height: Dimensions.get('screen').height,
        width: Dimensions.get('screen').width,
    },
    bottomSheetContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: responsiveSize(30),
        paddingHorizontal: responsiveSize(24),
        marginHorizontal: responsiveSize(12),
        paddingBottom: responsiveSize(40),
        maxHeight: '85%',
    },
    dragHandleContainer: {
        alignItems: 'center',
        paddingVertical: responsiveSize(12),
    },
    dragHandle: {
        width: responsiveSize(45),
        height: responsiveSize(5),
        backgroundColor: '#E5E7EB',
        borderRadius: responsiveSize(3),
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: responsiveSize(20),
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        marginRight: responsiveSize(10),
    },
    closeButton: {
        width: responsiveSize(32),
        height: responsiveSize(32),
        borderRadius: responsiveSize(16),
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        // Can add padding or styling for children here if needed
    }
});

export default BottomSheet;

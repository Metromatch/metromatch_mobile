import { useMutation } from '@tanstack/react-query';
import { Platform } from 'react-native';

const CLOUD_NAME = 'dirj0k8qd'; // Replace with your cloud name
const UPLOAD_PRESET = 'metromatchindia'; // Replace with your unsigned preset
const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

export const useCloudnaryService = () => {
    const {
        mutateAsync: uploadImage,
        isPending: isImageUploading,
    } = useMutation({
        mutationFn: async (image: any) => {
            const formData = new FormData();
            if (Platform.OS === 'web') {
                if (image.file) {
                    formData.append('file', image.file);
                } else {
                    const res = await fetch(image.uri);
                    const blob = await res.blob();
                    formData.append('file', blob);
                }
            } else {
                formData.append('file', {
                    uri: Platform.OS === 'ios' ? image.uri.replace('file://', '') : image.uri,
                    type: image.type || 'image/jpeg',
                    name: image.fileName || `upload_${Date.now()}.jpg`,
                } as any);
            }
            formData.append('upload_preset', UPLOAD_PRESET);
            const response = await fetch(uploadUrl, { method: 'POST', body: formData });
            const result = await response.json();
            return ({
                fileName: result.original_filename,
                imageUrl: result.secure_url,
                publicId: result.public_id
            })
        }
    })
    return { uploadImage, isImageUploading }
}

import { useMutation } from '@tanstack/react-query';
import { Platform } from 'react-native';
import { uploadAsync, FileSystemUploadType } from 'expo-file-system/legacy';

const CLOUD_NAME = 'dirj0k8qd';
const UPLOAD_PRESET = 'metromatchindia';
const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

export const useCloudnaryService = () => {
    const {
        mutateAsync: uploadImage,
        isPending: isImageUploading,
    } = useMutation({
        mutationFn: async (image: any) => {
            if (Platform.OS === 'web') {
                // Web: standard fetch + Blob approach
                const formData = new FormData();
                if (image.file) {
                    formData.append('file', image.file);
                } else {
                    const res = await fetch(image.uri);
                    const blob = await res.blob();
                    formData.append('file', blob);
                }
                formData.append('upload_preset', UPLOAD_PRESET);
                const response = await fetch(uploadUrl, { method: 'POST', body: formData });
                if (!response.ok) {
                    const errText = await response.text();
                    throw new Error(`Cloudinary upload failed (${response.status}): ${errText}`);
                }
                const result = await response.json();
                return {
                    fileName: result.original_filename,
                    imageUrl: result.secure_url,
                    publicId: result.public_id,
                };
            }

            // Mobile (iOS & Android): use FileSystem.uploadAsync for native multipart upload.
            // fetch().blob() and XHR both fail in React Native due to BlobManager limitations.
            const uploadResult = await uploadAsync(uploadUrl, image.uri, {
                httpMethod: 'POST',
                uploadType: FileSystemUploadType.MULTIPART,
                fieldName: 'file',
                mimeType: image.mimeType || image.type || 'image/jpeg',
                parameters: {
                    upload_preset: UPLOAD_PRESET,
                },
            });

            if (uploadResult.status < 200 || uploadResult.status >= 300) {
                throw new Error(`Cloudinary upload failed (${uploadResult.status}): ${uploadResult.body}`);
            }

            const result = JSON.parse(uploadResult.body);
            return {
                fileName: result.original_filename,
                imageUrl: result.secure_url,
                publicId: result.public_id,
            };
        },
    });

    return { uploadImage, isImageUploading };
};

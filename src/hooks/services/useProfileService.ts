// create profile
import { useMutation } from "@tanstack/react-query";
import { Profiles } from "../../api/requests";

const useProfileService = () => {
    const {
        mutateAsync: createProfile,
        isPending: isCreateProfileLoading,
    } = useMutation({
        mutationFn: ({ payload }: { payload: any }) => Profiles.createMyProfile('', payload),
    });

    const {
        mutateAsync: updateProfile,
        isPending: isUpdateProfileLoading,
    } = useMutation({
        mutationFn: ({ payload }: { payload: any }) => Profiles.updateMyProfile('', payload),
    });

    const {
        mutateAsync: getMyProfile,
        isPending: isGetMyProfileLoading,
    } = useMutation({
        mutationFn: () => Profiles.getMyProfile(''),
    });

    return {
        createProfile,
        isCreateProfileLoading,
        updateProfile,
        isUpdateProfileLoading,
        getMyProfile,
        isGetMyProfileLoading,
    }
}

export default useProfileService;
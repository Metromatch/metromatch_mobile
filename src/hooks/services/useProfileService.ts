// create profile
import { useMutation, useQuery } from "@tanstack/react-query";
import { Profiles } from "../../api/requests";
import { useAuthStore } from "@/store/authStore";

const useProfileService = ({
    fetchMyProfile = false
}: {
    fetchMyProfile?: boolean,
}) => {
    const { authConfiguration: { userId } } = useAuthStore();
    const {
        data: myProfile,
        isLoading: isMyProfileLoading,
        refetch: refetchMyProfile,
    } = useQuery({
        queryKey: ['my-profile', userId],
        queryFn: async () => {
            const res = await Profiles.getMyProfile('')
            return res.data.data
        },
        enabled: fetchMyProfile,
        gcTime: Infinity,
        staleTime: Infinity,
    })

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

    // const {
    //     mutateAsync: getMyProfile,
    //     isPending: isGetMyProfileLoading,
    // } = useMutation({
    //     mutationFn: () => Profiles.getMyProfile(''),
    // });

    return {
        createProfile,
        isCreateProfileLoading,

        updateProfile,
        isUpdateProfileLoading,

        myProfile,
        isMyProfileLoading,
        refetchMyProfile
    }
}

export default useProfileService;
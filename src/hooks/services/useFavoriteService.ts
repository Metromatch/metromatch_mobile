// create profile
import { useMutation } from "@tanstack/react-query";
import { Favorites } from "../../api/requests";

const useFavoriteService = ({
}: {
    }) => {
    const {
        mutateAsync: markFavorite,
        isPending: isMarkFavoriteLoading,
    } = useMutation({
        mutationFn: async (profileId: string) => {
            const res = await Favorites.markFavorite({ profileId })
            return res.data.data
        },
    });

    const {
        mutateAsync: removeFavorite,
        isPending: isRemoveFavoriteLoading,
    } = useMutation({
        mutationFn: async (profileId: string) => {
            const res = await Favorites.removeFavorite(profileId)
            return res.data.data
        },
    });

    return {
        markFavorite,
        isMarkFavoriteLoading,

        removeFavorite,
        isRemoveFavoriteLoading,
    }
}

export default useFavoriteService;
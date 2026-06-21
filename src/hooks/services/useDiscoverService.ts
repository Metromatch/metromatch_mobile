import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Discovery, Swipes, Matches } from '../../api/requests';

export type SwipeType = 'like' | 'pass' | 'super_like';

export interface NearbyProfile {
    id: string;
    userId: string;
    name: string;
    dob: string;
    gender?: string;
    profession?: string;
    religion?: string;
    height?: string;
    diet?: string;
    drinkingHabits?: string;
    smokingHabits?: string;
    travelFrequency?: string;
    relationshipPreference?: string;
    interestedIn?: string;
    travelTimeSlots?: string[];
    distanceMeters?: number;
    photos?: { url: string }[];
}

const useDiscoverService = ({
    radius = 500,
    limit = 20,
}: {
    radius?: number;
    limit?: number;
} = {}) => {
    const queryClient = useQueryClient();

    // Fetch nearby profiles via Discovery API
    const {
        data: nearbyProfiles,
        isLoading: isDiscoveryLoading,
        refetch: refetchDiscovery,
        isRefetching: isRefetchingDiscovery,
    } = useQuery<NearbyProfile[]>({
        queryKey: ['discovery', radius, limit],
        queryFn: async () => {
            const res = await Discovery.getNearby({ radius, limit });
            return res.data?.data ?? [];
        },
        staleTime: 1000 * 60 * 2, // 2 min
        gcTime: 1000 * 60 * 5,
        retry: 1,
    });

    // Swipe mutation — returns { swipe, matched, matchId }
    const {
        mutateAsync: swipe,
        isPending: isSwipePending,
    } = useMutation({
        mutationFn: ({
            toUserId,
            swipeType,
        }: {
            toUserId: string;
            swipeType: SwipeType;
        }) => Swipes.swipe({ toUserId, swipeType }),
        onSuccess: () => {
            // Invalidate matches so the matches list stays fresh
            queryClient.invalidateQueries({ queryKey: ['matches'] });
        },
    });

    // Fetch active matches
    const {
        data: matches,
        isLoading: isMatchesLoading,
        refetch: refetchMatches,
    } = useQuery({
        queryKey: ['matches'],
        queryFn: async () => {
            const res = await Matches.getMatches();
            return res.data ?? [];
        },
        staleTime: 1000 * 30,
    });

    // Unmatch mutation
    const {
        mutateAsync: unmatch,
        isPending: isUnmatchPending,
    } = useMutation({
        mutationFn: (matchId: string) => Matches.unmatch(matchId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['matches'] });
        },
    });

    return {
        nearbyProfiles: nearbyProfiles ?? [],
        isDiscoveryLoading,
        refetchDiscovery,
        isRefetchingDiscovery,

        swipe,
        isSwipePending,

        matches,
        isMatchesLoading,
        refetchMatches,

        unmatch,
        isUnmatchPending,
    };
};

export default useDiscoverService;

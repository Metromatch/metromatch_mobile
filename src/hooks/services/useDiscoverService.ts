import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useRef, useState } from 'react';
import * as Location from 'expo-location';
import { Discovery, Swipes, Matches, Presence } from '../../api/requests';

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
    bio?: string;
    imageUrl?: string
}

export type LocationStatus =
    | 'idle'
    | 'requesting'
    | 'denied'
    | 'updating'
    | 'ready'
    | 'error';

const useDiscoverService = ({
    radius = 1000,
    limit = 20,
}: {
    radius?: number;
    limit?: number;
} = {}) => {
    const queryClient = useQueryClient();
    const [locationStatus, setLocationStatus] = useState<LocationStatus>('idle');
    const locationReady = locationStatus === 'ready';
    const hasInitialized = useRef(false);
    // Client-side set of swiped userIds — filters profiles that sneak through
    // before the backend deployment is warm or on stale cached queries
    const swipedIds = useRef<Set<string>>(new Set());

    // ─── Step 1: Get device location & update presence ────────────────────────
    const initLocation = useCallback(async () => {
        if (hasInitialized.current) return;
        hasInitialized.current = true;

        setLocationStatus('requesting');

        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setLocationStatus('denied');
                return;
            }

            setLocationStatus('updating');

            const loc = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
            });

            await Presence.updatePresence({
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
                online: true,
            });

            setLocationStatus('ready');
            // Trigger discovery fetch now that presence is updated
            queryClient.invalidateQueries({ queryKey: ['discovery'] });
        } catch (err) {
            console.warn('[useDiscoverService] location/presence error:', err);
            setLocationStatus('error');
        }
    }, [queryClient]);

    useEffect(() => {
        initLocation();
    }, [initLocation]);

    // ─── Step 2: Fetch nearby profiles via Discovery API ─────────────────────
    const {
        data: nearbyProfiles,
        isLoading: isDiscoveryLoading,
        refetch: refetchDiscovery,
        isRefetching: isRefetchingDiscovery,
        error: discoveryError,
    } = useQuery<NearbyProfile[]>({
        queryKey: ['discovery', radius, limit],
        queryFn: async () => {
            const res = await Discovery.getNearby({ radius, limit });
            return res.data?.data ?? [];
        },
        enabled: locationReady,
        staleTime: 1000 * 60 * 2, // 2 min
        gcTime: 1000 * 60 * 5,
        retry: 0,         // never auto-retry — user can manually refresh
    });

    // ─── Swipe mutation ────────────────────────────────────────────────────────
    const {
        mutateAsync: _swipe,
        isPending: isSwipePending,
    } = useMutation({
        mutationFn: ({
            toProfileId,
            swipeType,
        }: {
            toProfileId: string;
            swipeType: SwipeType;
        }) => Swipes.swipe({ toProfileId, swipeType }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['matches'] });
        },
    });

    // Wraps the raw mutation to also record the swipe client-side
    const swipe = useCallback(
        (args: { toProfileId: string; swipeType: SwipeType }) => {
            swipedIds.current.add(args.toProfileId);
            return _swipe(args);
        },
        [_swipe],
    );

    // ─── Matches query ─────────────────────────────────────────────────────────
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

    // ─── Unmatch mutation ──────────────────────────────────────────────────────
    const {
        mutateAsync: unmatch,
        isPending: isUnmatchPending,
    } = useMutation({
        mutationFn: (matchId: string) => Matches.unmatch(matchId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['matches'] });
        },
    });

    // ─── Manual refresh (re-grab location + refetch) ──────────────────────────
    const refresh = useCallback(async () => {
        hasInitialized.current = false;
        await initLocation();
        await refetchDiscovery();
    }, [initLocation, refetchDiscovery]);

    return {
        // Filter out client-side swiped profiles in case they appear on a refetch
        // nearbyProfiles: (nearbyProfiles ?? []).filter(
        //     (p) => !swipedIds.current.has(p.userId),
        // ),
        nearbyProfiles,
        isDiscoveryLoading: isDiscoveryLoading || locationStatus === 'requesting' || locationStatus === 'updating',
        refetchDiscovery,
        isRefetchingDiscovery,
        discoveryError,

        locationStatus,
        refresh,

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

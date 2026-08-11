import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Subscriptions } from '../../api/requests';

export type SubscriptionPlan = {
    id: string;
    credits: number;
    noOfExtensions: number;
    noOfLikes: number;
    price: number;
    durationDays: number;
    razorpayPlanId: string | null;
    isActive: boolean;
};

export type UserCredits = {
    id: string;
    profileId: string;
    availableCredits: number;
    totalLiked: number;
    totalSessionExtended: number;
    lastModified: string;
};

export type CreditActionType = 'like' | 'extension';

const CREDITS_QUERY_KEY = ['user-credits'];

const useSubscriptionService = () => {
    const queryClient = useQueryClient();

    // ─── Plans ────────────────────────────────────────────────────────────────
    const {
        data: subscriptionPlans,
        isLoading: isSubscriptionPlansLoading,
    } = useQuery<SubscriptionPlan[]>({
        queryKey: ['subscription-plans'],
        queryFn: async () => {
            const res = await Subscriptions.getPlans();
            return res.data.data;
        },
        staleTime: Infinity,
        retry: 1,
    });

    // ─── Credits balance ──────────────────────────────────────────────────────
    const {
        data: userCredits,
        isLoading: isUserCreditsLoading,
        refetch: refetchCredits,
    } = useQuery<UserCredits>({
        queryKey: CREDITS_QUERY_KEY,
        queryFn: async () => {
            const res = await Subscriptions.getCredits();
            return res.data.data;
        },
        staleTime: 1000_000,
        retry: 1,
    });

    // ─── Deduct credits ───────────────────────────────────────────────────────
    const {
        mutateAsync: deductCredits,
        isPending: isDeductingCredits,
    } = useMutation({
        mutationFn: async (payload: { type: CreditActionType }) => {
            const res = await Subscriptions.deductCredits('', payload);
            return res.data as UserCredits;
        },
        // Optimistically update the cached balance immediately
        onMutate: async (payload) => {
            await queryClient.cancelQueries({ queryKey: CREDITS_QUERY_KEY });
            const previous = queryClient.getQueryData<UserCredits>(CREDITS_QUERY_KEY);
            if (previous) {
                const cost = payload.type === 'like' ? 2 : 10;
                queryClient.setQueryData<UserCredits>(CREDITS_QUERY_KEY, {
                    ...previous,
                    availableCredits: Math.max(0, previous.availableCredits - cost),
                });
            }
            return { previous };
        },
        // Roll back on error
        onError: (_err, _payload, context: any) => {
            if (context?.previous) {
                queryClient.setQueryData(CREDITS_QUERY_KEY, context.previous);
            }
        },
        // Always sync with the server response
        onSuccess: () => refetchCredits(),
    });

    return {
        // Plans
        subscriptionPlans,
        isSubscriptionPlansLoading,

        // Credits
        userCredits,
        isUserCreditsLoading,
        refetchCredits,

        // Deduct
        deductCredits,
        isDeductingCredits,
    };
};

export default useSubscriptionService;

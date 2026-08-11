import { useQuery } from '@tanstack/react-query';
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

const useSubscriptionService = () => {
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

    return {
        subscriptionPlans,
        isSubscriptionPlansLoading,
    };
};

export default useSubscriptionService;

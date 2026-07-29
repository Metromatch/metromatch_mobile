// create profile
import { useMutation } from "@tanstack/react-query";
import { Payments } from "../../api/requests";

const usePaymentService = ({
}: {
    }) => {
    const {
        mutateAsync: createPaymentOrder,
        isPending: isCreatePaymentOrderLoading,
    } = useMutation({
        mutationFn: async (payload: { planId: string }) => {
            const res = await Payments.createPaymentOrder('', payload)
            return res.data.data
        },
    });

    const {
        mutateAsync: verifyPayment,
        isPending: isVerifyPaymentLoading,
    } = useMutation({
        mutationFn: async (payload: { planId: string, razorpayOrderId: string, razorpayPaymentId: string, razorpaySignature: string }) => {
            const res = await Payments.verifyPayment('', payload)
            return res.data.data
        },
    });

    return {
        createPaymentOrder,
        isCreatePaymentOrderLoading,

        verifyPayment,
        isVerifyPaymentLoading,
    }
}

export default usePaymentService;
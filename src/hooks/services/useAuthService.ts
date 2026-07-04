import { useMutation } from "@tanstack/react-query";
import { Auth } from "../../api/requests";
import { clearStore } from "@/utils/authUtils";
import { router } from "expo-router";

interface LoginPayload {
    email: string;
    password: string;
    deviceId: string | null;
    deviceName: string | null;
}

interface SignupPayload {
    email: string;
    password: string;
    deviceId: string | null;
    deviceName: string | null;
    phone?: string;
}

const useAuthService = () => {
    const {
        mutateAsync: login,
        isPending: isLoginLoading,
    } = useMutation({
        mutationFn: ({ payload }: { payload: LoginPayload }) => Auth.login('', payload),
    });

    const {
        mutateAsync: signup,
        isPending: isSignupLoading,
    } = useMutation({
        mutationFn: ({ payload }: { payload: SignupPayload }) => Auth.signup('', payload),
    });

    const {
        mutateAsync: logout,
        isPending: isLogoutLoading,
    } = useMutation({
        mutationFn: () => Auth.logout(),
        onSettled: () => {
            // Clear local state regardless of API success/failure
            clearStore();
            router.replace('/login');
        },
    });

    return {
        login,
        isLoginLoading,
        signup,
        isSignupLoading,
        logout,
        isLogoutLoading,
    }
}

export default useAuthService;
import { useMutation } from "@tanstack/react-query";
import { Auth } from "../../api/requests";

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

    return {
        login,
        isLoginLoading,
        signup,
        isSignupLoading,
    }
}

export default useAuthService;
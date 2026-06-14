import { useMutation } from "@tanstack/react-query";
import { Auth } from "../../api/requests";

interface LoginPayload {
    email: string;
    password: string;
    deviceId: string | null;
    deviceName: string | null;
}

const useAuthService = () => {
    const {
        mutateAsync: login,
        isPending: isLoginLoading,
    } = useMutation({
        mutationFn: ({ payload }: { payload: LoginPayload }) => Auth.login('', payload),
    });

    return {
        login,
        isLoginLoading,
    }
}

export default useAuthService;
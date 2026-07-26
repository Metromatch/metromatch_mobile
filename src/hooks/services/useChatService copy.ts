// create profile
import { useMutation } from "@tanstack/react-query";
import { Chat } from "../../api/requests";

const useChatService = ({
}: {
    }) => {
    const {
        mutateAsync: getChatToken,
        isPending: isChatTokenLoading,
        data: chatToken,
    } = useMutation({
        mutationFn: async () => {
            const res = await Chat.getToken()
            return res.data.data.token
        },
    });

    return {
        getChatToken,
        chatToken,
        isChatTokenLoading,
    }
}

export default useChatService;
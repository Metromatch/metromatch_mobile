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

    const {
        mutateAsync: getTwillioChatToken,
        isPending: isTwillioChatTokenLoading,
        data: twillioChatToken,
    } = useMutation({
        mutationFn: async ({ identity, recipientId }: { identity: string; recipientId: string }) => {
            const res = await Chat.getTwilioToken('', { identity, recipientId })
            return res.data.data
        },
    });

    return {
        getChatToken,
        chatToken,
        isChatTokenLoading,

        getTwillioChatToken,
        twillioChatToken,
        isTwillioChatTokenLoading,
    }
}

export default useChatService;
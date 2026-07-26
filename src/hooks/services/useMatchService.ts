// create profile
import { useMutation } from "@tanstack/react-query";
import { Matches } from "../../api/requests";

const useMatchService = ({
}: {
    }) => {


    const {
        mutateAsync: getMatches,
        isPending: isMatchesLoading,
        data: matches,
    } = useMutation({
        mutationFn: async () => {
            const res = await Matches.getMatches()
            return res.data.data
        },
    });

    return {
        getMatches,
        matches,
        isMatchesLoading,
    }
}

export default useMatchService;
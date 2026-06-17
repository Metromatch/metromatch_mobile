import { MasterList } from "@/api/requests";
import { useQuery } from "@tanstack/react-query"

const useMasterListQuery = () => {
    const {
        data: masterlist,
        isLoading: isMasterListLoading,
    } = useQuery({
        queryKey: ['master-list'],
        queryFn: async () => {
            const res = await MasterList.masterList('', { keys: ['gender', 'religion', 'diet', 'smokingHabits', 'drinkingHabits', 'travelTimeRange', 'interestedIn', 'relationshipPreference', 'height'] });
            return res.data.data;
        }
    })

    return {
        masterlist,
        isMasterListLoading,
    }

}

export default useMasterListQuery
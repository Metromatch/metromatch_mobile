import { MasterList } from "@/api/requests";
import { useQuery } from "@tanstack/react-query"

const useMasterListQuery = () => {
    const {
        data: masterlist,
        isLoading: isMasterListLoading,
    } = useQuery({
        queryKey: ['master-list'],
        queryFn: async () => {
            const res = await MasterList.masterList('', { keys: ['gender', 'religion', 'diet', 'smokingHabits', 'drinkingHabits', 'travelTimeRange', 'interestedIn', 'relationshipPreference', 'height', 'vibe', 'travelFrequency'] });
            return res.data.data;
        }
    })

    const {
        data: metroStationList,
        isLoading: isMetroStationListLoading,
    } = useQuery({
        queryKey: ['metro-station-list'],
        queryFn: async () => {
            const { data } = await MasterList.metroStationList('', {
                place: 'delhi'
            });
            const metroStationList = data?.data?.map((item: any) => {
                return {
                    label: item.name,
                    value: item.unique_name_and_place
                }
            }) || []
            return metroStationList;
        }
    })

    return {
        masterlist,
        isMasterListLoading,

        metroStationList,
        isMetroStationListLoading,
    }

}

export default useMasterListQuery
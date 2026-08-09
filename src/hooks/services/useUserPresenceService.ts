// create profile
import { useMutation } from "@tanstack/react-query";
import { Presence } from "../../api/requests";

const useUserPresenceService = ({
}: {
    }) => {
    const {
        mutateAsync: getHeatMapData,
        isPending: isHeatMapDataLoading,
        data: heatMapData,
    } = useMutation({
        mutationFn: async (payload: { lat: number, lng: number, stationRadius: number }) => {
            const res = await Presence.presenceList('', payload)
            return res.data.data
        },
    });

    return {
        getHeatMapData,
        isHeatMapDataLoading,
        heatMapData,
    }
}

export default useUserPresenceService;
import { router } from "expo-router";
import { Alert } from "react-native";
import useSubscriptionService from "../services/useSubscriptionService";
const remainingMinutes = (date1: Date, date2: Date = new Date()) => {
    const diffInMilliseconds = date2.getTime() - date1.getTime()
    const diffInMinutes = diffInMilliseconds / (1000 * 60)
    if (diffInMinutes > 10) {
        return 0
    } else {
        return 10 - diffInMinutes
    }
}

export default function useCheckCredits() {
    const { userCredits } = useSubscriptionService();

    const hasCredits = (required = 2) => {
        if (userCredits) {
            if ((userCredits.availableCredits) < required) {
                Alert.alert(
                    'Insufficient Credits',
                    `Please buy credits to continue.`,
                    [
                        {
                            text: 'Cancel',
                            style: 'cancel',
                        },
                        {
                            text: 'Get More Credits',
                            onPress: () => {
                                // Handle navigation to the credits/subscription screen
                                router.navigate('/subscription/planlist'); // Adjust the route as per your app structure
                            },
                        },
                    ]
                );
                return false;
            }
            return true;
        }
    }
    const hasRemainingMinutes = () => {
        if (userCredits) {
            const remaining = remainingMinutes(new Date(userCredits.lastExtended))
            if (remaining === 0 && (userCredits.availableCredits || 0) >= 10) {
                Alert.alert(
                    'Insufficient minutes',
                    `Please extend minutes to continue.`,
                    [
                        {
                            text: 'Cancel',
                            style: 'cancel',
                        },
                        {
                            text: 'Ok',
                            onPress: () => { },
                        },
                    ]
                );
                return false;
            }
            if (remaining === 0 && (userCredits.availableCredits || 0) < 10) {
                Alert.alert(
                    'Insufficient minutes',
                    `Please extend minutes to continue.`,
                    [
                        {
                            text: 'Cancel',
                            style: 'cancel',
                        },
                        {
                            text: 'Ok',
                            onPress: () => { },
                        },
                    ]
                );
                return false;
            }
            return true;
        }
        return false;
    }
    return {
        hasCredits,
        hasRemainingMinutes
    }
}
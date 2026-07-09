export const initialValues = {
    formValues: {
        name: null,
        dob: null,
        gender: null,
        profession: null,
        height: null,
        religion: null,
        diet: null,
        drinkingHabits: null,
        smokingHabits: null,
        vibe: null,
        lookingFor: null,
        interestedIn: null,
        prefMinAge: null,
        prefMaxAge: null,
        prefMinHeight: null,
        prefMaxHeight: null,
        prefReligion: null,
        prefDiet: null,
        prefDrinkingHabits: null,
        prefSmokingHabits: null,
        frequentMetroStation: null,
        travelTimeSlots: null,
        travelFrequency: null,
        // relationshipPreference: null,
    },
}

export type OnboardingStepsProperties = {
    formValues: {
        name: string | null;
        dob: string | null;
        gender: string | null;
        profession: string | null,
        height: string | null,
        religion: string | null,
        diet: string | null,
        drinkingHabits: string | null,
        smokingHabits: string | null,
        vibe: string[] | null,
        lookingFor: string | null,
        interestedIn: string | null,
        prefMinAge: string | null,
        prefMaxAge: string | null,
        prefMinHeight: string | null,
        prefMaxHeight: string | null,
        prefReligion: string | null,
        prefDiet: string | null,
        prefDrinkingHabits: string | null,
        prefSmokingHabits: string | null,
        frequentMetroStation: string | null,
        travelTimeSlots: string[] | null,
        travelFrequency: string | null,
        // relationshipPreference: string | null,
    };
}

const onboardingStepsSlice = (set: any, get: any) => {
    const Set = (data: Partial<OnboardingStepsProperties>) => {
        set((state: any) => ({
            onboardingSteps: {
                ...state.onboardingSteps,
                ...data,
            },
        }));
    };

    return ({
        onboardingSteps: initialValues,
        setOnboardingFormValues: (data: Partial<OnboardingStepsProperties['formValues']>) => {
            Set({
                formValues: {
                    ...get().onboardingSteps.formValues,
                    ...data,
                },
            });
        },
        clearOnboardingFormValues: () => {
            Set({
                formValues: initialValues.formValues
            });
        }
    });
};

export default onboardingStepsSlice;

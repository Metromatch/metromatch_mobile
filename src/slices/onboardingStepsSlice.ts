export const initialValues = {
    formValues: {
        name: "",
        dob: "",
        gender: "",
        profession: "",
        height: "",
        religion: "",
        diet: "",
        drinking: "",
        smoking: "",
        vibe: "",
        lookingFor: "",
        interestedIn: "",
    },
}

export type OnboardingStepsProperties = {
    formValues: {
        name: string;
        dob: string | null;
        gender: string;
        profession: string,
        height: string | null,
        religion: string | null,
        diet: string | null,
        drinking: string | null,
        smoking: string | null,
        vibe: string | null,
        lookingFor: string | null,
        interestedIn: string | null,
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

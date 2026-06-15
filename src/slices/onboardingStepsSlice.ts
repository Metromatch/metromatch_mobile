export const initialValues = {
    formValues: {
        name: "",
        dob: "",
        gender: "",
        profession: "",
        height: null,
        religion: "",
        diet: "",
        drinking: "",
        smoking: "",
    },
}

export type OnboardingStepsProperties = {
    formValues: {
        name: string;
        dob: string;
        gender: string;
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

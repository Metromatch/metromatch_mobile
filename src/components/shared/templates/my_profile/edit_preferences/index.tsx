import FormInput from '@/components/general/atoms/form_input'
import PrimaryButton from '@/components/general/atoms/primary_button'
import SecondaryButton from '@/components/general/atoms/secondary_button '
import ChipSelector from '@/components/general/molecules/chip_selector'
import BottomSheet from '@/components/general/organisms/bottom_sheet'
import FormSelect from '@/components/general/organisms/form_select'
import useMasterListQuery from '@/hooks/services/useMasterListQuery'
import useProfileService from '@/hooks/services/useProfileService'
import { useFormValidation } from '@/hooks/useFormValidation'
import { responsiveSize } from '@/utils/responsive'
import { ScrollView, StyleSheet, View } from 'react-native'


const validateAge = (value: number | string) => {
    if (!value) return null;
    if (Number(value) < 18) {
        return 'Age can not be less than 18';
    }
    if (Number(value) > 100) {
        return 'Age can not be more than 100';
    }
    return null;
}

const validateMaxAge = (value: number | string, minAge: number | string) => {
    if (!value) return null;
    const error = validateAge(value)
    if (error) return error
    if (Number(value) < Number(minAge)) {
        return 'Max age can not be less than min age';
    }
    return null;
}

const EditPreferences = ({ onClose }: any) => {
    const { masterlist } = useMasterListQuery();
    const { myProfile, isMyProfileRefetching, refetchMyProfile, updateProfile, isUpdateProfileLoading } =
        useProfileService({ fetchMyProfile: true });
    const preferences = myProfile?.preferences;

    const { values, errors, handleChange, validateAll } = useFormValidation({
        prefMinAge: String(preferences?.prefMinAge) || null,
        prefMaxAge: String(preferences?.prefMaxAge) || null,
        prefMinHeight: preferences?.prefMinHeight || null,
        prefMaxHeight: preferences?.prefMaxHeight || null,
        prefReligion: preferences?.prefReligion || null,
        prefDiet: preferences?.prefDiet || null,
        prefDrinkingHabits: preferences?.prefDrinkingHabits || null,
        prefSmokingHabits: preferences?.prefSmokingHabits || null,
    }, {
        prefMinAge: { required: true, validate: validateAge },
        prefMaxAge: { required: true, validate: (value: any, currentValues: any): string | null => validateMaxAge(value, currentValues.prefMinAge) },
    })
    // console.log('preferences', preferences)
    const onPressApply = async () => {
        if (!validateAll()) return;
        await updateProfile({ payload: values })
        await refetchMyProfile()
        onClose()
    }
    return (
        <BottomSheet
            isVisible
            onClose={() => onClose(false)}
            title='Edit Preferences'
        >
            {/* <View> */}
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.formContainer}>
                <View style={styles.row}>
                    <FormInput
                        flex1
                        label="Min Age"
                        required
                        placeholder="Enter min age"
                        value={values.prefMinAge || ''}
                        onChangeText={(text) => handleChange('prefMinAge', text)}
                        error={errors.prefMinAge}
                        keyboardType="numeric"
                    />
                    <FormInput
                        flex1
                        label="Max Age"
                        required
                        placeholder="Enter max age"
                        value={values.prefMaxAge || ''}
                        onChangeText={(text) => handleChange('prefMaxAge', text)}
                        error={errors.prefMaxAge}
                        keyboardType="numeric"
                    />
                </View>
                <View style={styles.row}>
                    <FormSelect
                        flex1
                        label="Min Height"
                        placeholder="Preferred min height"
                        value={values.prefMinHeight}
                        error={errors.prefMinHeight}
                        options={masterlist?.height || []}
                        onChange={(value) => handleChange('prefMinHeight', value)}
                        icon="person-outline"
                    />
                    <FormSelect
                        flex1
                        label="Max Height"
                        placeholder="Preferred max height"
                        value={values.prefMaxHeight}
                        error={errors.prefMaxHeight}
                        options={masterlist?.height || []}
                        onChange={(value) => handleChange('prefMaxHeight', value)}
                        icon="person-outline"
                    />
                </View>

                <FormSelect
                    flex1
                    label="Religion"
                    placeholder="Preferred religion"
                    value={values.prefReligion}
                    error={errors.prefReligion}
                    options={masterlist?.religion || []}
                    onChange={(value) => handleChange('prefReligion', value)}
                    icon="leaf-outline"
                />

                <ChipSelector
                    label="Diet Preferences"
                    options={masterlist?.diet || []}
                    value={values.prefDiet}
                    error={errors.prefDiet}
                    onChange={(value) => handleChange('prefDiet', value)}
                />

                <View style={styles.row}>
                    <ChipSelector
                        label="Drinking"
                        options={masterlist?.drinkingHabits || []}
                        value={values.prefDrinkingHabits}
                        error={errors.prefDrinkingHabits}
                        onChange={(value) => handleChange('prefDrinkingHabits', value)}
                        activeIconMode="check"
                        style={{ flex: 1 }}
                        direction="vertical"
                    />

                    <ChipSelector
                        label="Smoking"
                        options={masterlist?.smokingHabits || []}
                        value={values.prefSmokingHabits}
                        error={errors.prefSmokingHabits}
                        onChange={(value) => handleChange('prefSmokingHabits', value)}
                        activeIconMode="check"
                        style={{ flex: 1 }}
                        direction="vertical"
                    />
                </View>
            </ScrollView>
            {/* </View> */}
            <View style={styles.footerButtons}>

                <SecondaryButton
                    title="Cancel"
                    onPress={onClose}
                    containerStyle={styles.button}

                />
                <PrimaryButton
                    title="Apply"
                    onPress={onPressApply}
                    containerStyle={styles.button}
                    loading={isUpdateProfileLoading || isMyProfileRefetching}

                />
            </View>
        </BottomSheet>
    )
}

export default EditPreferences

const styles = StyleSheet.create({
    formContainer: {
        gap: responsiveSize(15),
        paddingBottom: responsiveSize(10),
    },
    row: {
        flexDirection: 'row',
        gap: responsiveSize(15),
        width: '100%'
    },
    footerButtons: {
        flexDirection: 'row',
        gap: responsiveSize(15),
        borderTopWidth: responsiveSize(1),
        borderTopColor: '#F0F0F0',
        paddingTop: responsiveSize(10),
        backgroundColor: 'white',

    },
    button: {
        flex: 1,
    },
});
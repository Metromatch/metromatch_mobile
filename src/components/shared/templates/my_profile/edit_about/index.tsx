import FormInput from '@/components/general/atoms/form_input'
import PrimaryButton from '@/components/general/atoms/primary_button'
import SecondaryButton from '@/components/general/atoms/secondary_button '
import ChipSelector from '@/components/general/molecules/chip_selector'
import BottomSheet from '@/components/general/organisms/bottom_sheet'
import FormSelect from '@/components/general/organisms/form_select'
import { COLORS } from '@/constants/theme'
import useMasterListQuery from '@/hooks/services/useMasterListQuery'
import useProfileService from '@/hooks/services/useProfileService'
import { useFormValidation } from '@/hooks/useFormValidation'
import { responsiveSize } from '@/utils/responsive'
import Ionicons from '@expo/vector-icons/Ionicons'
import { ScrollView, StyleSheet, View } from 'react-native'

const EditAbout = ({
    onApply, onClose
}: any) => {
    const { masterlist } = useMasterListQuery();
    const { myProfile, isMyProfileRefetching, refetchMyProfile, updateProfile, isUpdateProfileLoading } =
        useProfileService({ fetchMyProfile: true });
    const profile = myProfile?.profile;

    const { values, errors, handleChange, validateAll } = useFormValidation({
        bio: profile?.bio || '',
        profession: profile?.profession || '',
        height: profile?.height,
        religion: profile?.religion,
        diet: profile?.diet,
        drinkingHabits: profile?.drinkingHabits,
        smokingHabits: profile?.smokingHabits,
        travelFrequency: profile?.travelFrequency,
        travelTimeSlots: profile?.travelTimeSlots,
    }, {
        bio: {
            required: true, message: 'Required', validate: (value: string) => {
                if (value.length < 20) {
                    return 'Bio must be at least 20 characters';
                }
                if (value.length > 200) {
                    return 'Bio must be at most 200 characters';
                }
                return null;
            }
        },
        profession: { required: true, message: 'Required' },
    })

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
            title='Edit About'
        >
            {/* <View> */}
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.formContainer}>
                <FormInput
                    label="Your Bio"
                    required
                    placeholder="Write something about yourself..."
                    value={values.bio}
                    onChangeText={(text) => handleChange('bio', text)}
                    error={errors.bio}
                    multiline
                />
                <FormInput
                    label="Profession"
                    required
                    placeholder="Engineer, Student, Doctor, etc."
                    value={values.profession}
                    onChangeText={(text) => handleChange('profession', text)}
                    error={errors.profession}
                    addonLeft={<Ionicons name="briefcase-outline" size={responsiveSize(16)} color={COLORS.textSecondary} />}

                />
                <View style={styles.row}>
                    <FormSelect
                        flex1
                        label="Height"
                        placeholder="Select your height"
                        value={values.height}
                        icon="person-outline"
                        options={masterlist?.height || []}
                        onChange={(value) => handleChange('height', value)}
                    />
                    <FormSelect
                        flex1
                        label="Religion"
                        placeholder="Select religion"
                        value={values.religion}
                        icon="leaf-outline"
                        options={masterlist?.religion || []}
                        onChange={(value) => handleChange('religion', value)}
                    />
                </View>
                <ChipSelector
                    label="Diet"
                    options={masterlist?.diet || []}
                    value={values.diet}
                    // error={errors.diet}
                    onChange={(value) => handleChange('diet', value)}
                />

                <View style={styles.row}>
                    <ChipSelector
                        label="Drinking"
                        options={masterlist?.drinkingHabits || []}
                        value={values.drinkingHabits}
                        onChange={(value) => handleChange('drinkingHabits', value)}
                        activeIconMode="check"
                        style={{ flex: 1 }}
                        direction="vertical"
                    />

                    <ChipSelector
                        label="Smoking"
                        options={masterlist?.smokingHabits || []}
                        value={values.smokingHabits}
                        onChange={(value) => handleChange('smokingHabits', value)}
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

export default EditAbout

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
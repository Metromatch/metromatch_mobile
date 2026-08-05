import FormInput from '@/components/general/atoms/form_input'
import PrimaryButton from '@/components/general/atoms/primary_button'
import SecondaryButton from '@/components/general/atoms/secondary_button '
import ChipSelector from '@/components/general/molecules/chip_selector'
import BottomSheet from '@/components/general/organisms/bottom_sheet'
import FormSelect from '@/components/general/organisms/form_select'
import useMasterListQuery from '@/hooks/services/useMasterListQuery'
import { responsiveSize } from '@/utils/responsive'
import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'

const PreferenceFilter = ({
    selectedFilters, onApply, onReset, onClose
}: any) => {
    const { masterlist } = useMasterListQuery();

    const [values, setValues] = useState(selectedFilters);

    useEffect(() => {
        if (selectedFilters) {
            setValues(selectedFilters);
        }
    }, [selectedFilters]);

    const handleChange = (field: string, value: any) => {
        setValues((prev: any) => ({
            ...prev,
            [field]: value,
        }));
    };

    const onPressApply = () => {
        onApply({
            ...values,
            prefMinAge: Number(values.prefMinAge),
            prefMaxAge: Number(values.prefMaxAge),
        })
    }
    return (
        <BottomSheet
            isVisible
            onClose={() => onClose(false)}
            title='Partner Preferences'
        >
            {/* <View> */}
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.formContainer}>

                <View style={styles.row}>
                    <FormInput
                        flex1
                        label="Min Age"
                        placeholder="Enter min age"
                        value={values.prefMinAge || ''}
                        onChangeText={(text) => handleChange('prefMinAge', text)}
                        keyboardType="numeric"
                        required
                    />
                    <FormInput
                        flex1
                        label="Max Age"
                        placeholder="Enter max age"
                        value={values.prefMaxAge || ''}
                        onChangeText={(text) => handleChange('prefMaxAge', text)}
                        keyboardType="numeric"
                        required
                    />
                </View>
                <View style={styles.row}>
                    <FormSelect
                        flex1
                        label="Min Height"
                        placeholder="Preferred min height"
                        value={values.prefMinHeight}
                        options={masterlist?.height || []}
                        onChange={(value) => handleChange('prefMinHeight', value)}
                        icon="person-outline"
                    />
                    <FormSelect
                        flex1
                        label="Max Height"
                        placeholder="Preferred max height"
                        value={values.prefMaxHeight}
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
                    options={masterlist?.religion || []}
                    onChange={(value) => handleChange('prefReligion', value)}
                    icon="leaf-outline"
                />

                <ChipSelector
                    label="Diet Preferences"
                    options={masterlist?.diet || []}
                    value={values.prefDiet}
                    onChange={(value) => handleChange('prefDiet', value)}
                />

                <View style={styles.row}>
                    <ChipSelector
                        label="Drinking"
                        options={masterlist?.drinkingHabits || []}
                        value={values.prefDrinkingHabits}
                        onChange={(value) => handleChange('prefDrinkingHabits', value)}
                        activeIconMode="check"
                        style={{ flex: 1 }}
                        direction="vertical"
                    />

                    <ChipSelector
                        label="Smoking"
                        options={masterlist?.smokingHabits || []}
                        value={values.prefSmokingHabits}
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
                    title="Reset"
                    onPress={onReset}
                    containerStyle={styles.button}

                />
                <PrimaryButton
                    title="Apply"
                    onPress={onPressApply}
                    containerStyle={styles.button}

                />
            </View>
        </BottomSheet>
    )
}

export default PreferenceFilter

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
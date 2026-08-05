import InfoBox from '@/components/general/molecules/info_box'
import useMasterListQuery from '@/hooks/services/useMasterListQuery';
import React from 'react'
import { StyleSheet, View } from 'react-native'

const Preference = ({ preference, profile }: { preference: any, profile: any }) => {
    const { masterlist } = useMasterListQuery();

    const getLabel = (type: string, value: string) => masterlist?.[type]?.find((item: any) => item.value === value)?.label || '—'

    const getHeightRange = () => {
        if (!preference?.prefMinHeight && !preference?.prefMaxHeight) {
            return '—'
        }
        if (preference?.prefMinHeight && !preference?.prefMaxHeight) {
            return getLabel('height', preference?.prefMinHeight) + '+'
        }
        if (preference?.prefMaxHeight && !preference?.prefMinHeight) {
            return 'Upto ' + getLabel('height', preference?.prefMaxHeight)
        }
        return getLabel('height', preference?.prefMinHeight) + ' - ' + getLabel('height', preference?.prefMaxHeight)

    }

    return (
        <View style={styles.section}>
            <InfoBox
                icon='heart-outline'
                title='Looking For'
                list={[
                    { title: 'Relationship Type', value: getLabel('relationshipPreference', profile?.relationshipPreference) },
                ]}
            />

            <InfoBox
                icon='options-outline'
                title='My Preferences'
                list={[
                    { title: 'Interested In', value: getLabel('interestedIn', profile?.interestedIn) },
                    { title: 'Age Range', value: preference?.prefMinAge + ' - ' + preference?.prefMaxAge + ' years' },
                    { title: 'Height Range', value: getHeightRange() },
                    { title: 'Religion', value: getLabel('religion', preference?.prefReligion) },
                    { title: 'Diet', value: getLabel('diet', preference?.prefDiet) },
                ]}
            />

            <InfoBox
                icon='subway-outline'
                title='Metro Travel'
                list={[
                    { title: 'Metro Stations', value: '—' },
                ]}
            />
        </View>
    )
}

export default Preference

const styles = StyleSheet.create({
    section: {
        gap: 12,
    }
})
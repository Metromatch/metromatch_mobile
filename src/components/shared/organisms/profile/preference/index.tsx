import InfoBox from '@/components/general/molecules/info_box'
import React from 'react'
import { StyleSheet, View } from 'react-native'

const Preference = ({ preference }: { preference: any }) => {
    console.log(preference);

    return (
        <View style={styles.section}>
            <InfoBox
                icon='heart-outline'
                title='Looking For'
                list={[
                    { title: 'Relationship', value: preference?.relationshipPreference },
                ]}
            />

            <InfoBox
                icon='options-outline'
                title='My Preferences'
                list={[
                    { title: 'Interested In', value: preference?.interestedIn },
                    { title: 'Age Range', value: preference?.prefMinAge + '-' + preference?.prefMaxAge },
                    { title: 'Height Range', value: preference?.prefMinHeight + '-' + preference?.prefMaxHeight },
                    { title: 'Religion', value: preference?.prefReligion },
                    { title: 'Diet', value: preference?.prefDiet },
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
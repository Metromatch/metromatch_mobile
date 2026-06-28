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
                    { title: 'Age Range', value: preference?.minAge + '-' + preference?.maxAge },
                    { title: 'Height Range', value: preference?.minHeight + '-' + preference?.maxHeight },
                    { title: 'Religion', value: preference?.religion },
                    { title: 'Diet', value: preference?.diet },
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
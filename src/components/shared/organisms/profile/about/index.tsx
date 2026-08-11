import InfoBox from '@/components/general/molecules/info_box'
import useMasterListQuery from '@/hooks/services/useMasterListQuery';
import dayjs from 'dayjs';
import React from 'react'
import { StyleSheet, View } from 'react-native'

function formatDob(dob: string | null): string {
    if (!dob) return '—';
    return dayjs(dob).format('DD MMM YYYY');
}


const About = ({ profile, onEdit }: { profile: any, onEdit: () => void }) => {
    const { masterlist } = useMasterListQuery();

    const getLabel = (type: string, value: string) => masterlist?.[type]?.find((item: any) => item.value === value)?.label || '—'
    return (
        <View style={styles.section}>
            <InfoBox
                title='Basic Info'
                icon='information-circle-outline'
                list={[
                    { title: 'Full Name', value: profile?.name || '—' },
                    { title: 'Date of Birth', value: formatDob(profile?.dob) || '—' },
                    { title: 'Gender', value: profile?.gender || '—' },
                    // { title: 'Email', value: profile?.email || '—' },
                    // { title: 'Phone Number', value: profile?.phone || '—' },
                ]}
            />

            <InfoBox
                title='About Me'
                icon="chatbubble-ellipses-outline"
                list={[
                    { title: 'Bio', value: profile?.bio || 'No bio yet — tell the world about yourself!' },
                ]}
                onEdit={onEdit}
            />

            <InfoBox
                title='Lifestyle'
                icon='sparkles-outline'
                list={[
                    { title: 'Profession', value: profile?.profession || '—' },
                    { title: 'Height', value: getLabel('height', profile?.height) },
                    { title: 'Religion', value: getLabel('religion', profile?.religion) },
                    { title: 'Diet', value: getLabel('diet', profile?.diet) },
                    { title: 'Smoking', value: getLabel('smokingHabits', profile?.smokingHabits) },
                    { title: 'Drinking', value: getLabel('drinkingHabits', profile?.drinkingHabits) },
                ]}
                onEdit={onEdit}
            />
        </View>
    )
}

export default About

const styles = StyleSheet.create({
    section: {
        gap: 12,
    }
})
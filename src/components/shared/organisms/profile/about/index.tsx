import InfoBox from '@/components/general/molecules/info_box'
import dayjs from 'dayjs';
import React from 'react'
import { StyleSheet, View } from 'react-native'

function formatDob(dob: string | null): string {
    if (!dob) return '—';
    return dayjs(dob).format('DD MMM YYYY');
}

const About = ({ profile }: { profile: any }) => {
    return (
        <View style={styles.section}>
            <InfoBox
                title='Basic Info'
                icon='information-circle-outline'
                list={[
                    { title: 'Full Name', value: profile?.name || '—' },
                    { title: 'Date of Birth', value: formatDob(profile?.dob) || '—' },
                    { title: 'Gender', value: profile?.gender || '—' },
                    { title: 'Email', value: profile?.email || '—' },
                    { title: 'Phone Number', value: profile?.phone || '—' },
                ]}
            />

            <InfoBox
                title='About Me'
                icon="chatbubble-ellipses-outline"
                list={[
                    { title: 'Bio', value: profile?.bio || 'No bio yet — tell the world about yourself!' },
                ]}
            />

            <InfoBox
                title='Lifestyle'
                icon='sparkles-outline'
                list={[
                    { title: 'Profession', value: profile?.profession || '—' },
                    { title: 'Height', value: profile?.height || '—' },
                    { title: 'Religion', value: profile?.religion || '—' },
                    { title: 'Diet', value: profile?.diet || '—' },
                    { title: 'Smoking', value: profile?.smoking || '—' },
                    { title: 'Drinking', value: profile?.drinking || '—' },
                ]}
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
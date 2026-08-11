import { responsiveSize } from '@/utils/responsive';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react'
import { Text, View } from 'react-native';
import { B2 } from '../body_text';

const getMMSSFromMinutes = (seconds: number) => {
    const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
    const ss = String(Math.ceil(seconds) % 60).padStart(2, "0");
    return `${mm}:${ss}`;
}

const CountdownTimer = ({ remainingMinutes }: { remainingMinutes: number }) => {
    const [timeLeft, setTimeLeft] = useState(0);
    useEffect(() => {
        setTimeLeft(remainingMinutes * 60)
    }, [remainingMinutes])

    useEffect(() => {
        const timer = setInterval(() => {
            if (timeLeft > 0) {
                setTimeLeft((prev) => prev - 2);
            } else {
                clearInterval(timer);
            }
        }, 2000);
        return () => clearInterval(timer);
    }, [timeLeft])
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="time" size={responsiveSize(24)} color="white" />
            <B2 type='medium' textColor='white' >{`${getMMSSFromMinutes(timeLeft)} remaining`}</B2>
        </View>
    )
}

export default CountdownTimer

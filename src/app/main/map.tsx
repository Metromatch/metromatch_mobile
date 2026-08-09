// import React from 'react';
// import { View, Text, StyleSheet } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { COLORS } from '@/constants/theme';
// import AppContainer from '@/components/shared/layout/app_container';

// export default function MapsScreen() {
//   return (
//     <AppContainer includeBgImage>
//       <SafeAreaView>
//         <Text style={styles.title}>Maps</Text>
//       </SafeAreaView>
//     </AppContainer>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.white,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   title: {
//     fontSize: 24,
//     fontFamily: 'Poppins_600SemiBold',
//     color: COLORS.textPrimary,
//   },
// });


import AppContainer from '@/components/shared/layout/app_container';
import useUserPresenceService from '@/hooks/services/useUserPresenceService';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Heatmap, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';


// Array of coordinates with optional intensity weights
const heatmapPoints = [
  { latitude: 37.78825, longitude: -122.4324, weight: 100 },
  { latitude: 37.78225, longitude: -122.4424, weight: 56 },
  { latitude: 37.78925, longitude: -122.4224, weight: 22 },
];

export default function MapsScreen() {

  const { getHeatMapData, isHeatMapDataLoading, heatMapData } = useUserPresenceService({});

  const fetchHeatMapData = async () => {

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        const res = await getHeatMapData({
          lat: 28.6328 || loc.coords.latitude,
          lng: 77.2197 || loc.coords.longitude,
          stationRadius: 200,
        });
        console.log('heatMapData', res)
      }
    } catch (error) {
      console.error('Error fetching heat map data:', error);
    }
  }
  // console.log('heatMapData', heatMapData)
  useEffect(() => {
    fetchHeatMapData();
  }, [])
  return (
    <AppContainer includeBgImage>
      <View style={styles.container}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          <Heatmap
            points={heatmapPoints}
            radius={40}
            opacity={0.7}
            gradient={{
              colors: ['#79BC6A', '#BBCF4C', '#EEC20B', '#F29305', '#E50000'],
              startPoints: [0.01, 0.25, 0.5, 0.75, 1.0],
              colorMapSize: 256,
            }}
          />
        </MapView>
      </View>
    </AppContainer>

  );
}

const styles = StyleSheet.create({
  container: {
    // ...StyleSheet.absoluteFill,
    // justifyContent: 'end',
    // alignItems: 'center',
    height: 500,
    width: '100%'
  },
  map: {
    ...StyleSheet.absoluteFill,
  },
});

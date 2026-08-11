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
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import MapView, { Heatmap, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { responsiveSize } from '@/utils/responsive';
import FormSelect from '@/components/general/organisms/form_select';
import { H4 } from '@/components/general/atoms/heading_text';
import { COLORS, TYPOGRAPHY } from '@/constants/theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { B3 } from '@/components/general/atoms/body_text';
import VerticalTabs from '@/components/general/molecules/vertical_tabs';


// Array of coordinates with optional intensity weights
const heatmapPoints = [
  { latitude: 37.78825, longitude: -122.4324, weight: 100 },
  { latitude: 37.78225, longitude: -122.4424, weight: 56 },
  { latitude: 37.78925, longitude: -122.4224, weight: 22 },
];
const tabList: any = [
  { id: "metro", label: "Metro", activeIcon: "train", inactiveIcon: "train-outline", key: 'stations' },
  { id: "college", label: "Colleges", activeIcon: "school", inactiveIcon: "school-outline", key: 'colleges' },
  { id: "socity", label: "Societies", activeIcon: "home", inactiveIcon: "home-outline", key: 'societies' },
];

export default function MapsScreen() {
  const [selectedCity, setSelectedCity] = useState<null | string>(null)
  const [activeSection, setActiveSection] = useState<'metro' | 'college' | 'socity'>('metro');
  const { getHeatMapData, isHeatMapDataLoading, heatMapData } = useUserPresenceService({});

  const fetchHeatMapData = async () => {

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        const res = await getHeatMapData({
          lat: 37.78825 || loc.coords.latitude,
          lng: -122.4324 || loc.coords.longitude,
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

  // const stations: Array<{ station: { id: string; name: string; city: string; latitude: number; longitude: number; distanceFromUserMeters: number }; userCount: number }> = heatMapData ?? [];
  return (

    <ScrollView contentContainerStyle={styles.container}>
      <FormSelect
        options={[{ label: 'Delhi', value: 'Delhi' }]}
        value={selectedCity}
        placeholder='Select City'
        onChange={(value) => setSelectedCity(value ? String(value) : null)}
        label='Metrostation'
        labelColor="white"
      />
      <VerticalTabs
        tabList={tabList}
        activeTab={activeSection}
        onTabChange={(item) => setActiveSection(item as any)}
      />
      <View style={styles.mapContainer}>
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

      {/* Section divider */}
      <View style={styles.divider} />
      <H4 type='medium' text={`Popular ${tabList.find((item: any) => item.id === activeSection)?.key} near you`} textColor='white' />

      {isHeatMapDataLoading ? (
        <ActivityIndicator size="small" color={COLORS.primaryLight} style={{ marginTop: responsiveSize(16) }} />
      ) : (
        <View style={styles.stationList}>
          {activeSection === 'metro' && heatMapData?.map((item, index) => (
            <View key={item.station?.id ?? index} style={styles.stationCard}>
              {/* Station icon */}
              <View style={styles.stationIconWrap}>
                <Ionicons name="train-outline" size={responsiveSize(20)} color={COLORS.primaryLight} />
              </View>

              {/* Name + city */}
              <View style={styles.stationInfo}>
                <Text style={styles.stationName} numberOfLines={1}>
                  {item.station?.name}
                </Text>
                <View style={styles.stationMeta}>
                  <Ionicons name="location-outline" size={responsiveSize(12)} color="white" />
                  <B3 text={item.station?.city} textColor='white' />
                </View>
              </View>

              {/* User count badge */}
              <View style={styles.userCountBadge}>
                <Ionicons name="people-outline" size={responsiveSize(13)} color={'white'} />
                <B3 text={item.userCount || 0} textColor='white' />
              </View>
            </View>
          ))}

          {(heatMapData?.length === 0 || activeSection !== 'metro') && (
            <Text style={styles.emptyText}>No {tabList.find((item: any) => item.id === activeSection)?.key} found nearby</Text>
          )}
        </View>
      )}
    </ScrollView>


  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: responsiveSize(14),
    paddingBottom: responsiveSize(70),
    gap: responsiveSize(20),
  },
  mapContainer: {
    // marginVertical: responsiveSize(20),
    height: 500,
  },
  map: {
    ...StyleSheet.absoluteFill,
    borderRadius: responsiveSize(14),
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  stationList: {
    gap: responsiveSize(10),
    marginBottom: responsiveSize(16),
  },
  stationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.09)',
    borderRadius: responsiveSize(14),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: responsiveSize(14),
    paddingVertical: responsiveSize(13),
    gap: responsiveSize(12),
  },
  stationIconWrap: {
    width: responsiveSize(40),
    height: responsiveSize(40),
    borderRadius: responsiveSize(20),
    backgroundColor: 'rgba(249, 249, 249, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stationInfo: {
    flex: 1,
    gap: responsiveSize(3),
  },
  stationName: {
    fontFamily: TYPOGRAPHY.semibold,
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: '#FFFFFF',
  },
  stationMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveSize(4),
  },
  stationCity: {
    fontFamily: TYPOGRAPHY.regular,
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: 'white',
  },
  userCountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveSize(5),
    backgroundColor: 'rgba(47,107,255,0.22)',
    borderRadius: responsiveSize(20),
    paddingHorizontal: responsiveSize(10),
    paddingVertical: responsiveSize(5),
    borderWidth: 1,
    borderColor: 'rgba(110,168,255,0.35)',
  },
  userCountText: {
    fontFamily: TYPOGRAPHY.semibold,
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.primaryLight,
  },
  emptyText: {
    fontFamily: TYPOGRAPHY.regular,
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: 'rgba(255,255,255,0.45)',
    textAlign: 'center',
    marginTop: responsiveSize(16),
  },
});

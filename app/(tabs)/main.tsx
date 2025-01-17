import { Icon } from '@/components/ui/icon'
import { MaterialIcons } from '@expo/vector-icons'
import { Stack, useFocusEffect } from 'expo-router'
import React, { useCallback, useEffect } from 'react'
import { Pressable, StyleSheet, SafeAreaView, ToastAndroid, PermissionsAndroid, TouchableOpacity } from 'react-native'
import MapView, { LocalTile, MapMarker, Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import * as Location from 'expo-location';
import { Box } from '@/components/ui/box'
import { Heading } from '@/components/ui/heading'
import { Text } from '@/components/ui/text'

const Main = () => {
    const [currentLocation, setCurrentLocation] = React.useState<Location.LocationObjectCoords>({
        latitude: 0,
        longitude: 0,
        altitude: 0,
        accuracy: 0,
        altitudeAccuracy: 0,
        heading: 0,
        speed: 0,
    });
    const mapRef = React.useRef<MapView>(null);
    const markerRef = React.useRef<MapMarker>(null);

    useFocusEffect(
        useCallback(() => {
            async function getCurrentLocation() {

                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    ToastAndroid.show('Permission to access location was denied', ToastAndroid.SHORT);
                    return;
                }

                let location = await Location.getCurrentPositionAsync({});
                console.log(location.coords);
                setCurrentLocation(location.coords);
            }

            getCurrentLocation();
        }, [])
    )
    useEffect(() => {
        if (mapRef.current) {
            mapRef.current.animateToRegion({
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            }, 1000);
        }
        if (markerRef.current) {
            markerRef.current.setCoordinates({
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
            })
        }
    }, [currentLocation])
    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: true, headerTitle: "SDV Survey", headerTitleStyle: { fontWeight: '700' }, headerRight: () => <Pressable className='mr-4' onPress={() => console.log("Logout")}><Icon as={() => <MaterialIcons name="logout" size={25} color="red" />} size="md" /></Pressable> }} />
            <MapView
                ref={mapRef}
                showsUserLocation={true}
                showsMyLocationButton={true}
                style={styles.map}
                provider={PROVIDER_GOOGLE}
            >
                <Marker coordinate={{ latitude: currentLocation.latitude, longitude: currentLocation.longitude }} ref={markerRef} title="Sample Marker" />
            </MapView>
            <Box className='w-full pt-6 border-t border-slate-300' style={styles.bottomContainer}>
                <TouchableOpacity activeOpacity={0.7} className='border w-80 bg-gray-200 border-black-300 mt-4 py-1.5 px-4 rounded-lg'>
                    <Heading className='pb-1'>New Survey</Heading>
                    <Text size='sm'>Create New Property Survey</Text>
                </TouchableOpacity>
                {/* <Box className='border w-80 bg-gray-200 border-black-300 mt-6 py-1.5 px-4 rounded-lg'>
                    <Heading className='pb-1'>New Survey</Heading>
                    <Text size='sm'>Create New Property Survey</Text>
                </Box> */}
            </Box>


        </SafeAreaView>
    )
}

export default Main

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingBottom: 10,
    },
    map: {
        width: '100%',
        height: '45%',
    },
    bottomContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    }
});
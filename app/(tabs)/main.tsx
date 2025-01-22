import { Icon } from '@/components/ui/icon'
import { MaterialIcons } from '@expo/vector-icons'
import { router, Stack, useFocusEffect } from 'expo-router'
import React, { useCallback, useEffect } from 'react'
import { Pressable, StyleSheet, SafeAreaView, ToastAndroid, PermissionsAndroid, TouchableOpacity } from 'react-native'
import MapView, { LocalTile, MapMarker, Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import * as Location from 'expo-location';
import { Box } from '@/components/ui/box'
import { Heading } from '@/components/ui/heading'
import { Text } from '@/components/ui/text'
import { clearLocal, getFromLocal, storeToLocal } from '@/utils/helper'
import { useAppDispatch, useAppSelector } from '@/utils/hooks'
import { setUserId, setUserToken } from '@/redux/slices/user'
import { apiSlice } from '@/redux/api/api-slice'
import { ButtonSpinner } from '@/components/ui/button'
import { setMap } from '@/redux/slices/map'
import { useRefereshTokenQuery } from '@/redux/api/end-points/user'

const Main = () => {
    const { data: tokenData, refetch: refetchRefereshToken, error: refereshError, isFetching: isTokenFetching } = useRefereshTokenQuery(undefined, { refetchOnFocus: true });
    const userToken = useAppSelector(state => state.user.token)
    const dispatch = useAppDispatch();
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

    useEffect(() => {
        if (tokenData?.access_token) { // Assuming tokenData contains a property named `token`
            storeToLocal('@token', tokenData?.access_token);
            dispatch(setUserToken(tokenData?.access_token));
            console.log("TOKEN REFRESHED", tokenData?.access_token);
        }
    }, [tokenData]);

    useFocusEffect(
        useCallback(() => {
            async function getCurrentLocation() {

                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    ToastAndroid.show('Permission to access location was denied', ToastAndroid.SHORT);
                    return;
                }

                let location = await Location.getCurrentPositionAsync({ accuracy: 4 });
                console.log(location.coords);
                setCurrentLocation(location.coords);
            }
            refetchRefereshToken();
            getCurrentLocation();
        }, [])
    )
    useEffect(() => {
        if (mapRef.current) {
            mapRef.current.animateToRegion({
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
                latitudeDelta: 0.0012,
                longitudeDelta: 0.0011,
            }, 1000);
            dispatch(setMap({ latitude: currentLocation.latitude, longitude: currentLocation.longitude }));
        }
        if (markerRef.current) {
            markerRef.current.setCoordinates({
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
            })
        }
    }, [currentLocation])

    const handleLogout = () => {
        clearLocal();
        dispatch(setUserToken(""));
        dispatch(setUserId(""));
        dispatch(apiSlice.util.resetApiState());
        router.replace('/signin');
    }


    useEffect(() => {
        if (refereshError) {
            handleLogout();
        }
    }, [refereshError]);

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{headerStyle:{backgroundColor:'#05837a'}, headerShown: true, headerTitle: "SDV Survey", headerTitleStyle: { fontWeight: '600',color:'#ffffff' }, headerRight: () => <Pressable className='mr-4' onPress={handleLogout}><Icon as={() => <MaterialIcons name="logout" size={25} color="white" />} size="md" /></Pressable> }} />
            {currentLocation.latitude === 0 ? <Box style={styles.map} className='justify-center items-center'>
                <Text className='text-center px-3'>Attempting to fetch your location. Please turn on location services if they are disabled.</Text>
                <ButtonSpinner size={40} />
            </Box> : <MapView
                ref={mapRef}
                showsUserLocation={true}
                showsMyLocationButton={true}
                mapType='satellite'
                initialRegion={{
                    latitude: currentLocation.latitude,
                    longitude: currentLocation.longitude,
                    latitudeDelta: 0.0007,
                    longitudeDelta: 0.0007,
                }}
                style={styles.map}
                provider={PROVIDER_GOOGLE}
            >
                 {/* <Marker key='myMarker' draggable coordinate={{latitude:currentLocation.latitude,longitude:currentLocation.longitude}} ref={markerRef}/> */}
            </MapView>
            }
            <Box className='w-full pt-6 border-t border-slate-300 px-6' style={styles.bottomContainer}>
                <TouchableOpacity onPress={() => router.navigate('/form/add')} activeOpacity={0.7} className='border w-full bg-gray-200 border-black-300 mt-4 py-1.5 px-4 rounded-lg'>
                    <Heading className='pb-1'>New Survey</Heading>
                    <Text size='sm'>Create New Property Survey</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.navigate('/draft/draft')} activeOpacity={0.7} className='border w-full bg-gray-200 border-black-300 mt-6 py-1.5 px-4 rounded-lg'>
                    <Heading className='pb-1'>Drafts Survey</Heading>
                    <Text size='sm'>Update edit local survey data</Text>
                </TouchableOpacity>
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
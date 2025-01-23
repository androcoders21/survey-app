import { Icon } from '@/components/ui/icon'
import { MaterialIcons } from '@expo/vector-icons'
import { router, Stack, useFocusEffect } from 'expo-router'
import React, { useCallback, useEffect } from 'react'
import { Pressable, StyleSheet, SafeAreaView, ToastAndroid, TouchableOpacity, BackHandler } from 'react-native'
import MapView, { LocalTile, MapMarker, Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import * as Location from 'expo-location';
import { Box } from '@/components/ui/box'
import { Heading } from '@/components/ui/heading'
import { Text } from '@/components/ui/text'
import { clearSession, getDraftData, getFromLocal, storeToLocal } from '@/utils/helper'
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
    const [draftLength, setDraftLength] = React.useState<number>(0);
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
            getDraftData().then((data) => {
                setDraftLength(data ? data.length : 0);
            })
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
        clearSession().then(() => {
            console.log("Session Cleared");
            dispatch(setUserToken(""));
            dispatch(setUserId(""));
            dispatch(apiSlice.util.resetApiState());
            router.replace('/signin');
        })
    }


    useEffect(() => {
        if (refereshError) {
            if (refereshError && 'status' in refereshError && refereshError.status === 401) { // Unauthorized
                handleLogout();
                console.log("Session expired");
                ToastAndroid.show('Session expired, Please Re-login', ToastAndroid.LONG);
            } else {
                // Retry token refresh or show a warning
                ToastAndroid.show('Failed to refresh token. Please check your connection.', ToastAndroid.SHORT);
            }
        }
    }, [refereshError]);

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{
                headerStyle: { backgroundColor: '#05837a' }, headerShown: true, headerTitle: "SDV Survey", headerTitleStyle: { fontWeight: '600', color: '#ffffff' }, headerRight: () => <Pressable className='mr-4' onPress={handleLogout}><Icon as={() => <MaterialIcons name="logout" size={25} color="white" />} size="md" /></Pressable>
            }}
            />
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
            />
            }
            <Box className='w-full pt-6 border-t border-slate-300 px-6 pl-12' style={styles.bottomContainer}>
                <TouchableOpacity style={styles.shaddow} onPress={() => router.navigate('/form/add')} activeOpacity={0.7} className='border w-full bg-gray-100 border-gray-700 mt-6 py-1.5 px-4 pl-8 rounded-md'>
                    <Box style={styles.shaddow} className='absolute -left-5 top-3 bg-gray-300 rounded-full h-10 w-10 flex justify-center items-center'>
                        <Icon as={() => <MaterialIcons name="open-in-new" size={22} color="black" />} size="md" />
                    </Box>
                    <Heading className='pb-1'>New Survey</Heading>
                    <Text size='sm'>Create New Property Survey</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.shaddow} onPress={() => router.navigate('/draft/drafts')} activeOpacity={0.7} className='border w-full bg-gray-100 border-gray-700 mt-6 py-1.5 px-4 pl-8 rounded-md'>
                    <Box style={styles.shaddow} className='absolute -left-5 top-3 bg-gray-300 rounded-full h-10 w-10 flex justify-center items-center'>
                        <Icon as={() => <MaterialIcons name="drafts" size={22} color="black" />} size="md" />
                    </Box>
                    <Box className='flex flex-row justify-between items-center'>
                        <Box><Heading className='pb-1'>Drafts Data</Heading>
                            <Text size='sm'>Update edit local survey data</Text>
                        </Box>
                        <Box className='bg-gray-800 rounded-full h-7 w-7 flex justify-center items-center'>
                            <Text className='text-white'>{draftLength}</Text>
                        </Box>
                    </Box>
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
    },
    shaddow: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
});
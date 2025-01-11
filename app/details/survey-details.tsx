import React from 'react'
import { Heading } from '@/components/ui/heading'
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native'
import { useAppSelector } from '@/utils/hooks'
import { Stack } from 'expo-router'
import { Text } from '@/components/ui/text'
import { View } from 'react-native'
import { Box } from '@/components/ui/box'
import { HStack } from '@/components/ui/hstack'
import { Divider } from '@/components/ui/divider'
import { FloorDataType, SurveyDetailsType } from '@/utils/types'
import { VStack } from '@/components/ui/vstack'
import { Image } from 'expo-image'

const ownerDetails: { key: string, value: keyof SurveyDetailsType }[] = [
    { key: "Parcel Id", value: "udf3" },
    { key: "Owner Name", value: "nameOfOwner" },
    { key: "Father Name", value: "fatherNameOfOwner" },
    { key: "Mobile No.", value: "mobile" },
    { key: "Email", value: "email" },
    { key: 'Alternate Mobile', value: "udf4" },
];

const locationDetails: { key: string, value: keyof SurveyDetailsType }[] = [
    { key: "Building/House/Plot", value: "building_house_plot" },
    { key: "Address of Residence", value: "address_of_residence" },
    { key: "Landmark", value: "landmark" },
    { key: "Area", value: "area" },
    { key: "City", value: "city" },
    { key: "State", value: "state" },
    { key: "Pincode", value: "pincode" },
    { key: "Latitude", value: "udf1" },
    { key: "Longitude", value: "udf2" },

]

const buildingDetails: { key: string, value: keyof SurveyDetailsType }[] = [
    // { key: "Covered area", value: "details_of_building_covered_area" },
    // { key: "Open area", value: "details_of_building_open_area" },
    // { key: "Other details", value: "details_of_building_other_details" },
    // { key: "Internal dimension all room", value: "details_of_building_internal_dim_all_room" },
    // { key: "Internal dimension all balcony", value: "details_of_building_internal_dim_all_balcony" },
    // { key: "Internal dimension all garages", value: "details_of_building_internal_dim_all_garages" },
    { key: "Carpet area", value: "details_of_building_carpet_area" },
    { key: "Building or land is located", value: "details_of_location_a_is_located" },
    { key: "Nature of construction of building", value: "details_of_location_b_nature" },
    // { key: "Building is occupied by owner or on the rent", value: "is_occupied_by" },
    { key: "Year of construction", value: "year_of_construction" },
]

const imageDetails: { key: string, value: keyof SurveyDetailsType }[] = [
    { key: "Building front", value: 'img1' },
    { key: "Building right", value: 'img2' },
    { key: "Building left", value: 'img3' },
    { key: "Aadhar card front", value: 'img4' },
    { key: "Aadhar card back", value: 'img5' },
    { key: "Other document", value: "img6" }
]

const SurveyDetails = () => {
    const surveyDetails = useAppSelector(state => state.survey);
    console.log("This One", surveyDetails.floors);
    return (
        <View style={styles.container}>
            <Stack.Screen options={{
                title: 'Profile',
                headerTitle: "Survey Details",
                headerShown: true,
                headerShadowVisible: false,
            }} />
            <ScrollView>
                <Box className='border border-slate-400 relative my-4 pt-4 rounded-xl bg-white pb-2 px-2'>
                    <Heading className='absolute bg-white -top-4 left-2 px-1 rounded-lg border border-slate-400'>Owner Details</Heading>
                    {ownerDetails.map(({ key, value }) => (
                        <HStack key={value} className='py-1'>
                            <Text size='sm' bold className='w-4/12'>{key}</Text>
                            <Text className='w-1/12'><Divider className='bg-gray-500' orientation='vertical' /></Text>
                            <Text size='sm' className='w-7/12'>{typeof surveyDetails?.[value] === "string" ? surveyDetails?.[value] : "NA"}</Text>
                        </HStack>
                    ))}
                </Box>

                <Box className='border border-slate-400 relative my-4 pt-4 rounded-xl bg-white pb-2 px-2'>
                    <Heading className='absolute bg-white -top-4 left-2 px-1 rounded-lg border border-slate-400'>Floor Details</Heading>
                    {surveyDetails.floors?.map((item: FloorDataType) => {
                        return(
                            <Box key={item.id} className='border border-slate-400 my-4 rounded-xl px-2 pb-2'>
                                <Text className='text-center text-dark pb-2' underline size='xl' bold>{item?.floor_type?.name || "NA"}</Text>
                            <HStack className='py-1'>
                                <Text size='sm' bold className='w-4/12'>Property type</Text>

                                <Text size='sm' className='w-7/12'>{item?.property_type?.type_name || "NA"}</Text>
                            </HStack>
                            <HStack className='py-1'>
                                <Text size='sm' bold className='w-4/12'>Occupied by</Text>

                                <Text size='sm' className='w-7/12'>{item?.occupied_by?.name || "NA"}</Text>
                            </HStack>
                            <HStack className='py-1'>
                                <Text size='sm' bold className='w-4/12'>Covered Area</Text>
                                <Text size='sm' className='w-2/12'>{item?.covered_area || "NA"}</Text>

                                <Text size='sm' bold className='w-4/12'>Open Area</Text>
                                <Text size='sm' className='w-2/12'>{item?.open_area || "NA"}</Text>
                            </HStack>

                            <HStack className='py-1'>
                                <Text size='sm' bold className='w-4/12'>Other Area</Text>
                                <Text size='sm' className='w-2/12'>{item?.other_area || "NA"}</Text>

                                <Text size='sm' bold className='w-4/12'>All Room Area</Text>
                                <Text size='sm' className='w-2/12'>{item?.all_room || "NA"}</Text>
                            </HStack>

                            <HStack className='py-1'>
                                <Text size='sm' bold className='w-4/12'>All Balcony Area</Text>
                                <Text size='sm' className='w-2/12'>{item?.all_balcony || "NA"}</Text>

                                <Text size='sm' bold className='w-4/12'>All Garages Area</Text>
                                <Text size='sm' className='w-2/12'>{item?.all_garages || "NA"}</Text>
                            </HStack>
                            </Box>
                        )
                    })}
                </Box>

                <Box className='border border-slate-400 relative my-4 pt-4 rounded-xl bg-white pb-2 px-2'>
                    <Heading className='absolute bg-white -top-4 left-2 px-1 rounded-lg border border-slate-400'>Building Details</Heading>
                    {buildingDetails.map(({ key, value }) => (
                        <HStack key={value} className='py-1'>
                            <Text size='sm' bold className='w-5/12'>{key}</Text>
                            <Text className='w-1/12'><Divider className='bg-gray-500' orientation='vertical' /></Text>
                            <Text size='sm' className='w-6/12'>{typeof surveyDetails?.[value] === "string" ? surveyDetails?.[value] : "NA"}</Text>
                        </HStack>
                    ))}
                </Box>

                <Box className='border border-slate-400 relative my-4 pt-4 rounded-xl bg-white pb-2 px-2'>
                    <Heading className='absolute bg-white -top-4 left-2 px-1 rounded-lg border border-slate-400'>Location Details</Heading>
                    <HStack className='py-1'>
                        <Text size='sm' bold className='w-4/12'>Ward</Text>
                        <Text className='w-1/12'><Divider className='bg-gray-500' orientation='vertical' /></Text>
                        <Text size='sm' className='w-7/12'>{surveyDetails.ward?.name || "NA"}</Text>
                    </HStack>
                    {locationDetails.map(({ key, value }) => (
                        <HStack key={value} className='py-1'>
                            <Text size='sm' bold className='w-4/12'>{key}</Text>
                            <Text className='w-1/12'><Divider className='bg-gray-500' orientation='vertical' /></Text>
                            <Text size='sm' className='w-7/12'>{typeof surveyDetails?.[value] === "string" ? surveyDetails?.[value] : "NA"}</Text>
                        </HStack>
                    ))}
                </Box>

                <Box className='border border-slate-400 relative my-4 pt-6 rounded-xl bg-white pb-2 px-2'>
                    <Heading className='absolute bg-white -top-4 left-2 px-1 rounded-lg border border-slate-400'>Uploaded Details</Heading>
                    <ScrollView horizontal className='gap-2'>
                        {imageDetails.map(({ key, value }) => {
                            if (surveyDetails?.[value]) {
                                return (<VStack key={value} className='py-1 mx-4'>
                                    <Image style={styles.image} contentFit='contain' source={`https://survey-project.csvu.in/public/${surveyDetails?.[value]}`} />
                                    <Text size='sm'>{key}</Text>
                                </VStack>)
                            }
                        })}
                    </ScrollView>
                </Box>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
    image: {
        flex: 1,
        width: 200,
        height: 200,
        backgroundColor: '#0553',
    },
});

export default SurveyDetails
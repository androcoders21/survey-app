import { Box } from '@/components/ui/box'
import { ScrollView } from 'react-native';
import { Table, TableBody, TableData, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Text } from '@/components/ui/text'
import { useFetchPropertyByIdQuery } from '@/redux/api/end-points/survey'
import { PropertyData } from '@/utils/types'
import { Stack, useLocalSearchParams } from 'expo-router'
import React, { useMemo } from 'react'
import { ActivityIndicator, Image } from 'react-native'
import { StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { FloorDetailsType, OwnerDetailsType } from '@/utils/validation-schema';
import { baseUrl } from '@/redux/api/api-slice';

const Survey = () => {
    const params = useLocalSearchParams<{ id: string }>();
    const { data, isFetching, isError } = useFetchPropertyByIdQuery({ id: params.id })

    const propertyData = useMemo(() => {
        if (Array.isArray(data?.data) && data?.data.length) {
            const myData = { ...data?.data[0] };
            if (myData.ownerDetails && typeof myData.ownerDetails === 'string') {
                myData.ownerDetails = JSON.parse(myData.ownerDetails);
            }
            return myData as PropertyData;
        }
    }, [data]);
    console.log(`https://app.npanandnagar.in/public/storage/${propertyData?.aadhaarPhoto}`)

    console.log(params.id);
    if (isFetching) {
        return (
            <Box>
                <Stack.Screen options={{
                    title: 'Survey Details',
                    headerTitle: "Survey Details",
                    headerShown: true,
                    headerShadowVisible: false,
                }} />
                <ActivityIndicator size={26} />
            </Box>
        )
    }


    return (
        <Box>
            <Stack.Screen options={{
                title: 'Survey Details',
                headerTitle: "Survey Details",
                headerShown: true,
                headerShadowVisible: false,
            }} />
            <ScrollView contentContainerStyle={{ paddingBottom: 50 }} className='p-3'>
                {/* Owner Detail */}
                <Box style={styles.item}>
                    <Text style={styles.sectionTitle}>Owner Detail</Text>
                    <Text style={styles.details}>Name of the Respondent: {propertyData?.respondentName}</Text>
                    <Text style={styles.details}>Relationship of Respondent with Owner: {propertyData?.respondentRelationship}</Text>
                    {propertyData?.respondentRelationship === "Other" && <Text style={styles.details}>Others: {propertyData?.respondentRelationshipOther}</Text>}
                    {propertyData?.ownerAadhaarNumber && <Text style={styles.details}>Aadhaar Number: {propertyData?.ownerAadhaarNumber}</Text>}
                    <Box className="mt-3 overflow-auto border border-slate-300 w-full">
                        <ScrollView horizontal={true}>
                            <Table className="w-full" style={{ overflowX: 'scroll' }}>
                                <TableHeader>
                                    <TableRow className='bg-slate-100 py-1'>
                                        <TableHead className='text-xs p-0 w-36 text-center align-middle'>Name</TableHead>
                                        <TableHead className='text-xs p-0 w-36 text-center align-middle'>Father/Husband Name</TableHead>
                                        <TableHead className='text-xs p-0 w-36 text-center align-middle'>Mobile No.</TableHead>
                                        <TableHead className='text-xs p-0 w-36 text-center align-middle'>Email</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {propertyData?.ownerDetails && Array.isArray(propertyData?.ownerDetails) && propertyData?.ownerDetails?.map((owner, index) => (
                                        <TableRow key={index} className='py-1'>
                                            <TableData className='text-sm p-0 w-36 text-center align-middle'>{owner.name}</TableData>
                                            <TableData className='text-sm p-0 w-36 text-center align-middle'>{owner.fatherName}</TableData>
                                            <TableData className='text-sm p-0 w-36 text-center align-middle'>{owner.mobile}</TableData>
                                            <TableData className='text-sm p-0 w-36 text-center align-middle'>{owner?.email}</TableData>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </ScrollView>
                    </Box>
                </Box>

                {/* Address Details */}
                <Box style={styles.item}>
                    <Text style={styles.sectionTitle}>Address Details</Text>
                    <Text style={styles.details}>House No.: {propertyData?.houseNo}</Text>
                    <Text style={styles.details}>Street: {propertyData?.streetNoName}</Text>
                    <Text style={styles.details}>Locality: {propertyData?.locality}</Text>
                    <Text style={styles.details}>Colony: {propertyData?.colony}</Text>
                    <Text style={styles.details}>City: {propertyData?.city}</Text>
                    <Text style={styles.details}>Pincode: {propertyData?.pincode}</Text>
                </Box>

                {/* Property Details */}
                <Box style={styles.item}>
                    <Text style={styles.sectionTitle}>Property Details</Text>
                    <Text style={styles.details}>ULB’s Name/Code: {propertyData?.ulbNameCode}</Text>
                    <Text style={styles.details}>E-nagarpalika Id: {propertyData?.nagarpalikaId}</Text>
                    <Text style={styles.details}>Ward No.: {propertyData?.wardNo}</Text>
                    <Text style={styles.details}>Parcel No.: {propertyData?.parcelNo}</Text>
                    <Text style={styles.details}>Property No/Unit No.: {propertyData?.propertyNo}</Text>
                    <Text style={styles.details}>Electricity Id: {propertyData?.electricityId}</Text>
                    <Text style={styles.details}>Khasra No.: {propertyData?.khasraNo}</Text>
                    <Text style={styles.details}>Registry No.: {propertyData?.registryNo}</Text>
                    <Text style={styles.details}>Constructed Date: {propertyData?.constructedDate}</Text>
                    <Text style={styles.details}>Slum: {propertyData?.isSlum}</Text>
                    {propertyData?.isSlum === "yes" && <Text style={styles.details}>Slum Type: {propertyData?.slumId}</Text>}
                </Box>

                {/* Taxation Details/General Details of the Property */}
                <Box style={styles.item}>
                    <Text style={styles.sectionTitle}>Taxation Details/General Details of the Property</Text>
                    <Text style={styles.details}>Current Tax Rate: {propertyData?.taxRateZone === "Other" ? "Other" : propertyData?.tax_rate_zone?.name}</Text>
                    {propertyData?.taxRateZone === "Other" && <Text style={styles.details}>Other Tax Rate: {propertyData?.taxRateZoneOther}</Text>}
                    <Text style={styles.details}>Property Ownership: {propertyData?.propertyOwnership === "Other" ? "Other" : propertyData?.property_ownership?.name}</Text>
                    {propertyData?.propertyOwnership === "Other" && <Text style={styles.details}>Other Property Ownership: {propertyData?.propertyOwnershipOther}</Text>}
                    <Text style={styles.details}>Situation: {propertyData?.situation?.name}</Text>
                    {/* {propertyData?.situation === "Other" && <Text style={styles.details}>Other Situation: {propertyData?.situationOther}</Text>} */}
                    <Text style={styles.details}>Property Use: {propertyData?.propertyUse === "Other" ? "Other" : propertyData?.property_use?.name}</Text>
                    {propertyData?.propertyUse === "Other" && <Text style={styles.details}>Other Property Use: {propertyData?.propertyOther}</Text>}
                    <Text style={styles.details}>Commercial: {propertyData?.commercial?.name}</Text>
                    {/* {propertyData?.commercial === "NA" && <Text style={styles.details}>Commercial Type: {propertyData?.commercialOther}</Text>} */}
                    <Text style={styles.details}>Year of Construction: {propertyData?.yearOfConstruction === "Other" ? "Other" : propertyData?.year_of_construction?.name}</Text>
                    {propertyData?.yearOfConstruction === "Other" && <Text style={styles.details}>Year of Construction Other: {propertyData?.yearOfConstructionOther}</Text>}
                    <Text style={styles.details}>Exemption Applicable: {propertyData?.isExemptionApplicable}</Text>
                    {propertyData?.isExemptionApplicable === "yes" && <Text style={styles.details}>Exemption Type: {propertyData?.exemptionType === "Other" ? "Other" : propertyData?.exemption_type?.name}</Text>}
                    {propertyData?.isExemptionApplicable === "yes" && propertyData?.exemptionType === "Other" && <Text style={styles.details}>Exemption Type Other: {propertyData?.exemptionTypeOther}</Text>}
                </Box>

                {/* Property Area Details */}
                <Box style={styles.item}>
                    <Text style={styles.sectionTitle}>Property Area Details</Text>
                    <Text style={styles.details}>Plot Area: {propertyData?.plotAreaSqFt} SqFt / {propertyData?.plotAreaSqMeter} SqMeter</Text>
                    <Text style={styles.details}>Plinth Area: {propertyData?.plinthAreaSqFt} SqFt / {propertyData?.plinthAreaSqMeter} SqMeter</Text>
                    <Text style={styles.details}>Total Built-Up Area: {propertyData?.totalBuiltUpAreaSqFt} SqFt / {propertyData?.totalBuiltUpAreaSqMeter} SqMeter</Text>
                    {/* Assuming floor details are in an array */}
                    <Box className="mt-3 overflow-hidden border border-slate-300 border-b-0 w-full">
                        <ScrollView horizontal>
                            <Table className="w-full">
                                <TableHeader>
                                    <TableRow className='bg-slate-100 py-1'>
                                        <TableHead className='text-sm p-0 w-32 text-center align-middle'>Floor No.</TableHead>
                                        <TableHead className='text-sm p-0 w-32 text-center align-middle'>Area</TableHead>
                                        <TableHead className='text-sm p-0 w-32 text-center align-middle'>Usage Type</TableHead>
                                        <TableHead className='text-sm p-0 w-32 text-center align-middle'>Usage Factor</TableHead>
                                        <TableHead className='text-sm p-0 w-52 text-center align-middle'>Construction Type</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {propertyData?.floors && propertyData?.floors.map((item, index) => (
                                        <TableRow key={index} className='py-1'>
                                            <TableData className='text-sm w-32 p-0 text-center align-middle'>{item?.floorType.toString() === "Other" ? item.floorTypeOther : item?.floor_type?.name}</TableData>
                                            <TableData className='text-sm w-32 p-0 text-center align-middle'>{item?.areaSqFt}</TableData>
                                            <TableData className='text-sm w-32 p-0 text-center align-middle'>{item.usageType.toString() === "Other" ? item.usageTypeOther : item?.usage_type?.type_name || ""}</TableData>
                                            <TableData className='text-sm w-32 p-0 text-center align-middle'>{item.usageFactor.toString() === "Other" ? item.usageFactorOther : item?.usage_factor?.name || ""}</TableData>
                                            <TableData className='text-sm w-52 p-0 text-center align-middle'>{item.constructionType.toString() === "Other" ? item.constructionTypeOther : item?.construction_type?.name || ""}</TableData>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </ScrollView>
                    </Box>
                </Box>

                {/* Municipal Supply */}
                <Box style={styles.item}>
                    <Text style={styles.sectionTitle}>Municipal / Town Supply</Text>
                    <Text style={styles.details}>Municipal Water Supply Connection: {propertyData?.isMuncipalWaterSupply}</Text>
                    {propertyData?.isMuncipalWaterSupply === "yes" && <>
                        <Text style={styles.details}>No. of Connection: {propertyData?.totalWaterConnection}</Text>
                        <Text style={styles.details}>Connection IDs: {propertyData?.waterConnectionId}</Text>
                        <Text style={styles.details}>Water connection type: {propertyData?.waterConnectionType === "Other" ? "Other" : propertyData?.water_connection_type?.type_name}</Text>
                        {propertyData?.waterConnectionType === "Other" && <Text style={styles.details}>Water connection type: {propertyData?.waterConnectionTypeOther}</Text>}
                    </>}
                    {
                        propertyData?.isMuncipalWaterSupply === "no" && <>
                            <Text style={styles.details}>Source of Water: {propertyData?.sourceOfWater}</Text>
                            {propertyData?.sourceOfWater === "Other" && <Text style={styles.details}>Source of Water Other: {propertyData?.sourceOfWaterOther}</Text>}
                        </>
                    }
                    <Text style={styles.details}>Toilet Type: {propertyData?.toiletType}</Text>
                    {propertyData?.toiletType === "Other" && <Text style={styles.details}>Toilet Type Other: {propertyData?.toiletTypeOther || ""}</Text>}
                    <Text style={styles.details}>Municipal Authority Door to Door Collection: {propertyData?.isMuncipalWasteService}</Text>
                </Box>

                {/* Property Location */}
                <Box style={styles.item}>
                    <Text style={styles.sectionTitle}>Property Location</Text>
                    <Text style={styles.details}>Latitude: {propertyData?.latitude}</Text>
                    <Text style={styles.details}>Longitude: {propertyData?.longitude}</Text>
                    <MapView
                        style={styles.map}
                        initialRegion={{
                            latitude: Number(propertyData?.latitude),
                            longitude: Number(propertyData?.longitude),
                            latitudeDelta: 0.01,
                            longitudeDelta: 0.01,
                        }}
                    >
                        <Marker
                            coordinate={{
                                latitude: Number(propertyData?.latitude),
                                longitude: Number(propertyData?.longitude),
                            }}
                            title="Property Location"
                        />
                    </MapView>
                </Box>
                {/* Property Images */}
                
                <Box style={styles.imageScrollView}>
                    <Text style={styles.sectionTitle}>Property Images</Text>
                    <ScrollView horizontal>
                        <Image
                            source={{uri: `https://app.npanandnagar.in/public/storage/${propertyData?.propertyFirstImage}` as any}}
                            style={styles.image}
                            resizeMode="contain"
                        />
                        <Image
                            source={{uri: `https://app.npanandnagar.in/public/storage/${propertyData?.propertySecondImage}` as any}}
                            style={styles.image}
                            resizeMode="contain"
                        />
                        <Image
                            source={{uri: `https://app.npanandnagar.in/public/storage/${propertyData?.aadhaarPhoto}` as any}}
                            style={styles.image}
                            resizeMode="contain"
                        />
                        {propertyData?.supportingDocuments && propertyData?.supportingDocuments.map((doc, index) => (
                            <Image
                                key={index}
                                source={{uri:`https://app.npanandnagar.in/public/storage/${doc}` as any}}
                                style={styles.image}
                                resizeMode="contain"
                            />
                        ))}
                    </ScrollView>
                </Box>

            </ScrollView>
        </Box>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 10,
        paddingTop: 10,
        backgroundColor: '#f0f0f0',

    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    item: {
        backgroundColor: '#ffffff',
        padding: 10,
        marginVertical: 5,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ddd',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    sectionTitle: {
        fontSize: 15,
        marginBottom: 5,
        // backgroundColor: '#FFF8F2',
        // padding: 2,
        borderRadius: 5,
        paddingLeft: 5,
    },
    title: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    details: {
        fontSize: 12,
        color: '#555',
        paddingLeft: 5,
    },
    map: {
        width: '100%',
        height: 200,
        marginTop: 10,
    },
    buttonContainer: {
        position: 'absolute',

        bottom: 0,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#ffffff',
        paddingVertical: 10,
        alignItems: 'center',
        borderTopColor: '#ddd',
        borderTopWidth: 1,
        // boxShadow: '4px 4px 8px 4px rgba(1,1,1,1)',
    },
    button: {
        width: '40%',
        height: 40,
        backgroundColor: '#aacc12',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        boxShadow: '0 1px 8px rgba(0,0,0,0.5)',
    },
    editButton: {
        width: '40%',
        height: 40,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        boxShadow: '0 1px 8px rgba(0,0,0,0.5)',
    },
    imageScrollView: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#ffffff',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ddd',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    image: {
        width: 200,
        height: 300,
        margin: 10,
        backgroundColor: '#f0f0f0',
        
    },
    buttonText: {
        color: '#000',
        fontSize: 14,
        fontWeight: 'bold',
    },
});

export default Survey
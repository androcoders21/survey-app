import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ToastAndroid } from 'react-native';
import { Box } from '@/components/ui/box';
import { router, Stack } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import MapView, { Marker } from 'react-native-maps';
import { clearByKey, clearSession, getFromLocal } from '@/utils/helper';
import { CombinedSurveyType, FloorDetailsType, OwnerDetailsType } from '@/utils/validation-schema';
import { Table, TableBody, TableCaption, TableData, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CommercialUses, ConstructionType, ExemptionType, FactorType, FileObject, FloorTypeType, PropertyOwnership, PropertySituation, PropertyUses, RateZone, UsageType, YearOfConstruction } from '@/utils/types';
import { useFetchCommercialUsesQuery, useFetchConstructionTypeQuery, useFetchExemptionQuery, useFetchFloorTypeQuery, useFetchPropertyOwnershipQuery, useFetchPropertySituationQuery, useFetchPropertyUsesQuery, useFetchTaxRateQuery, useFetchUsageFactorQuery, useFetchUsageTypeQuery, useFetchYearOfConstructionQuery } from '@/redux/api/end-points/property-type';
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/utils/hooks';
import { setUserId, setUserToken } from '@/redux/slices/user';
import { apiSlice } from '@/redux/api/api-slice';
import { useCreatePropertyMutation } from '@/redux/api/end-points/survey';

interface ParamsProps {
    id: string;
}

const draftData = () => {
    const params = useLocalSearchParams<{ id: string }>();
    const [isFetching, setIsFetching] = useState(true);
    const dispatch = useAppDispatch();
    const userId = useAppSelector(state => state.user.userId);
    const [createSurvey, { isLoading }] = useCreatePropertyMutation();
    const [draftData, setDraftData] = React.useState<CombinedSurveyType | undefined>(undefined);
    const { data: floorData } = useFetchFloorTypeQuery();
    const { data: usageTypeData } = useFetchUsageTypeQuery();
    const { data: usageFactorData } = useFetchUsageFactorQuery();
    const { data: constructionTypeData } = useFetchConstructionTypeQuery();
    const { data: taxRateData } = useFetchTaxRateQuery();
    const { data: ownershipData } = useFetchPropertyOwnershipQuery();
    const { data: propertySituationData } = useFetchPropertySituationQuery();
    const { data: propertyUseData } = useFetchPropertyUsesQuery();
    const { data: commercialData } = useFetchCommercialUsesQuery();
    const { data: yocData } = useFetchYearOfConstructionQuery();
    const { data: exemptionData } = useFetchExemptionQuery();

    useEffect(() => {
        getFromLocal(params.id).then((data) => {
            console.log(data);
            setDraftData(data ? JSON.parse(data) : undefined);
        }).catch((error) => {
            console.log(error);
        }).finally(() => {
            setIsFetching(false);
        });
    }, []);

    if (isFetching || !draftData) {
        return (
            <View style={styles.container}>
                <Stack.Screen options={{
                    title: 'Survey Details',
                    headerTitle: "Survey Details",
                    headerShown: true,
                    headerTitleStyle: { fontWeight: '600' },
                }} />
                <Text>Loading...</Text>
            </View>
        )
    }

    const latitude = parseFloat(draftData?.latitude || '0');
    const longitude = parseFloat(draftData?.longitude || '0');

    const handleSubmit = async () => {
        try {
            const formData = new FormData();
            Object.entries(draftData).forEach(([key, value]) => {
                console.log(key);
                if (key === "waterConnectionId") {
                    if (Array.isArray(value) && value.length) {
                        value.forEach((item, index) => {
                            formData.append(`waterConnectionId[${index}]`, item as any);
                        })
                    }
                } else if (key === "supportingDocuments" && Array.isArray(value)) {
                    (value as FileObject[]).forEach((file, index) => {
                        const fileObject = {
                            uri: file.uri,
                            name: file?.name || `supportingDocument_${index}.jpeg`, // Fallback name
                            type: file?.type || 'image/jpeg', // Fallback type
                        };
                        formData.append(`supportingDocuments[${index}]`, fileObject as any);
                    });
                } else if (Array.isArray(value)) {
                    if (value.length) {
                        formData.append(key, JSON.stringify(value));
                    }
                }
                else if (typeof value === "object") {
                    formData.append(key, value as any);
                }
                else if (key === "aadhaarPhoto" && value) {
                    const aadhaarPhoto = {
                        uri: value,
                        name: 'aadhaarPhoto.jpg',
                        type: 'image/jpeg',
                    }
                    formData.append(key, aadhaarPhoto as any);
                }
                else if (typeof value === "string" || typeof value === "boolean") {
                    formData.append(key, String(value));
                } else if (value) {
                    formData.append(key, String(value));
                }
            });
            formData.append("user_id", userId);
            formData.forEach((value, key) => {
                if (key === "waterConnectionId" || key === "floors") {

                    console.log('waterConnectionId', key, value);
                }
            });

            const response = await createSurvey(formData).unwrap();
            console.log("Response", response);
            clearByKey(params.id).then(() => {
                ToastAndroid.show("Survey uploaded successfully", ToastAndroid.SHORT);
                router.back();
            })
        } catch (error: any) {
            console.log('Error', error);
            if (error?.status === 401) {
                handleLogout();
                ToastAndroid.show("Session expired, Please Re-login", ToastAndroid.LONG);
            } else if (error && typeof error?.data?.message === "string") {
                ToastAndroid.show(error?.data?.message, ToastAndroid.SHORT);
            } else {
                ToastAndroid.show("Unable to create survey", ToastAndroid.SHORT);
            }
        }
    };

    const handleLogout = () => {
        clearSession().then(() => {
            dispatch(setUserToken(""));
            dispatch(setUserId(""));
            dispatch(apiSlice.util.resetApiState());
            router.replace('/signin');
        });
    };

    return (
        <>

            <Stack.Screen options={{
                title: 'Survey Details',
                headerTitle: "Survey Details",
                headerShown: true,
                headerTitleStyle: { fontWeight: '600' },
            }} />

            <ScrollView style={styles.container}>
                {/* Owner Detail */}
                <Box style={styles.item}>
                    <Text style={styles.sectionTitle}>Owner Detail</Text>
                    <Text style={styles.details}>Name of the Respondent: {draftData.respondentName}</Text>
                    <Text style={styles.details}>Relationship of Respondent with Owner: {draftData.respondentRelationship}</Text>
                    {draftData?.respondentRelationship === "Other" && <Text style={styles.details}>Others: {draftData?.respondentRelationshipOther}</Text>}
                    {draftData?.ownerAadhaarNumber && <Text style={styles.details}>Aadhaar Number: {draftData?.ownerAadhaarNumber}</Text>}
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
                                    {draftData?.ownerDetails && draftData.ownerDetails.map((owner: OwnerDetailsType, index) => (
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
                    <Text style={styles.details}>House No.: {draftData?.houseNo}</Text>
                    <Text style={styles.details}>Street: {draftData?.streetNoName}</Text>
                    <Text style={styles.details}>Locality: {draftData?.locality}</Text>
                    <Text style={styles.details}>Colony: {draftData?.colony}</Text>
                    <Text style={styles.details}>City: {draftData?.city}</Text>
                    <Text style={styles.details}>Pincode: {draftData?.pincode}</Text>
                </Box>

                {/* Property Details */}
                <Box style={styles.item}>
                    <Text style={styles.sectionTitle}>Property Details</Text>
                    <Text style={styles.details}>ULB’s Name/Code: {draftData?.ulbNameCode}</Text>
                    <Text style={styles.details}>E-nagarpalika Id: {draftData?.nagarpalikaId}</Text>
                    <Text style={styles.details}>Ward No.: {draftData?.wardNo}</Text>
                    <Text style={styles.details}>Parcel No.: {draftData?.parcelNo}</Text>
                    <Text style={styles.details}>Property No/Unit No.: {draftData?.propertyNo}</Text>
                    <Text style={styles.details}>Electricity Id: {draftData?.electricityId}</Text>
                    <Text style={styles.details}>Khasra No.: {draftData?.khasraNo}</Text>
                    <Text style={styles.details}>Registry No.: {draftData?.registryNo}</Text>
                    <Text style={styles.details}>Constructed Date: {draftData?.constructedDate}</Text>
                    <Text style={styles.details}>Slum: {draftData?.isSlum}</Text>
                    {draftData?.isSlum === "yes" && <Text style={styles.details}>Slum Type: {draftData?.slumId}</Text>}
                </Box>

                {/* Taxation Details/General Details of the Property */}
                <Box style={styles.item}>
                    <Text style={styles.sectionTitle}>Taxation Details/General Details of the Property</Text>
                    <Text style={styles.details}>Current Tax Rate: {draftData?.taxRateZone === "Other" ? "Other" : draftData?.taxRateZone ? taxRateData?.find((item: RateZone) => item.id.toString() === draftData?.taxRateZone)?.name : ''}</Text>
                    {draftData?.taxRateZone === "Other" && <Text style={styles.details}>Other Tax Rate: {draftData?.taxRateZoneOther}</Text>}
                    <Text style={styles.details}>Property Ownership: {draftData?.propertyOwnership === "Other" ? "Other" : draftData?.propertyOwnership ? ownershipData?.find((item: PropertyOwnership) => item.id.toString() === draftData?.propertyOwnership)?.name : ''}</Text>
                    {draftData?.propertyOwnership === "Other" && <Text style={styles.details}>Other Property Ownership: {draftData?.propertyOwnershipOther}</Text>}
                    <Text style={styles.details}>Situation: {draftData?.situation === "Other" ? "Other" : draftData?.situation ? propertySituationData?.find((item: PropertySituation) => item.id.toString() === draftData?.situation)?.name : ''}</Text>
                    {draftData?.situation === "Other" && <Text style={styles.details}>Other Situation: {draftData?.situationOther}</Text>}
                    <Text style={styles.details}>Property Use: {draftData?.propertyUse === "Other" ? "Other" : draftData?.propertyUse ? propertyUseData?.find((item: PropertyUses) => item.id.toString() === draftData?.propertyUse)?.name : ''}</Text>
                    {draftData?.propertyUse === "Other" && <Text style={styles.details}>Other Property Use: {draftData?.propertyOther}</Text>}
                    <Text style={styles.details}>Commercial: {draftData?.commercial === "Other" ? "Other" : draftData?.commercial ? commercialData?.find((item: CommercialUses) => item.id.toString() === draftData?.commercial)?.name : ''}</Text>
                    {draftData?.commercial === "NA" && <Text style={styles.details}>Commercial Type: {draftData?.commercialOther}</Text>}
                    <Text style={styles.details}>Year of Construction: {draftData?.yearOfConstruction === "Other" ? "Other" : draftData?.yearOfConstruction ? yocData?.find((item: YearOfConstruction) => item.id.toString() === draftData?.yearOfConstruction)?.name : ''}</Text>
                    {draftData?.yearOfConstruction === "Other" && <Text style={styles.details}>Year of Construction Other: {draftData?.yearOfConstructionOther}</Text>}
                    <Text style={styles.details}>Exemption Applicable: {draftData?.isExemptionApplicable}</Text>
                    {draftData?.isExemptionApplicable === "yes" && <Text style={styles.details}>Exemption Type: {draftData?.exemptionType === "Other" ? "Other" : exemptionData?.exemptionType ? taxRateData?.find((item: ExemptionType) => item.id.toString() === draftData?.exemptionType)?.name : ''}</Text>}
                    {draftData?.isExemptionApplicable === "yes" && draftData?.exemptionType === "Other" && <Text style={styles.details}>Exemption Type Other: {draftData?.exemptionTypeOther}</Text>}
                </Box>

                {/* Property Area Details */}
                <Box style={styles.item}>
                    <Text style={styles.sectionTitle}>Property Area Details</Text>
                    <Text style={styles.details}>Plot Area: {draftData?.plotAreaSqFt} SqFt / {draftData?.plotAreaSqMeter} SqMeter</Text>
                    <Text style={styles.details}>Plinth Area: {draftData?.plinthAreaSqFt} SqFt / {draftData?.plinthAreaSqMeter} SqMeter</Text>
                    <Text style={styles.details}>Total Built-Up Area: {draftData?.totalBuiltUpAreaSqFt} SqFt / {draftData?.totalBuiltUpAreaSqMeter} SqMeter</Text>
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
                                    {draftData.floors && draftData.floors.map((item: FloorDetailsType, index) => (
                                        <TableRow key={index} className='py-1'>
                                            <TableData className='text-sm w-32 p-0 text-center align-middle'>{item.floorType === "Other" ? item.floorTypeOther : floorData?.find((mainItem: FloorTypeType) => mainItem.id.toString() === item.floorType)?.name || ""}</TableData>
                                            <TableData className='text-sm w-32 p-0 text-center align-middle'>{item?.areaSqFt}</TableData>
                                            <TableData className='text-sm w-32 p-0 text-center align-middle'>{item.usageType === "Other" ? item.usageTypeOther : usageTypeData?.find((mainItem: UsageType) => mainItem.id.toString() === item.usageType)?.type_name || ""}</TableData>
                                            <TableData className='text-sm w-32 p-0 text-center align-middle'>{item.usageFactor === "Other" ? item.usageFactorOther : usageFactorData?.find((mainItem: FactorType) => mainItem.id.toString() === item.usageFactor)?.name || ""}</TableData>
                                            <TableData className='text-sm w-52 p-0 text-center align-middle'>{item.constructionType === "Other" ? item.constructionTypeOther : constructionTypeData?.find((mainItem: ConstructionType) => mainItem.id.toString() === item.constructionType)?.name || ""}</TableData>
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
                    <Text style={styles.details}>Municipal Water Supply Connection: {draftData?.isMuncipalWaterSupply}</Text>
                    {draftData?.isMuncipalWaterSupply === "yes" && <>
                        <Text style={styles.details}>No. of Connection: {draftData?.totalWaterConnection}</Text>
                        <Text style={styles.details}>Connection IDs: {draftData?.waterConnectionId}</Text>
                        <Text style={styles.details}>Water connection type: {draftData?.waterConnectionType === "Other" ? "Other" : usageTypeData?.find((mainItem: UsageType) => mainItem.id.toString() === draftData.waterConnectionType)?.type_name || ""} {draftData?.waterConnectionType}</Text>
                        {draftData?.waterConnectionType === "Other" && <Text style={styles.details}>Water connection type: {draftData?.waterConnectionTypeOther}</Text>}
                    </>}
                    {
                        draftData?.isMuncipalWaterSupply === "no" && <>
                            <Text style={styles.details}>Source of Water: {draftData?.sourceOfWater}</Text>
                            {draftData?.sourceOfWater === "Other" && <Text style={styles.details}>Source of Water Other: {draftData?.sourceOfWaterOther}</Text>}
                        </>
                    }
                    <Text style={styles.details}>Toilet Type: {draftData.toiletType}</Text>
                    {draftData?.toiletType === "Other" && <Text style={styles.details}>Toilet Type Other: {draftData?.toiletTypeOther}</Text>}
                    <Text style={styles.details}>Municipal Authority Door to Door Collection: {draftData?.isMuncipalWasteService}</Text>
                </Box>

                {/* Property Location */}
                <Box className='mb-28' style={styles.item}>
                    <Text style={styles.sectionTitle}>Property Location</Text>
                    <Text style={styles.details}>Latitude: {latitude}</Text>
                    <Text style={styles.details}>Longitude: {longitude}</Text>
                    <MapView
                        style={styles.map}
                        initialRegion={{
                            latitude: latitude,
                            longitude: longitude,
                            latitudeDelta: 0.01,
                            longitudeDelta: 0.01,
                        }}
                    >
                        <Marker
                            coordinate={{
                                latitude: latitude,
                                longitude: longitude,
                            }}
                            title="Property Location"
                        />
                    </MapView>
                </Box>
            </ScrollView>
            <View style={styles.buttonContainer}>
                {/* <TouchableOpacity style={styles.editButton} activeOpacity={0.6} onPress={() => console.log('Edit button pressed')}>
                    <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} activeOpacity={0.6} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity> */}
                <Button
                    isDisabled={isLoading}
                    className='h-12 rounded-xl w-40 mx-2'
                    variant='outline'
                    onPress={() => router.push(`/form/new-edit?id=${params.id}`)}
                >
                    <ButtonText className='text-center'>
                        Edit
                    </ButtonText>
                </Button>
                <Button
                    isDisabled={isLoading}
                    onPress={handleSubmit}
                    className='h-12 rounded-xl w-40 mx-2'
                >
                    {isLoading && <ButtonSpinner size={30} color={'black'} />}
                    <ButtonText className='text-center'>
                        Submit
                    </ButtonText>
                </Button>
            </View>
        </>
    );
};

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
        backgroundColor: '#FFF8F2',
        padding: 2,
        borderRadius: 5,
        paddingLeft: 5,
    },
    title: {
        fontSize: 14,
        // fontWeight: 'bold',
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
    buttonText: {
        color: '#000',
        fontSize: 14,
        fontWeight: 'bold',
    },
});

export default draftData;
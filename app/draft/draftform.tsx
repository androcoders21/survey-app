import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import drafts from './dummyd';
import { Box } from '@/components/ui/box';
import { Stack } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import MapView, { Marker } from 'react-native-maps';

interface ParamsProps {
    id: string;
}

const Draft = () => {
    const params = useLocalSearchParams();
    const draft = drafts.find(draft => draft.id === params.id);

    if (!draft) {
        return <Text>Draft not found</Text>;
    }

    const latitude = parseFloat(draft.latitude);
    const longitude = parseFloat(draft.longitude);

    const handleSubmit = () => {
        // Placeholder for API call
        // fetch('https://api.example.com/submit', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify(draft),
        // })
        //   .then(response => response.json())
        //   .then(data => {
        //     console.log('Success:', data);
        //   })
        //   .catch((error) => {
        //     console.error('Error:', error);
        //   });
        console.log('Submit button pressed');
    };

    return (
        <>

            <Stack.Screen options={{
                title: 'Drafted Form',
                headerTitle: "Drafted Form",
                headerShown: true,
                headerTitleStyle: { fontWeight: '700' },
            }} />

            <ScrollView style={styles.container}>
                {/* Owner Detail */}
                <Box style={styles.item}>
                    <Text style={styles.sectionTitle}>Owner Detail</Text>
                    <Text style={styles.details}>Name of the Respondent: {draft.respondentName}</Text>
                    <Text style={styles.details}>Relationship of Respondent with Owner: {draft.respondentRelationship}</Text>
                    <Text style={styles.details}>Others: {draft.ownerAadhaarNumber}</Text>
                    <Text style={styles.details}>Owner Name: {draft.ownerName}</Text>
                    <Text style={styles.details}>Mobile No.: {draft.mobileNo}</Text>
                    <Text style={styles.details}>Father/Husband Name: {draft.fatherHusbandName}</Text>
                </Box>

                {/* Address Details */}
                <Box style={styles.item}>
                    <Text style={styles.sectionTitle}>Address Details</Text>
                    <Text style={styles.details}>Property Address: {draft.propertyAddress}</Text>
                    <Text style={styles.details}>Correspondence Address: {draft.correspondenceAddress}</Text>
                </Box>

                {/* Property Details */}
                <Box style={styles.item}>
                    <Text style={styles.sectionTitle}>Property Details</Text>
                    <Text style={styles.details}>ULB’s Name/Code: {draft.ulbNameCode}</Text>
                    <Text style={styles.details}>E-nagarpalika Id: {draft.nagarpalikaId}</Text>
                    <Text style={styles.details}>Ward No.: {draft.wardNo}</Text>
                    <Text style={styles.details}>Parcel No.: {draft.parcelNo}</Text>
                    <Text style={styles.details}>Property No.: {draft.propertyNo}</Text>
                    <Text style={styles.details}>Electricity Id: {draft.electricityId}</Text>
                    <Text style={styles.details}>Khasra No.: {draft.khasraNo}</Text>
                    <Text style={styles.details}>Registry No.: {draft.registryNo}</Text>
                    <Text style={styles.details}>Constructed Date: {draft.constructedDate}</Text>
                    <Text style={styles.details}>Slum: {draft.isSlum}</Text>
                </Box>

                {/* Taxation Details/General Details of the Property */}
                <Box style={styles.item}>
                    <Text style={styles.sectionTitle}>Taxation Details/General Details of the Property</Text>
                    <Text style={styles.details}>Current Tax Rate Zone: {draft.taxRateZone}</Text>
                    <Text style={styles.details}>Property Ownership: {draft.propertyOwnership}</Text>
                    <Text style={styles.details}>Situation: {draft.situation}</Text>
                    <Text style={styles.details}>Property Use: {draft.propertyUse}</Text>
                    <Text style={styles.details}>Commercial: {draft.commercial}</Text>
                    <Text style={styles.details}>Year of Construction: {draft.yearOfConstruction}</Text>
                    <Text style={styles.details}>Exemption Applicable: {draft.isExemptionApplicable}</Text>
                </Box>

                {/* Property Area Details */}
                <Box style={styles.item}>
                    <Text style={styles.sectionTitle}>Property Area Details</Text>
                    <Text style={styles.details}>Plot Area: {draft.plotAreaSqFt} SqFt / {draft.plotAreaSqMeter} SqMeter</Text>
                    <Text style={styles.details}>Plinth Area: {draft.plinthAreaSqFt} SqFt / {draft.plinthAreaSqMeter} SqMeter</Text>
                    <Text style={styles.details}>Total Built-Up Area: {draft.totalBuiltUpAreaSqFt} SqFt / {draft.totalBuiltUpAreaSqMeter} SqMeter</Text>
                    {/* Assuming floor details are in an array */}
                    {draft.floors && draft.floors.map((floor, index) => (
                        <View key={index}>
                            <Text style={styles.details}>Floor No.: {floor.floorNo}</Text>
                            <Text style={styles.details}>Area: {floor.area}</Text>
                            <Text style={styles.details}>Usage Type: {floor.usageType}</Text>
                            <Text style={styles.details}>Usage Factor: {floor.usageFactor}</Text>
                            <Text style={styles.details}>Construction Type: {floor.constructionType}</Text>
                        </View>
                    ))}
                </Box>

                {/* Municipal Supply */}
                <Box style={styles.item}>
                    <Text style={styles.sectionTitle}>Municipal Supply</Text>
                    <Text style={styles.details}>Municipal Water Supply Connection: {draft.isMuncipalWaterSupply}</Text>
                    <Text style={styles.details}>Source of Water: {draft.sourceOfWater}</Text>
                    <Text style={styles.details}>Toilet Type: {draft.toiletType}</Text>
                    <Text style={styles.details}>Municipal Authority Door to Door Collection: {draft.isMuncipalWasteService}</Text>
                </Box>

                {/* Property Location */}
                <Box style={styles.item}>
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
                <Box>
                    <Text></Text>
                    <Text></Text>
                    <Text></Text>
                    <Text></Text>
                </Box>
            </ScrollView>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 10,
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
        // backgroundColor: '#ffffff',
        paddingVertical: 10,
        alignItems: 'center',
        // boxShadow: '4px 4px 8px 4px rgba(1,1,1,1)',
        // borderRadius: 25,
    },
    button: {
        width: 200,
        height: 40,
        backgroundColor: '#FF7100',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        boxShadow: '0 1px 8px rgba(0,0,0,0.5)',
    },
    buttonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
});

export default Draft;
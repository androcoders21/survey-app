import React from 'react'
import { Box } from '@/components/ui/box'
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { ChevronDownIcon, CircleIcon } from '@/components/ui/icon';
import { Input, InputField } from '@/components/ui/input';
import { Select, SelectBackdrop, SelectContent, SelectDragIndicator, SelectDragIndicatorWrapper, SelectIcon, SelectInput, SelectItem, SelectPortal, SelectTrigger } from '@/components/ui/select';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack'
import { CombinedSurveyType, Step6Type } from '@/utils/validation-schema';
import { Control, Controller, FieldErrors, UseFormSetValue, useWatch } from 'react-hook-form';
import CapturePhoto from '@/components/capture-photo';
import { Image } from 'expo-image';
import { Textarea, TextareaInput } from '../ui/textarea';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useAppSelector } from '@/utils/hooks';
import { StyleSheet } from 'react-native';

const formFields = {
    totalWaterConnection: "No. of Connection",
    waterConnectionId: "Water supply connection ID",
}

interface StepSevenProps {
    control: Control<CombinedSurveyType, any>;
    errors: FieldErrors<CombinedSurveyType>
    setValue: UseFormSetValue<CombinedSurveyType>;
}

const StepSeven = ({ control, errors, setValue }: StepSevenProps) => {
    const currentLocation = useAppSelector((state) => state.map);
    console.log(currentLocation);

    return (
        <Box>
            <Heading className='pb-3'>Property Photo:</Heading>
            <VStack space='lg' className='mb-3'>
                <CapturePhoto handleImage={(value)=>setValue("propertyFirstImage",value)} label='Capture first photo' />
                <CapturePhoto handleImage={(value)=>setValue("propertySecondImage",value)} label='Capture second photo' />
            </VStack>

            <Heading className='pb-3 pt-1'>Property Location:</Heading>
            <MapView
                onMarkerDragEnd={(e) => {console.log(e.nativeEvent.coordinate)}}
                showsUserLocation={true}
                showsMyLocationButton={true}
                onMapLoaded={() => console.log('Map Loaded')}
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
                <Marker draggable coordinate={{latitude:26.4701633,longitude:80.3314867}}/>
            </MapView>

            <Heading className='pb-3 pt-1'>Upload Supporting Documents:</Heading>
            <Heading className='pb-3 pt-1'>Remark</Heading>
            <Controller
                name='remark'
                control={control}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <Textarea className="rounded-2xl" size="lg" isDisabled={false} isInvalid={!!errors.remark} isReadOnly={false}>
                        <TextareaInput
                            className="text-sm align-top"
                            onChange={(e) => onChange(e.nativeEvent.text)}
                            value={value as string}
                            placeholder={`Enter Remark`}
                        />
                    </Textarea>
                )}
            />
        </Box>
    )
}

const styles = StyleSheet.create({
    map: {
        width: '100%',
        height: 220,
    },
});

export default StepSeven
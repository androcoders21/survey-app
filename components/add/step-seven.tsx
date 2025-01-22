import React from 'react'
import { Box } from '@/components/ui/box'
import { Heading } from '@/components/ui/heading';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack'
import { CombinedSurveyType, Step6Type } from '@/utils/validation-schema';
import { Control, Controller, FieldErrors, useFieldArray, UseFormSetValue, useWatch } from 'react-hook-form';
import CapturePhoto from '@/components/capture-photo';
import { Textarea, TextareaInput } from '../ui/textarea';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useAppSelector } from '@/utils/hooks';
import { Pressable, StyleSheet } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import CustomImagePicker from '../image-picker';

interface StepSevenProps {
    control: Control<CombinedSurveyType, any>;
    errors: FieldErrors<CombinedSurveyType>
    setValue: UseFormSetValue<CombinedSurveyType>;
}

interface ImageArgs {
    name: string;
    uri: string;
    type: string;
    size: number;
}

const StepSeven = ({ control, errors, setValue }: StepSevenProps) => {
    console.log(errors);
    const currentLocation = useAppSelector((state) => state.map);
    const [isMapReady, setIsMapReady] = React.useState(false);
    const [latitude, longitude, propertyFirstImage, propertySecondImage] = useWatch({ control, name: ['latitude', 'longitude', 'propertyFirstImage', 'propertySecondImage'] });
    const { fields, append, remove, } = useFieldArray({ control, name: 'supportingDocuments' });
    console.log(currentLocation);

    const handleMarker = (coordinate: any) => {
        console.log(coordinate);
        setValue("latitude", coordinate?.latitude?.toString());
        setValue("longitude", coordinate?.longitude?.toString());
    }


    const handleDocument = (value: ImageArgs) => {
        append(value);
    }

    return (
        <Box>
            <Heading className='pb-3'>Property Photo:</Heading>
            <VStack space='lg' className='mb-3'>
                <CapturePhoto handleImage={(value) => setValue("propertyFirstImage", { name: value.name, uri: value.uri, type: value.type,size:value.size })} label={propertyFirstImage ? propertyFirstImage?.name || 'Capture first photo *' : 'Capture first photo *'} />
                {errors.propertyFirstImage?.name && <Text className="pl-2 text-red-500" size="xs">{errors?.propertyFirstImage?.name?.message}</Text>}
                <CapturePhoto handleImage={(value) => setValue("propertySecondImage", { name: value.name, uri: value.uri, type: value.type,size:value.size })} label={propertySecondImage ? propertySecondImage?.name || 'Capture second photo *' : 'Capture second photo *'} />
                {errors.propertySecondImage?.name && <Text className="pl-2 text-red-500" size="xs">{errors?.propertySecondImage?.name?.message}</Text>}
            </VStack>

            <Heading className='pb-3 pt-1'>Property Location:</Heading>
            <MapView
                onMarkerDragEnd={(e) => handleMarker(e.nativeEvent.coordinate)}
                onMapLoaded={() => setIsMapReady(true)}
                mapType='satellite'
                initialRegion={{
                    latitude: Number(latitude) || 26.4777283,
                    longitude: Number(longitude) || 80.3988467,
                    latitudeDelta: 0.0007,
                    longitudeDelta: 0.0007,
                }}
                style={styles.map}
                provider={PROVIDER_GOOGLE}
            >
                {isMapReady && <Marker draggable coordinate={{ latitude: Number(latitude) || 26.4777283, longitude: Number(longitude) || 80.3988467 }} />}
            </MapView>

            <Heading className='pb-3 pt-1'>Upload Supporting Documents:</Heading>
            <CustomImagePicker handleImage={(value) => handleDocument(value)} label={'Upload supporting documents'} />
            {fields.map((item, index) => (
                <Box key={item.id} className='my-2 py-3 px-2 border border-slate-300 rounded-lg flex flex-row justify-between'>
                    <Text size='sm' bold>Document {index + 1}</Text>
                    <Pressable onPress={() => remove(index)}><Icon as={() => <Entypo name="circle-with-cross" size={20} color="black" />} size="md" /></Pressable>
                </Box>
            ))}
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
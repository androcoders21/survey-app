import React from 'react'
import { Button, ButtonText } from './ui/button'
import { Box } from './ui/box'
import { Control, Controller, FieldValues } from 'react-hook-form'
import { Text } from './ui/text'
import { SurveyStepThreeType } from '@/utils/validation-schema'
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { StyleSheet } from 'react-native'

interface CameraPickerProps {
    control: Control<SurveyStepThreeType> | undefined;
    errors: any;
    name: keyof SurveyStepThreeType;
    onUpload: (key: keyof SurveyStepThreeType, data: any) => void;
    uploadedImage?: string | null | undefined;
}

const CameraPicker = ({ control, errors, name, onUpload, uploadedImage }: CameraPickerProps) => {

    const [imageUri, setImageUri] = React.useState("");
    const handleUpload = async () => {
        const image = await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 0.5 });
        onUpload(name, image);
        if (!image?.canceled) {
            const { assets } = image;
            const imageValue = assets[0];
            setImageUri(imageValue.uri);
        }
    }

    const getError = () => {
        if (errors?.[name]?.message) return errors?.[name]?.message;
        if (errors?.[name]?.name?.message) return errors?.[name]?.name?.message;
        if (errors?.[name]?.uri?.message) return errors?.[name]?.uri?.message;
        if (errors?.[name]?.size?.message) return errors?.[name]?.size?.message;
    }

    return (
        <Box>
            <Controller
                name={name}
                control={control}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <Button onPress={handleUpload} className='rounded-xl' variant='outline'><ButtonText className='text-center'>Click to Upload</ButtonText></Button>
                )}
            />
            {errors?.[name as keyof SurveyStepThreeType] && <Text className="pl-2 text-red-500" size="xs">{getError()}</Text>}
            {imageUri && <Image source={imageUri} style={styles.image} contentFit='contain' />}
            {(uploadedImage && !imageUri) && <Image source={`https://survey-project.csvu.in/public/${uploadedImage}`} style={styles.image} contentFit='contain' />}
        </Box>
    )
}

export default CameraPicker

const styles = StyleSheet.create({
    image: {
        flex: 1,
        height: 100,
        marginTop: 10,
    },
})
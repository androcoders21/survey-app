import React from 'react'
import { Button, ButtonText } from './ui/button'
import { Box } from './ui/box'
import { Control, Controller, FieldValues } from 'react-hook-form'
import { Text } from './ui/text'
import { SurveyStepThreeType } from '@/utils/validation-schema'
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Image } from 'expo-image';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { StyleSheet, ToastAndroid } from 'react-native'

interface ImageArgs {
    name: string;
    uri:string;
    type:string;
}
interface CapturePhotoProps {
    label: string;
    handleImage:(value:ImageArgs)=>void;
}

const CapturePhoto = ({label,handleImage}:CapturePhotoProps) => {

    const [imageUri, setImageUri] = React.useState("");
    const handleUpload = async () => {
        const image = await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 0.5 });
        // onUpload(name, image);
        if (!image?.canceled) {
            const { assets } = image;
            const imageValue = assets[0];
            console.log(imageValue);
            const fileName = imageValue?.fileName || Date.now().toString();
            const fileUri = imageValue.uri;
            const mimeType = imageValue.mimeType || 'image/jpeg';
            try {
                if(FileSystem.documentDirectory){
                const newPath = FileSystem.documentDirectory + fileName;
                await FileSystem.moveAsync({
                    from: fileUri,
                    to: newPath,
                })
                setImageUri(fileName);
                handleImage({name:fileName,uri:fileUri,type:mimeType});
            }
            } catch (error) {
                console.log(error);
                ToastAndroid.show('Error while uploading image', ToastAndroid.SHORT);
            }
        }
    }

    return (
        <Box>
            <Button onPress={handleUpload} className='border-slate-300 flex flex-row h-14 justify-between' variant='outline'><FontAwesome name="camera" size={22} color="gray" /><ButtonText className='text-center text-gray-500 text-sm flex-1'>{label}</ButtonText></Button>
        </Box>
    )
}

export default CapturePhoto

const styles = StyleSheet.create({
    image: {
        flex: 1,
        height: 100,
        marginTop: 10,
    },
})
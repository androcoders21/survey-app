import React from 'react'
import { Button, ButtonText } from './ui/button'
import { Box } from './ui/box'
import * as ImagePicker from 'expo-image-picker';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { StyleSheet } from 'react-native'

interface ImageArgs {
    name: string;
    uri: string;
    type: string;
    size: number;
}
interface CapturePhotoProps {
    label: string;
    handleImage: (value: ImageArgs) => void;
}

const CapturePhoto = ({ label, handleImage }: CapturePhotoProps) => {

    const [isCameraActive, setIsCameraActive] = React.useState(false);
    const [imageUri, setImageUri] = React.useState("");

    const handleUpload = async () => {
        if (isCameraActive) return; 
        setIsCameraActive(true);
        try {
            const image = await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 0.3 });
            // onUpload(name, image);
            if (!image?.canceled) {
                const { assets } = image;
                const imageValue = assets[0];
                console.log(imageValue);
                const fileName = imageValue?.fileName || Date.now().toString();
                const fileUri = imageValue.uri;
                const mimeType = imageValue.mimeType || 'image/jpeg';
                const size = imageValue.fileSize || 0;
                handleImage({ name: fileName, uri: fileUri, type: mimeType, size: size });
                setTimeout(()=>setIsCameraActive(false), 1000);
            }
        } catch (error) {
            console.log(error);
        }finally{
            setIsCameraActive(false);
        }
    }

    return (
        <Box>
            <Button onPress={handleUpload} className='border-slate-300 flex flex-row h-14 justify-between' variant='outline'><FontAwesome name="camera" size={22} color="gray" /><ButtonText className='text-center text-gray-500 text-sm flex-1'>{label}</ButtonText></Button>
        </Box>
    )
}

export default React.memo(CapturePhoto)

const styles = StyleSheet.create({
    image: {
        flex: 1,
        height: 100,
        marginTop: 10,
    },
})
import { FontAwesome } from "@expo/vector-icons";
import { Box } from "./ui/box";
import { Button, ButtonText } from "./ui/button";
import * as ImagePicker from 'expo-image-picker';

interface ImageArgs {
    name: string;
    uri:string;
    type:string;
    size:number;
}
interface CapturePhotoProps {
    label: string;
    handleImage:(value:ImageArgs)=>void;
}

const CustomImagePicker = ({label,handleImage}:CapturePhotoProps) => {
    const [permission, requestPermission] = ImagePicker.useCameraPermissions();
    const handleUpload = async () => {
        // const image = await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 0.5 });
        if (permission && !permission.granted) {
            requestPermission();
            return;
        }
        const image = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 0.4,
          });
        // onUpload(name, image);
        if (!image?.canceled) {
            const { assets } = image;
            const imageValue = assets[0];
            console.log(imageValue);
            const fileName = imageValue?.fileName || Date.now().toString();
            const fileUri = imageValue.uri;
            const mimeType = imageValue.mimeType || 'image/jpeg';
            const size = imageValue.fileSize || 0;
            handleImage({name:fileName,uri:fileUri,type:mimeType,size:size});
            // try {
            //     if(FileSystem.documentDirectory){
            //     const newPath = FileSystem.documentDirectory + fileName;
            //     await FileSystem.moveAsync({
            //         from: fileUri,
            //         to: newPath,
            //     })
            //     setImageUri(fileName);
            // }
            // } catch (error) {
            //     console.log(error);
            //     ToastAndroid.show('Error while uploading image', ToastAndroid.SHORT);
            // }
        }
    }

    return (
        <Box>
            <Button onPress={handleUpload} className='border-slate-300 flex flex-row h-14 justify-between' variant='outline'><FontAwesome name="camera" size={22} color="gray" /><ButtonText className='text-center text-gray-500 text-sm flex-1'>{label}</ButtonText></Button>
        </Box>
    )
}

export default CustomImagePicker
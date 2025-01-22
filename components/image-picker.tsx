import { FontAwesome } from "@expo/vector-icons";
import { Box } from "./ui/box";
import { Button, ButtonText } from "./ui/button";
import * as ImagePicker from 'expo-image-picker';
import { Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader } from '@/components/ui/modal';
import React from "react";
import { Heading } from "./ui/heading";
import { Icon } from "./ui/icon";
import { Text } from "./ui/text";
import { TouchableOpacity } from "react-native";

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

const CustomImagePicker = ({ label, handleImage }: CapturePhotoProps) => {
    const [showModal, setShowModal] = React.useState(false);
    const [cameraPermission, cameraRequestPermission] = ImagePicker.useCameraPermissions();
    const [mediaPermission, mediaRequestPermission] = ImagePicker.useMediaLibraryPermissions();

    const handleGallery = async () => {
        // const image = await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 0.5 });
        if (mediaPermission && !mediaPermission.granted) {
            mediaRequestPermission();
            return;
        }
        const image = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 0.4,
        });
        handleClose();
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
        }
    }

    const handleCamera = async () => {
        if (cameraPermission && !cameraPermission.granted) {
            cameraRequestPermission();
            return;
        }
        const image = await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 0.5 });
        // onUpload(name, image);
        handleClose();
        if (!image?.canceled) {
            const { assets } = image;
            const imageValue = assets[0];
            console.log(imageValue);
            const fileName = imageValue?.fileName || Date.now().toString();
            const fileUri = imageValue.uri;
            const mimeType = imageValue.mimeType || 'image/jpeg';
            const size = imageValue.fileSize || 0;
            handleImage({ name: fileName, uri: fileUri, type: mimeType, size: size });
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

    const handleClose = () => {
        setShowModal(false);
    }

    return (
        <Box>
            <Button onPress={()=>setShowModal(true)} className='border-slate-300 flex flex-row h-14 justify-between' variant='outline'><ButtonText className='text-center text-gray-500 text-sm'>{label}</ButtonText><FontAwesome name="file" size={22} color="gray" /></Button>
            <Modal
                isOpen={showModal}
                onClose={handleClose}
                size="md"
            >
                <ModalBackdrop />
                <ModalContent className="bg-white rounded-2xl py-3 px-4">
                    <ModalHeader>
                        <Heading size="lg" className="text-typography-950">
                            Choose Image
                        </Heading>
                    </ModalHeader>
                    <ModalBody className="mb-2">
                        <TouchableOpacity onPress={handleCamera} activeOpacity={0.6} className="py-2">
                            <Text>Take Photo</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleGallery} activeOpacity={0.6} className="py-2">
                            <Text>Choose from Gallery</Text>
                        </TouchableOpacity>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            variant="outline"
                            action="secondary"
                            onPress={handleClose}
                        >
                            <ButtonText>Cancel</ButtonText>
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    )
}

export default CustomImagePicker
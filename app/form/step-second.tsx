import { Box } from '@/components/ui/box'
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Text } from '@/components/ui/text'
import { VStack } from '@/components/ui/vstack'
import { useUpdateSurveyMutation } from '@/redux/api/end-points/survey'
import { useAppSelector } from '@/utils/hooks'
import { surveyStepTwoSchema, SurveyStepTwoType } from '@/utils/validation-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, ToastAndroid } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as DocumentPicker from 'expo-document-picker';
import { router, Stack, useLocalSearchParams } from 'expo-router'
import { CameraType, CameraView, CameraViewRef, useCameraPermissions } from 'expo-camera'
import * as ImagePicker from 'expo-image-picker';
import CameraPicker from '@/components/camera-picker'

const fieldsName = {
  img1: "Upload building front",
  img2: "Upload building right",
  img3: "Upload building left",
  img4: "Aadhar card front",
  img5: "Aadhar card back",
  img6: "Other document (Optional)",
}
const SecondStep = () => {
  const [facing, setFacing] = React.useState<CameraType>('front');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = React.useRef<null | any>(null);
  const params = useLocalSearchParams<{ formId: string }>();
  const [updateSurvey, { isLoading }] = useUpdateSurveyMutation();
  const { control, handleSubmit, formState: { errors }, reset, setValue,getValues } = useForm<SurveyStepTwoType>({
    resolver: zodResolver(surveyStepTwoSchema)
  })

  const userId = useAppSelector(state => state.user.userId)
  console.log("PARAMS", params);
  const onSubmit = async (data: SurveyStepTwoType) => {
    console.log("DATA", data);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value as any);
      }
      )
      formData.append("user_id", userId);
      const response = await updateSurvey({ data: formData, id: params.formId }).unwrap();
      console.log(response);
      ToastAndroid.show("Survey updated successfully", ToastAndroid.SHORT);
      reset();
      router.replace('/(tabs)/add'); 
    } catch (error:any) {
      console.log(error);
      if(error && typeof error?.data?.error === "string"){
        ToastAndroid.show(error?.data?.error,ToastAndroid.SHORT);
      } else {
        ToastAndroid.show("Unable to create survey",ToastAndroid.SHORT);
      }
    }
  }

  // const handleUpload = async () => {
  //   const result = await DocumentPicker.getDocumentAsync({
  //     type: 'image/*',
  //     copyToCacheDirectory: true,
  //     multiple: false
  //   });
  //   if(!result.canceled){
  //     const uri = result?.assets[0].uri;
  //     const file = {
  //       name: result?.assets[0].name,
  //       uri: uri,
  //       type: result?.assets[0]?.mimeType || 'image/jpeg',
  //       size: result?.assets[0]?.size || 0,
  //     }
  //     console.log(file);
  //     setValue("img1",file);
  // }
  //   console.log(result);
  // }

  const handleUpload = async (key:keyof SurveyStepTwoType,data: any) => {
    console.log("UPLOAD", data,key);
    if(!data?.canceled){
      const image = data?.assets[0];
      const file = {
        name: image?.fileName,
        uri: image?.uri,
        type: image?.mimeType || 'image/jpeg',
        size: image?.fileSize || 0,
      }
      setValue(key, file);
    }
  }

  // const clickPhoto = async () => {
  //   const image = await cameraRef.current?.takePictureAsync();
  //   console.log(image);
  // }

  const launchCamera = async () => {
    const image = await ImagePicker.launchCameraAsync();
    console.log(image);
  }





  if (!permission) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator />
      </SafeAreaView>)
  }
  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{headerShown:false}}/>
        <Text>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} variant='solid'><ButtonText>Request Permission</ButtonText></Button>
      </SafeAreaView>)
  }
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{headerShown:false}}/>
      <Heading size='2xl' className='mb-2 relative'>Upload Images</Heading>
      <ScrollView>
        <Box>
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? 'padding' : undefined} style={styles.container} >
            <VStack space="lg" className='w-full'>
              {Object.entries(fieldsName).map(([key, value]) => (
                <VStack key={key}>
                <Text size="sm" className="mb-1" bold>{value} {key !== "img6" && "*"}</Text>
                <CameraPicker control={control} errors={errors} name={key as keyof SurveyStepTwoType} onUpload={handleUpload} />
              </VStack>
                ))}
            </VStack>
            <VStack space="lg">
              <Button isDisabled={isLoading} onPress={handleSubmit(onSubmit)} className='h-14 w-80 mt-4 rounded-3xl'>
                {isLoading && <ButtonSpinner size={30} color={'black'} />}<ButtonText className='text-center'>Submit</ButtonText></Button>
            </VStack>

          </KeyboardAvoidingView>
        </Box>
      </ScrollView>
      {/* <CameraView ref={cameraRef} onCameraReady={()=>console.log("Camera Ready")} style={styles.camera} facing={facing}>
        <Box style={styles.buttonContainer}>
          <Button onPress={()=> setFacing(current => (current === 'back' ? 'front' : 'back'))}>
            <ButtonText>Flip Camera</ButtonText>
          </Button>
          <Button onPress={clickPhoto}>
            <ButtonText>Click</ButtonText>
          </Button>
        </Box>
      </CameraView> */}
      {/* <Button onPress={launchCamera}>
            <ButtonText>Click</ButtonText>
          </Button> */}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 7,
    paddingVertical: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
});

export default SecondStep
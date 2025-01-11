import { Box } from '@/components/ui/box'
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Text } from '@/components/ui/text'
import { VStack } from '@/components/ui/vstack'
import { useUpdateSurveyMutation } from '@/redux/api/end-points/survey'
import { useAppSelector } from '@/utils/hooks'
import { surveyStepThreeSchema, SurveyStepThreeType } from '@/utils/validation-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect, useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, ToastAndroid } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as DocumentPicker from 'expo-document-picker';
import { router, Stack, useLocalSearchParams } from 'expo-router'
import { CameraType, CameraView, CameraViewRef, useCameraPermissions } from 'expo-camera'
import * as ImagePicker from 'expo-image-picker';
import CameraPicker from '@/components/camera-picker'
import * as Location from 'expo-location';

const fieldsName = {
  img1: "Upload building front",
  img2: "Upload building right",
  img3: "Upload building left",
  img4: "Aadhar card front",
  img5: "Aadhar card back",
  img6: "Other document (Optional)",
}

const notRequiredFields = ["img4", "img5", "img6"];

const ThirdStep = () => {
  const [facing, setFacing] = React.useState<CameraType>('front');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = React.useRef<null | any>(null);
  const params = useLocalSearchParams<{ formId: string, isEdit?: string }>();
  const [updateSurvey, { isLoading }] = useUpdateSurveyMutation();
  const { control, handleSubmit, formState: { errors }, reset, setValue, getValues } = useForm<SurveyStepThreeType>({
    resolver: zodResolver(surveyStepThreeSchema),
  })

  const userId = useAppSelector(state => state.user.userId)
  const surveyDetails = useAppSelector(state => state.survey);
  console.log("PARAMS", params);
  const onSubmit = async (data: SurveyStepThreeType) => {
    console.log("DATA", data);
    try {
      const formData = new FormData();
      const location = await locationDetails;
      Object.entries(data).forEach(([key, value]) => {
        if (typeof value === "object") {
          console.log(key, value);
          formData.append(key, value as any);
          if(["img1","img2","img3"].includes(key)){
            formData.append("udf1", location?.latitude?.toString() || "");
            formData.append("udf2", location?.longitude?.toString() || "");
          }
        }
      }
      )
      formData.append("user_id", userId);
      const response = await updateSurvey({ data: formData, id: params.formId }).unwrap();
      console.log(response);
      ToastAndroid.show("Survey updated successfully", ToastAndroid.SHORT);
      reset();
      router.replace('/(tabs)');
    } catch (error: any) {
      console.log(error);
      if (error && typeof error?.data?.error === "string") {
        ToastAndroid.show(error?.data?.error, ToastAndroid.SHORT);
      } else {
        ToastAndroid.show("Unable to update survey", ToastAndroid.SHORT);
      }
    }
  }

  const locationDetails = useMemo(async ()=>{
    async function getCurrentLocation() {
    
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
              ToastAndroid.show('Permission to access location was denied', ToastAndroid.SHORT);
              return;
            }
    
            let location = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = location.coords;
            return {latitude, longitude};
          }
          const value = await getCurrentLocation();
          return value;
  },[]);

  useEffect(() => {
    if (params?.isEdit) {
      reset({
        img1: surveyDetails?.img1 || undefined,
        img2: surveyDetails?.img2 || undefined,
        img3: surveyDetails?.img3 || undefined,
        img4: surveyDetails?.img4 || undefined,
        img5: surveyDetails?.img5 || undefined,
        img6: surveyDetails?.img6 || undefined,
        udf1: surveyDetails?.udf1 || "",
        udf2: surveyDetails?.udf2 || "",
      });
    }
  }, [params.formId])

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

  const handleUpload = async (key: keyof SurveyStepThreeType, data: any) => {
    if (!data?.canceled) {
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
        <Stack.Screen options={{ headerShown: false }} />
        <ActivityIndicator />
      </SafeAreaView>)
  }
  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <Text>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} variant='solid'><ButtonText>Request Permission</ButtonText></Button>
      </SafeAreaView>)
  }
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Box className='bg-white relative w-full py-3'>
        <Heading size='2xl' className='text-center'>Upload Images</Heading>
      </Box>
      <ScrollView>
        <Box className='p-4'>
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? 'padding' : undefined} >
            <VStack space="lg">
              {Object.entries(fieldsName).map(([key, value]) => (
                <VStack key={key}>
                  <Text size="sm" className="mb-1" bold>{value} {!notRequiredFields.includes(key) && "*"}</Text>
                  <CameraPicker uploadedImage={params?.isEdit ? surveyDetails[key as keyof SurveyStepThreeType] : ""} control={control} errors={errors} name={key as keyof SurveyStepThreeType} onUpload={handleUpload} />
                </VStack>
              ))}
            </VStack>
            <VStack className='flex flex-row justify-center' space="lg">
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
    paddingBottom: 10,
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

export default ThirdStep
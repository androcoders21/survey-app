import { StyleSheet, Platform, KeyboardAvoidingView, ScrollView, ToastAndroid, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heading } from '@/components/ui/heading';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form';
import { Text } from '@/components/ui/text';
import { Input, InputField } from '@/components/ui/input';
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import { surveySchema, SurveyType } from '@/utils/validation-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateSurveyMutation } from '@/redux/api/end-points/survey';
import { useAppDispatch, useAppSelector } from '@/utils/hooks';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback } from 'react';
import * as Location from 'expo-location';
import { useFetchWardQuery } from '@/redux/api/end-points/ward';
import { Select, SelectBackdrop, SelectContent, SelectDragIndicator, SelectDragIndicatorWrapper, SelectIcon, SelectInput, SelectItem, SelectPortal, SelectTrigger } from '@/components/ui/select';
import { ChevronDownIcon, Icon } from '@/components/ui/icon';
import { LandMarkType, WardType } from '@/utils/types';
import { useFetchLandmarksQuery } from '@/redux/api/end-points/property-type';
import { clearLocal } from '@/utils/helper';
import { setUserId, setUserToken } from '@/redux/slices/user';
import { apiSlice } from '@/redux/api/api-slice';

const formFields = {
  udf3: "Parcel Id",
  nameOfOwner: "Name of owner",
  fatherNameOfOwner: "Father's Name of owner",
  email: "Email",
  mobile: "Mobile",
  udf4: "Alternate Mobile",
};

const formFields2 = {
  building_house_plot: "Building/House/Plot",
  address_of_residence: "Address of residence",
}

const formFields3 = {
  area: "Area",
  city: "City",
  state: "State",
  pincode: "Pincode",
}

const notRequiredFields = ["details_of_building_other_details", "email", "udf4"]

export default function TabTwoScreen() {
  const [createSurvey, { isLoading }] = useCreateSurveyMutation();
  const { isFetching, data: wardData } = useFetchWardQuery();
  const { data: landmarkData } = useFetchLandmarksQuery();
  const dispatch = useAppDispatch();
  const { control, handleSubmit, formState: { errors }, reset, setValue, watch, getValues } = useForm<SurveyType>({
    resolver: zodResolver(surveySchema)
  }); // initialize the hook

  const userId = useAppSelector(state => state.user.userId)
  const onSubmit = async (data: SurveyType) => {
    console.log("DATA", data);
    try {
      const response = await createSurvey({ ...data, user_id: userId }).unwrap();
      console.log(response);
      ToastAndroid.show("Survey created successfully", ToastAndroid.SHORT);
      router.navigate({ pathname: '/form/step-second', params: { formId: response?.survey_form?.id } });
      reset();
    } catch (error: any) {
      if (error?.data?.status === 401) {
        handleLogout()
        ToastAndroid.show("Session expired, Please Re-login", ToastAndroid.LONG);
      }
      else if (error && typeof error?.data?.error === "string") {
        ToastAndroid.show(error?.data?.error, ToastAndroid.SHORT);
      } else {
        ToastAndroid.show("Unable to create survey", ToastAndroid.SHORT);
      }
    }
  }

  const handleLogout = () => {
    clearLocal();
    dispatch(setUserToken(""));
    dispatch(setUserId(""));
    dispatch(apiSlice.util.resetApiState());
    router.replace('/signin');
  }

  useFocusEffect(
    useCallback(() => {
      async function getCurrentLocation() {

        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          ToastAndroid.show('Permission to access location was denied', ToastAndroid.SHORT);
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;
        const address = await Location.reverseGeocodeAsync({ latitude, longitude });
        setValue("udf1", latitude.toString());
        setValue("udf2", longitude.toString());
        setValue("address_of_residence", address[0]?.formattedAddress || "");
        // setValue("area", address[0]?.formattedAddress || "");
        setValue("city", address[0]?.city || "");
        setValue("state", address[0]?.region || "");
        setValue("pincode", address[0]?.postalCode || "");
      }

      getCurrentLocation();
    }, [])
  )

  return (
    <SafeAreaView style={styles.container}>
      <Box className='bg-white w-full py-3 border-gray-300 border-b'>
        <Heading size='2xl' className='text-center'>Add Survey</Heading>
      </Box>
      <ScrollView>
        <Box className='p-4'>
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? 'padding' : undefined} >
            <VStack space="sm">
              <Box className='bg-gray-300 w-full p-3 rounded-xl'>
                <VStack space='lg' className='bg-white px-3 py-3 my-2 rounded-2xl'>
                  {Object.entries(formFields).map(([key, heading]) => (
                    <VStack key={key}>
                      <Text size="sm" className="mb-1" bold>{heading} {!notRequiredFields.includes(key as keyof typeof formFields) && "*"}</Text>
                      <Controller
                        name={key as keyof SurveyType}
                        control={control}
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                          <Input variant="outline" className="rounded-2xl" size="lg" isDisabled={false} isInvalid={!!errors[key as keyof SurveyType]} isReadOnly={false} >
                            <InputField
                              className="text-sm font-bold"
                              onChange={(e) => onChange(e.nativeEvent.text)}
                              value={value as string}
                              placeholder={`Enter ${heading}`}
                            />
                          </Input>
                        )}
                      />
                      {errors[key as keyof SurveyType] && <Text className="pl-2 text-red-500" size="xs">{errors[key as keyof SurveyType]?.message}</Text>}
                    </VStack>
                  ))
                  }
                </VStack>
              </Box>
              <Box className='bg-gray-300 w-full p-3 rounded-xl'>
                <VStack space='lg' className='bg-white px-3 py-3 my-2 rounded-2xl'>
                  <VStack>
                    <Text size="sm" className="mb-1" bold>Select Ward *</Text>
                    <Controller
                      name='ward_name'
                      control={control}
                      render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <Select isInvalid={!!errors.ward_name} onValueChange={(data) => setValue("ward_name", data)}>
                          <SelectTrigger variant="outline" className='rounded-2xl' size="md" >
                            <SelectInput className='text-sm font-bold' placeholder="Select ward" />
                            <SelectIcon className="mr-3" as={ChevronDownIcon} />
                          </SelectTrigger>
                          <SelectPortal>
                            <SelectBackdrop />
                            <SelectContent>
                              <SelectDragIndicatorWrapper>
                                <SelectDragIndicator />
                              </SelectDragIndicatorWrapper>
                              <ScrollView style={{ width: Dimensions.get('window').width, height: 600 }}>
                                {wardData?.map((ward: WardType) => (
                                  <SelectItem key={ward.id} label={ward?.name} value={ward.id.toString()} />
                                ))}
                              </ScrollView>
                            </SelectContent>
                          </SelectPortal>
                        </Select>
                      )}
                    />
                    {errors.ward_name && <Text className="pl-2 text-red-500" size="xs">{errors?.ward_name?.message}</Text>}
                  </VStack>
                  {/* Property type */}
                  {Object.entries(formFields2).map(([key, heading]) => (
                    <VStack key={key}>
                      <Text size="sm" className="mb-1" bold>{heading} {!notRequiredFields.includes(key as keyof typeof formFields) && "*"}</Text>
                      <Controller
                        name={key as keyof SurveyType}
                        control={control}
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                          <Input variant="outline" className="rounded-2xl" size="lg" isDisabled={false} isInvalid={!!errors[key as keyof SurveyType]} isReadOnly={false} >
                            <InputField
                              className="text-sm font-bold"
                              onChange={(e) => onChange(e.nativeEvent.text)}
                              value={value as string}
                              placeholder={`Enter ${heading}`}
                            />
                          </Input>
                        )}
                      />
                      {errors[key as keyof SurveyType] && <Text className="pl-2 text-red-500" size="xs">{errors[key as keyof SurveyType]?.message}</Text>}
                    </VStack>
                  ))}

                  {/* Landmark */}
                  <VStack>
                    <Text size="sm" className="mb-1" bold>Landmark Type</Text>
                    <Controller
                      name='landmark'
                      control={control}
                      render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <Select isInvalid={!!errors.landmark} onValueChange={(data) => setValue("landmark", data)}>
                          <SelectTrigger variant="outline" className='rounded-2xl' size="md" >
                            <SelectInput className='text-sm font-bold' placeholder="Select Landmark type" />
                            <SelectIcon className="mr-3" as={ChevronDownIcon} />
                          </SelectTrigger>
                          <SelectPortal>
                            <SelectBackdrop />
                            <SelectContent>
                              <SelectDragIndicatorWrapper>
                                <SelectDragIndicator />
                              </SelectDragIndicatorWrapper>
                              <ScrollView style={{ width: Dimensions.get('window').width, height: 300 }}>
                                {landmarkData?.map((landmark: LandMarkType) => (
                                  <SelectItem key={landmark?.id} label={landmark?.name} value={landmark.name.toString()} />
                                ))}
                              </ScrollView>
                            </SelectContent>
                          </SelectPortal>
                        </Select>
                      )}
                    />
                    {errors.landmark && <Text className="pl-2 text-red-500" size="xs">{errors?.landmark?.message}</Text>}
                  </VStack>

                  {Object.entries(formFields3).map(([key, heading]) => (
                    <VStack key={key}>
                      <Text size="sm" className="mb-1" bold>{heading} {!notRequiredFields.includes(key as keyof typeof formFields) && "*"}</Text>
                      <Controller
                        name={key as keyof SurveyType}
                        control={control}
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                          <Input variant="outline" className="rounded-2xl" size="lg" isDisabled={false} isInvalid={!!errors[key as keyof SurveyType]} isReadOnly={false} >
                            <InputField
                              className="text-sm font-bold"
                              onChange={(e) => onChange(e.nativeEvent.text)}
                              value={value as string}
                              placeholder={`Enter ${heading}`}
                            />
                          </Input>
                        )}
                      />
                      {errors[key as keyof SurveyType] && <Text className="pl-2 text-red-500" size="xs">{errors[key as keyof SurveyType]?.message}</Text>}
                    </VStack>
                  ))}
                </VStack>
              </Box>
            </VStack>
            <VStack className='flex flex-row justify-center' space="lg">
              <Button isDisabled={isLoading} onPress={handleSubmit(onSubmit)} className='h-14 w-80 mt-4 rounded-3xl'>
                {isLoading && <ButtonSpinner size={30} color={'black'} />}<ButtonText className='text-center'>Next</ButtonText></Button>
            </VStack>

          </KeyboardAvoidingView>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 10,
  }
});

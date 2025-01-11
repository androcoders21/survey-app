import { StyleSheet, Platform, KeyboardAvoidingView, ScrollView, ToastAndroid, Dimensions, View } from 'react-native';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { Controller, useForm } from 'react-hook-form';
import { Text } from '@/components/ui/text';
import { Input, InputField } from '@/components/ui/input';
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import { surveySchema, SurveyType } from '@/utils/validation-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUpdateSurveyMutation } from '@/redux/api/end-points/survey';
import { useAppSelector } from '@/utils/hooks';
import { router, Stack, useFocusEffect } from 'expo-router';
import React, { useEffect } from 'react';
import { useFetchWardQuery } from '@/redux/api/end-points/ward';
import { Select, SelectBackdrop, SelectContent, SelectDragIndicator, SelectDragIndicatorWrapper, SelectIcon, SelectInput, SelectItem, SelectPortal, SelectTrigger } from '@/components/ui/select';
import { ChevronDownIcon } from '@/components/ui/icon';
import { LandMarkType, WardType } from '@/utils/types';
import { useFetchLandmarksQuery } from '@/redux/api/end-points/property-type';

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

const notRequiredFields = ["details_of_building_other_details", "email", "udf4"];

export default function SurveyEdit() {
  const surveyDetails = useAppSelector(state => state.survey);
  const [updateSurvey, { isLoading }] = useUpdateSurveyMutation();
  const { data: landmarkData } = useFetchLandmarksQuery();
  const { control, handleSubmit, formState: { errors }, reset, setValue, watch, getValues } = useForm<SurveyType>({
    resolver: zodResolver(surveySchema)
  })
  const { isFetching, data: wardData } = useFetchWardQuery();
  const userId = useAppSelector(state => state.user.userId);
  const onSubmit = async (data: SurveyType) => {
    try {
      const response = await updateSurvey({ data: { ...data, user_id: userId }, id: surveyDetails.id.toString() }).unwrap();
      console.log(response);
      ToastAndroid.show("Survey Updated successfully", ToastAndroid.SHORT);
      router.navigate({ pathname: '/form/step-second', params: { formId: surveyDetails?.id.toString(), isEdit: 1 } });

    } catch (error: any) {
      console.log(error);
      if (error && typeof error?.data?.error === "string") {
        ToastAndroid.show(error?.data?.error, ToastAndroid.SHORT);
      } else {
        ToastAndroid.show("Unable to create survey", ToastAndroid.SHORT);
      }
    }
  }

  //   useFocusEffect(
  //     useCallback(() => {
  //       async function getCurrentLocation() {

  //         let { status } = await Location.requestForegroundPermissionsAsync();
  //         if (status !== 'granted') {
  //           ToastAndroid.show('Permission to access location was denied', ToastAndroid.SHORT);
  //           return;
  //         }

  //         let location = await Location.getCurrentPositionAsync({});
  //         const { latitude, longitude } = location.coords;
  //         const address = await Location.reverseGeocodeAsync({ latitude, longitude });
  //         console.log("Address", address);
  //         console.log(location);
  //         setValue("udf1",latitude.toString());
  //         setValue("udf2",longitude.toString());
  //         setValue("address_of_residence", address[0]?.formattedAddress || "");
  //         setValue("area", address[0]?.formattedAddress || "");
  //         setValue("city", address[0]?.city || "");
  //         setValue("state", address[0]?.region || "");
  //         setValue("pincode", address[0]?.postalCode || "");
  //       }

  //       getCurrentLocation();
  //     }, [])
  //   )

  useEffect(() => {
    reset({
      nameOfOwner: surveyDetails.nameOfOwner || "",
      fatherNameOfOwner: surveyDetails.fatherNameOfOwner || "",
      email: surveyDetails.email || "",
      mobile: surveyDetails.mobile || "",
      building_house_plot: surveyDetails.building_house_plot || "",
      ward_name: surveyDetails.ward_name || "",
      address_of_residence: surveyDetails.address_of_residence || "",
      landmark: surveyDetails.landmark || "",
      area: surveyDetails.area || "",
      city: surveyDetails.city || "",
      state: surveyDetails.state || "",
      pincode: surveyDetails.pincode || "",
      udf3: surveyDetails?.udf3 || "",
      udf4: surveyDetails?.udf4 || ""
    });
  }, [])

  return (
    <View style={styles.container}>
      <Stack.Screen options={{
        title: 'Edit Survey',
        headerTitle: "Edit Survey",
        headerShown: true,
        headerShadowVisible: false,
      }} />
      <ScrollView>
        <Box>
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? 'padding' : undefined} style={styles.container} >
            <VStack space="lg" className='w-full'>
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
              <VStack>
                <Text size="sm" className="mb-1" bold>Select Ward *</Text>
                <Controller
                  name='ward_name'
                  control={control}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <Select defaultValue={surveyDetails.ward?.name || ""} isInvalid={!!errors.ward_name} onValueChange={(data) => { setValue("ward_name", data); console.log(data) }}>
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
                    <Select defaultValue={surveyDetails?.landmark || ""} isInvalid={!!errors.landmark} onValueChange={(data) => setValue("landmark", data)}>
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
            <VStack space="lg">
              <Button isDisabled={isLoading} onPress={handleSubmit(onSubmit)} className='h-14 w-80 my-4 rounded-3xl'>
                {isLoading && <ButtonSpinner size={30} color={'black'} />}<ButtonText className='text-center'>Next</ButtonText></Button>
            </VStack>

          </KeyboardAvoidingView>
        </Box>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 7,
    paddingVertical: 10,
  }
});

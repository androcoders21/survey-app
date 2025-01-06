import { StyleSheet, Platform, KeyboardAvoidingView, ScrollView, ToastAndroid, Dimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heading } from '@/components/ui/heading';
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
import React, { useCallback, useEffect, useMemo } from 'react';
import * as Location from 'expo-location';
import { useFetchWardQuery } from '@/redux/api/end-points/ward';
import { Select, SelectBackdrop, SelectContent, SelectDragIndicator, SelectDragIndicatorWrapper, SelectIcon, SelectInput, SelectItem, SelectPortal, SelectTrigger } from '@/components/ui/select';
import { ChevronDownIcon } from '@/components/ui/icon';
import { WardType } from '@/utils/types';

const formFields = {
  nameOfOwner: "Name of owner",
  fatherNameOfOwner: "Father's Name of owner",
  email: "Email",
  mobile: "Mobile",
};

const formFields2 = {
  building_house_plot: "Building/House/Plot",
  address_of_residence: "Address of residence",
  landmark: "Landmark",
  area: "Area",
  city: "City",
  state: "State",
  pincode: "Pincode",
  details_of_building_covered_area: "Building covered area (sq ft/m)",
  details_of_building_open_area: "Building open area (sq ft/m)",
  details_of_building_other_details: "Building other details (sq ft/m)",
  details_of_building_internal_dim_all_room: "Building internal dimensions all room (sq ft/m) A",
  details_of_building_internal_dim_all_balcony: "Building internal dimensions all balcony (sq ft/m) B",
  details_of_building_internal_dim_all_garages: "Building internal dimensions all garages (sq ft/m) C",
}

const formFields3 = {
  is_occupied_by: "Building is occupied by the owner or on the rent",
  year_of_construction: "Year of construction",
}

const requiredFields: (keyof typeof formFields | keyof typeof formFields2 | keyof typeof formFields | keyof typeof formFields3)[] = ["nameOfOwner", "fatherNameOfOwner", "email", "mobile", "area", "city", "state", "pincode", "year_of_construction"]

const notRequiredFields = ["details_of_building_other_details"]

export default function SurveyEdit() {
  const surveyDetails = useAppSelector(state => state.survey);
  console.log("Survey Details", surveyDetails.ward, surveyDetails.ward_name);
  const [updateSurvey, { isLoading }] = useUpdateSurveyMutation();
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
      router.navigate({ pathname: '/(tabs)' });
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
      details_of_building_covered_area: surveyDetails.details_of_building_covered_area || "",
      details_of_building_open_area: surveyDetails.details_of_building_open_area || "",
      details_of_building_other_details: surveyDetails.details_of_building_other_details || "",
      details_of_building_internal_dim_all_room: surveyDetails.details_of_building_internal_dim_all_room || "",
      details_of_building_internal_dim_all_balcony: surveyDetails.details_of_building_internal_dim_all_balcony || "",
      details_of_building_internal_dim_all_garages: surveyDetails.details_of_building_internal_dim_all_garages || "",
      details_of_building_carpet_area: surveyDetails.details_of_building_carpet_area || "",
      details_of_location_a_is_located: surveyDetails.details_of_location_a_is_located || "",
      details_of_location_b_nature: surveyDetails.details_of_location_b_nature || "",
      is_occupied_by: surveyDetails.is_occupied_by || "",
      year_of_construction: surveyDetails.year_of_construction || "",
      udf3: surveyDetails?.udf3 || ""
    });
  }, [])

  const calculatedCarpetArea = useMemo(() => {
    const [balconyDim, garagesDim, internalDimen] = getValues([
      "details_of_building_internal_dim_all_balcony",
      "details_of_building_internal_dim_all_garages",
      "details_of_building_internal_dim_all_room"
    ]);

    const floatBalcony = parseFloat(balconyDim) || 0;
    const floatGarage = parseFloat(garagesDim) || 0;
    const floatInternal = parseFloat(internalDimen) || 0;

    if (floatBalcony > 0 && floatGarage > 0 && floatInternal > 0) {
      const aValue = floatInternal + (floatBalcony / 2) + (floatGarage / 4);
      const bValue = floatInternal * 0.8;
      return [
        `A + 1/2B + 1/4C = ${aValue.toFixed(2)}`,
        `80% of Covered area Ax80% = ${bValue.toFixed(2)}`
      ];
    } else {
      return [
        "A + 1/2B + 1/4C = 0",
        "80% of Covered area Ax80% = 0"
      ];
    }
  }, [
    watch("details_of_building_internal_dim_all_balcony"),
    watch("details_of_building_internal_dim_all_garages"),
    watch("details_of_building_internal_dim_all_room")
  ]);

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
                    <Select defaultValue={surveyDetails.ward?.name || ""} isInvalid={!!errors.ward_name} onValueChange={(data) => {setValue("ward_name", data);console.log(data)}}>
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

              <VStack>
                <Text size="sm" className="mb-1" bold>Select Property Type *</Text>
                <Controller
                  name='udf3'
                  control={control}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <Select isInvalid={!!errors.udf3} selectedValue={value} onValueChange={(data) => setValue("udf3", data)}>
                      <SelectTrigger variant="outline" className='rounded-2xl' size="md" >
                        <SelectInput className='text-sm font-bold' placeholder="Select property type" />
                        <SelectIcon className="mr-3" as={ChevronDownIcon} />
                      </SelectTrigger>
                      <SelectPortal>
                        <SelectBackdrop />
                        <SelectContent>
                          <SelectDragIndicatorWrapper>
                            <SelectDragIndicator />
                          </SelectDragIndicatorWrapper>
                          <SelectItem label={"Residential"} value={"Residential"} />
                          <SelectItem label={"Non-Residential"} value={"Non-Residential"} />
                          <SelectItem label={"Commercial"} value={"Commercial"} />
                        </SelectContent>
                      </SelectPortal>
                    </Select>
                  )}
                />
                {errors.udf3 && <Text className="pl-2 text-red-500" size="xs">{errors?.udf3?.message}</Text>}
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
              <VStack>
                <Text size="sm" className="mb-1" bold>Building carpet area *</Text>
                <Controller
                  name='details_of_building_carpet_area'
                  control={control}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <Select selectedValue={value} isInvalid={!!errors.details_of_building_carpet_area} onValueChange={(data) => setValue("details_of_building_carpet_area", data)}>
                      <SelectTrigger variant="outline" className='rounded-2xl' size="md" >
                        <SelectInput className='text-sm font-bold' placeholder="Select Carpet area" />
                        <SelectIcon className="mr-3" as={ChevronDownIcon} />
                      </SelectTrigger>
                      <SelectPortal>
                        <SelectBackdrop />
                        <SelectContent>
                          <SelectDragIndicatorWrapper>
                            <SelectDragIndicator />
                          </SelectDragIndicatorWrapper>
                          {calculatedCarpetArea.map((item) => (
                            <SelectItem key={item} label={item} value={item} />
                          ))}
                        </SelectContent>
                      </SelectPortal>
                    </Select>
                  )}
                />
                {errors.details_of_building_carpet_area && <Text className="pl-2 text-red-500" size="xs">{errors?.details_of_building_carpet_area?.message}</Text>}
              </VStack>
              <VStack className='w-96'>
                <Text size="sm" className="mb-1" bold>Building or Land is located *</Text>
                <Controller
                  name='details_of_location_a_is_located'
                  control={control}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <Select selectedValue={value} isInvalid={!!errors.details_of_location_a_is_located} onValueChange={(data) => setValue("details_of_location_a_is_located", data)}>
                      <SelectTrigger variant="outline" className='rounded-2xl' size="md" >
                        <SelectInput className='text-sm font-bold' placeholder="Select Building or Land is located" />
                        <SelectIcon className="mr-3" as={ChevronDownIcon} />
                      </SelectTrigger>
                      <SelectPortal>
                        <SelectBackdrop />
                        <SelectContent>
                          <SelectDragIndicatorWrapper>
                            <SelectDragIndicator />
                          </SelectDragIndicatorWrapper>
                          {["On road having a width of more than 24 meters",
                            "On road having a width of more than 12 meters and upto 24 meters",
                            "On road having a width of more than 9 meters and upto 12 meters",
                            "On road having a width upto 9 meters"
                          ].map((item) => (
                            <SelectItem key={item} label={item} value={item} />
                          ))}
                        </SelectContent>
                      </SelectPortal>
                    </Select>
                  )}
                />
                {errors.details_of_location_a_is_located && <Text className="pl-2 text-red-500" size="xs">{errors?.details_of_location_a_is_located?.message}</Text>}
              </VStack>
              <VStack className='w-96'>
                <Text size="sm" className="mb-1" bold>Nature of Construction of Building *</Text>
                <Controller
                  name='details_of_location_b_nature'
                  control={control}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <Select selectedValue={value} isInvalid={!!errors.details_of_location_b_nature} onValueChange={(data) => setValue("details_of_location_b_nature", data)}>
                      <SelectTrigger variant="outline" className='rounded-2xl' size="md" >
                        <SelectInput className='text-sm font-bold' placeholder="Select Nature of Construction of Building" />
                        <SelectIcon className="mr-3" as={ChevronDownIcon} />
                      </SelectTrigger>
                      <SelectPortal>
                        <SelectBackdrop />
                        <SelectContent>
                          <SelectDragIndicatorWrapper>
                            <SelectDragIndicator />
                          </SelectDragIndicatorWrapper>
                          {["Pakka building with R.C.C roof or R.B roof",
                            "Other pakka building",
                            "Kaccha building that is all other building not covered in (i) & (ii)",
                          ].map((item) => (
                            <SelectItem key={item} label={item} value={item} />
                          ))}
                        </SelectContent>
                      </SelectPortal>
                    </Select>
                  )}
                />
                {errors.details_of_location_b_nature && <Text className="pl-2 text-red-500" size="xs">{errors?.details_of_location_b_nature?.message}</Text>}
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
                {isLoading && <ButtonSpinner size={30} color={'black'} />}<ButtonText className='text-center'>Update</ButtonText></Button>
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

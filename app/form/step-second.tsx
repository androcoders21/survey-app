import { Box } from '@/components/ui/box'
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { ChevronDownIcon, Icon } from '@/components/ui/icon'
import { Input, InputField } from '@/components/ui/input'
import { Select, SelectBackdrop, SelectContent, SelectDragIndicator, SelectDragIndicatorWrapper, SelectIcon, SelectInput, SelectItem, SelectPortal, SelectTrigger } from '@/components/ui/select'
import { Text } from '@/components/ui/text'
import { VStack } from '@/components/ui/vstack'
import { useFetchBuildingOccupiedByQuery, useFetchFloorTypeQuery, useFetchLandLocatedQuery, useFetchNatureOfConstructionQuery, useFetchPropertyQuery } from '@/redux/api/end-points/property-type'
import { useUpdateSurveyMutation } from '@/redux/api/end-points/survey'
import { useAppSelector } from '@/utils/hooks'
import { BuildingNatureType, FloorDataType, FloorType, FloorTypeType, LandLocatedType, OccupiedType, PropertyType } from '@/utils/types'
import { surveyStepTwoSchema, SurveyStepTwoType } from '@/utils/validation-schema'
import { Ionicons } from '@expo/vector-icons'
import { zodResolver } from '@hookform/resolvers/zod'
import { router, Stack, useLocalSearchParams } from 'expo-router'
import React, { useEffect, useMemo } from 'react'
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form'
import { Dimensions, KeyboardAvoidingView, Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, ToastAndroid } from 'react-native'

const formFields = {
    year_of_construction: "Year of construction",
}

const SecondStep = () => {
    const surveyDetails = useAppSelector(state => state.survey);
    const [updateSurvey, { isLoading }] = useUpdateSurveyMutation();
    const { data: landLocatedData, isLoading: isLandFetching } = useFetchLandLocatedQuery();
    const { data: floorData } = useFetchFloorTypeQuery();
    const { data: natureData } = useFetchNatureOfConstructionQuery();
    const { data: occupiedData } = useFetchBuildingOccupiedByQuery();
    const { data: propertyTypeData } = useFetchPropertyQuery();
    const params = useLocalSearchParams();
    const userId = useAppSelector(state => state.user.userId)
    const { control, handleSubmit, formState: { errors }, reset, setValue, watch, getValues } = useForm<SurveyStepTwoType>({
        resolver: zodResolver(surveyStepTwoSchema),
        defaultValues: {
            floor: [{
                floor_type: "",
                property_type: "",
                property_occupied_by: "",
                covered_area: "",
                open_area: "",
                other_area: "",
                all_room: "",
                all_balcony: "",
                all_garages: ""
            }]
        }
    })
    const { fields, append, remove, replace } = useFieldArray({
        control,
        name: "floor"
    })

    console.log("ERRORS", errors);

    const floorValues = useWatch({ control, name: "floor" });

    useEffect(() => {
        console.log("PARAMS", params);
        if (params.isEdit) {
            console.log("In Edit", params.formId);
            const mappedFloors: FloorType[] = (surveyDetails.floors || []).map((floor: FloorDataType) => ({
                floor_type: floor.floor_type.id.toString(),
                property_type: floor.property_type.id.toString(),
                property_occupied_by: floor.property_occupied_by.toString(),
                covered_area: floor.covered_area,
                open_area: floor.open_area,
                other_area: floor.other_area,
                all_room: floor.all_room,
                all_balcony: floor.all_balcony,
                all_garages: floor.all_garages
            }));
            reset({
                details_of_building_carpet_area: surveyDetails.details_of_building_carpet_area || "",
                details_of_location_a_is_located: surveyDetails.details_of_location_a_is_located || "",
                details_of_location_b_nature: surveyDetails.details_of_location_b_nature || "",
                year_of_construction: surveyDetails.year_of_construction || "",
            });
            replace(mappedFloors);
        }
    }, [params.isEdit])


    const onSubmit = async (data: SurveyStepTwoType) => {
        console.log("Clicked");
        try {
            //   formData.append("user_id", userId);
            const formData = { ...data, user_id: userId };
            const response = await updateSurvey({ data: formData, id: params.formId.toString() }).unwrap();
            console.log(response);
            ToastAndroid.show("Survey updated successfully", ToastAndroid.SHORT);
            reset();
            router.navigate({ pathname: '/form/step-third', params: { formId: params.formId,isEdit:params?.isEdit || "" } });
        } catch (error: any) {
            console.log(error);
            if (error && typeof error?.data?.error === "string") {
                ToastAndroid.show(error?.data?.error, ToastAndroid.SHORT);
            } else {
                ToastAndroid.show("Unable to update survey", ToastAndroid.SHORT);
            }
        }
    }

    const handleFloorAdd = () => {
        append({
            property_type: "",
            property_occupied_by: "",
            floor_type: "",
            covered_area: "",
            open_area: "",
            other_area: "",
            all_room: "",
            all_balcony: "",
            all_garages: ""
        });
    }

    const calculatedCarpetArea = useMemo(() => {
        const roomDimension = floorValues?.reduce((acc, item) => acc + parseFloat(item.all_room), 0);
        const balconyDimension = floorValues?.reduce((acc, item) => acc + parseFloat(item.all_balcony), 0);
        const garageDimension = floorValues?.reduce((acc, item) => acc + parseFloat(item.all_garages), 0);


        if (balconyDimension >= 0 && garageDimension >= 0 && roomDimension >= 0) {
            const aValue = roomDimension + (balconyDimension / 2) + (garageDimension / 4);
            const bValue = roomDimension * 0.8;
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
        floorValues
    ]);

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <Box className='bg-white w-full py-4 border-gray-300 border-b'>
                <Heading size='2xl'></Heading>
                <Heading className='text-center' size='xl'>Details of building or land</Heading>
            </Box>
            <ScrollView>
                <Box className='p-4'>
                    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? 'padding' : undefined}  >
                        <VStack space="lg" className='w-full'>
                            <Box>
                                {fields.map((item, index) => (
                                    <Box key={item.id} className='bg-gray-300 w-full p-3 mb-2 rounded-xl'>
                                        <Text size='lg' className='text-center text-dark relative'>Details of Floor in(sq/m)</Text>
                                        {index !== 0 && <Box className='absolute top-2 right-2'>
                                            <Pressable onPress={() => remove(index)}>
                                                <Icon as={() => <Ionicons name="close-circle-outline" size={24} color="red" />} />
                                            </Pressable>
                                        </Box>}
                                        <VStack className='bg-white px-3 py-3 my-2 rounded-2xl'>
                                            <Text>Floor</Text>
                                            <Controller
                                                name={`floor.${index}.floor_type`}
                                                control={control}
                                                render={({ field: { onChange, value }, fieldState: { error } }) => (
                                                    <Select defaultValue={params.isEdit ? surveyDetails.floors?.[index]?.floor_type?.name : ""} isInvalid={!!errors.floor?.[index]?.floor_type} onValueChange={(data) => setValue(`floor.${index}.floor_type`, data)}>
                                                        <SelectTrigger variant="outline" className='rounded-2xl' size="md" >
                                                            <SelectInput className='text-sm font-bold' placeholder="Select Floor" />
                                                            <SelectIcon className="mr-3" as={ChevronDownIcon} />
                                                        </SelectTrigger>
                                                        <SelectPortal>
                                                            <SelectBackdrop />
                                                            <SelectContent>
                                                                <SelectDragIndicatorWrapper>
                                                                    <SelectDragIndicator />
                                                                </SelectDragIndicatorWrapper>
                                                                <ScrollView style={{ width: Dimensions.get('window').width, height: 300 }}>
                                                                    {floorData?.map((floorItem: FloorTypeType) => (
                                                                        <SelectItem key={floorItem?.id} label={floorItem?.name} value={floorItem.id.toString()} />
                                                                    ))}
                                                                </ScrollView>
                                                            </SelectContent>
                                                        </SelectPortal>
                                                    </Select>
                                                )}
                                            />
                                            {errors?.floor && errors?.floor[index]?.floor_type && <Text className="pl-2 text-red-500" size="xs">{errors?.floor[index]?.floor_type?.message || "Required"}</Text>}
                                        </VStack>
                                        <VStack className='bg-white px-3 py-3 my-2 rounded-2xl'>
                                            <Text>Property Type</Text>
                                            <Controller
                                                name={`floor.${index}.property_type`}
                                                control={control}
                                                render={({ field: { onChange, value }, fieldState: { error } }) => (
                                                    <Select defaultValue={params.isEdit ? surveyDetails.floors?.[index]?.property_type?.type_name : ""} isInvalid={!!errors.floor?.[index]?.property_type} onValueChange={(data) => setValue(`floor.${index}.property_type`, data)}>
                                                        <SelectTrigger variant="outline" className='rounded-2xl' size="md" >
                                                            <SelectInput className='text-sm font-bold' placeholder="Select Property Type" />
                                                            <SelectIcon className="mr-3" as={ChevronDownIcon} />
                                                        </SelectTrigger>
                                                        <SelectPortal>
                                                            <SelectBackdrop />
                                                            <SelectContent>
                                                                <SelectDragIndicatorWrapper>
                                                                    <SelectDragIndicator />
                                                                </SelectDragIndicatorWrapper>
                                                                <ScrollView style={{ width: Dimensions.get('window').width, height: 300 }}>
                                                                    {propertyTypeData?.map((floorItem: PropertyType) => (
                                                                        <SelectItem key={floorItem?.id} label={floorItem?.type_name} value={floorItem.id.toString()} />
                                                                    ))}
                                                                </ScrollView>
                                                            </SelectContent>
                                                        </SelectPortal>
                                                    </Select>
                                                )}
                                            />
                                            {errors?.floor && errors?.floor[index]?.property_type && <Text className="pl-2 text-red-500" size="xs">{errors?.floor[index]?.property_type?.message || "Required"}</Text>}
                                        </VStack>
                                        <VStack className='bg-white px-3 py-3 my-2 rounded-2xl'>
                                            <Text>Building is occupied by the owner or on the rent</Text>
                                            <Controller
                                                name={`floor.${index}.property_occupied_by`}
                                                control={control}
                                                render={({ field: { onChange, value }, fieldState: { error } }) => (
                                                    <Select defaultValue={params.isEdit ? surveyDetails.floors?.[index]?.occupied_by?.name : ""} isInvalid={!!errors.floor?.[index]?.property_occupied_by} onValueChange={(data) => setValue(`floor.${index}.property_occupied_by`, data)}>
                                                        <SelectTrigger variant="outline" className='rounded-2xl' size="md" >
                                                            <SelectInput className='text-sm font-bold' placeholder="Select Occupied By" />
                                                            <SelectIcon className="mr-3" as={ChevronDownIcon} />
                                                        </SelectTrigger>
                                                        <SelectPortal>
                                                            <SelectBackdrop />
                                                            <SelectContent>
                                                                <SelectDragIndicatorWrapper>
                                                                    <SelectDragIndicator />
                                                                </SelectDragIndicatorWrapper>
                                                                <ScrollView style={{ width: Dimensions.get('window').width, height: 300 }}>
                                                                    {occupiedData?.map((occupied: OccupiedType) => (
                                                                        <SelectItem key={occupied?.id} label={occupied?.name} value={occupied.id.toString()} />
                                                                    ))}
                                                                </ScrollView>
                                                            </SelectContent>
                                                        </SelectPortal>
                                                    </Select>
                                                )}
                                            />
                                            {errors?.floor && errors?.floor[index]?.property_occupied_by && <Text className="pl-2 text-red-500" size="xs">{errors?.floor[index]?.property_occupied_by?.message || "Required"}</Text>}
                                        </VStack>
                                        <Box className=' bg-white px-1 py-3 my-2 rounded-2xl'>
                                            <Box className='flex flex-row justify-between'>
                                                <Box className='w-1/2 px-2'>
                                                    <Text>Covered Area</Text>
                                                    <Controller
                                                        name={`floor.${index}.covered_area`}
                                                        control={control}
                                                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                                                            <Input variant="outline" className="rounded-2xl" size="lg" isDisabled={false} isInvalid={errors?.floor && !!errors?.floor[index]?.covered_area} isReadOnly={false} >
                                                                <InputField
                                                                    className="text-sm font-bold"
                                                                    onChange={(e) => setValue(`floor.${index}.covered_area`, e.nativeEvent.text)}
                                                                    value={value as string}
                                                                    placeholder={`Covered Area`}
                                                                />
                                                            </Input>
                                                        )}
                                                    />
                                                    {errors?.floor && errors?.floor?.[index]?.covered_area && <Text className="pl-2 text-red-500" size="xs">{errors?.floor?.[index]?.covered_area?.message}</Text>}
                                                </Box>
                                                <Box className='w-1/2 px-2'>
                                                    <Text>Open Area</Text>
                                                    <Controller
                                                        name={`floor.${index}.open_area`}
                                                        control={control}
                                                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                                                            <Input variant="outline" className="rounded-2xl" size="lg" isDisabled={false} isInvalid={errors?.floor && !!errors?.floor[index]?.open_area} isReadOnly={false} >
                                                                <InputField
                                                                    className="text-sm font-bold"
                                                                    onChange={(e) => setValue(`floor.${index}.open_area`, e.nativeEvent.text)}
                                                                    value={value}
                                                                    placeholder={`Open Area`}
                                                                />
                                                            </Input>
                                                        )}
                                                    />
                                                    {errors?.floor && errors?.floor?.[index]?.open_area && <Text className="pl-2 text-red-500" size="xs">{errors?.floor?.[index]?.open_area?.message}</Text>}
                                                </Box>
                                            </Box>
                                            <Box className='px-2 py-2'>
                                                <Text>Other Area</Text>
                                                <Controller
                                                    name={`floor.${index}.other_area`}
                                                    control={control}
                                                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                                                        <Input variant="outline" className="rounded-2xl" size="lg" isDisabled={false} isInvalid={errors?.floor && !!errors?.floor[index]?.other_area} isReadOnly={false} >
                                                            <InputField
                                                                className="text-sm font-bold"
                                                                onChange={(e) => setValue(`floor.${index}.other_area`, e.nativeEvent.text)}
                                                                value={value}
                                                                placeholder={`Other Area`}
                                                            />
                                                        </Input>
                                                    )}
                                                />
                                                {errors?.floor && errors?.floor?.[index]?.other_area && <Text className="pl-2 text-red-500" size="xs">{errors?.floor?.[index]?.other_area?.message}</Text>}
                                            </Box>
                                        </Box>

                                        <Text bold className='mt-2'>Internal Dimension in (sq/m)</Text>
                                        <Box className=' bg-white px-1 py-3 my-2 rounded-2xl'>
                                            <Box className='flex flex-row justify-between'>
                                                <Box className='w-1/2 px-2'>
                                                    <Text>All Room</Text>
                                                    <Controller
                                                        name={`floor.${index}.all_room`}
                                                        control={control}
                                                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                                                            <Input variant="outline" className="rounded-2xl" size="lg" isDisabled={false} isInvalid={errors?.floor && !!errors?.floor[index]?.all_room} isReadOnly={false} >
                                                                <InputField
                                                                    className="text-sm font-bold"
                                                                    onChange={(e) => setValue(`floor.${index}.all_room`, e.nativeEvent.text)}
                                                                    value={value}
                                                                    placeholder={`Room Area`}
                                                                />
                                                            </Input>
                                                        )}
                                                    />
                                                    {errors?.floor && errors?.floor?.[index]?.all_room && <Text className="pl-2 text-red-500" size="xs">{errors?.floor?.[index]?.all_room?.message}</Text>}
                                                </Box>
                                                <Box className='w-1/2 px-2'>
                                                    <Text>All Balcony</Text>
                                                    <Controller
                                                        name={`floor.${index}.all_balcony`}
                                                        control={control}
                                                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                                                            <Input variant="outline" className="rounded-2xl" size="lg" isDisabled={false} isInvalid={errors?.floor && !!errors?.floor[index]?.all_balcony} isReadOnly={false} >
                                                                <InputField
                                                                    className="text-sm font-bold"
                                                                    onChange={(e) => setValue(`floor.${index}.all_balcony`, e.nativeEvent.text)}
                                                                    value={value}
                                                                    placeholder={`Balcony Area`}
                                                                />
                                                            </Input>
                                                        )}
                                                    />
                                                    {errors?.floor && errors?.floor?.[index]?.all_balcony && <Text className="pl-2 text-red-500" size="xs">{errors?.floor?.[index]?.all_balcony?.message}</Text>}
                                                </Box>
                                            </Box>
                                            <Box className='px-2 py-2'>
                                                <Text>All Garages</Text>
                                                <Controller
                                                    name={`floor.${index}.all_garages`}
                                                    control={control}
                                                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                                                        <Input variant="outline" className="rounded-2xl" size="lg" isDisabled={false} isInvalid={errors?.floor && !!errors?.floor[index]?.all_garages} isReadOnly={false} >
                                                            <InputField
                                                                className="text-sm font-bold"
                                                                onChange={(e) => setValue(`floor.${index}.all_garages`, e.nativeEvent.text)}
                                                                value={value}
                                                                placeholder={`Covered Area`}
                                                            />
                                                        </Input>
                                                    )}
                                                />
                                                {errors?.floor && errors?.floor?.[index]?.all_garages && <Text className="pl-2 text-red-500" size="xs">{errors?.floor?.[index]?.all_garages?.message}</Text>}
                                            </Box>
                                        </Box>
                                    </Box>
                                ))}
                                {errors?.floor && <Text className="pl-2 text-red-500" size="xs">{errors?.floor?.root?.message}</Text>}
                                <Box className='flex flex-row justify-end w-full'>
                                    <Button onPress={handleFloorAdd} size="sm" className='w-26 bg-blue-900 active:bg-blue-950 focus:bg-blue-950' variant="solid">
                                        <ButtonText>Add More Floor</ButtonText>
                                    </Button>
                                </Box>
                            </Box>
                            {/* End of Floor section */}
                            <VStack>
                                <Text size="sm" className="mb-1" bold>Building carpet area *</Text>
                                <Controller
                                    name='details_of_building_carpet_area'
                                    control={control}
                                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                                        <Select defaultValue={params.isEdit ? surveyDetails.details_of_building_carpet_area : ""} isInvalid={!!errors.details_of_building_carpet_area} onValueChange={(data) => setValue("details_of_building_carpet_area", data)}>
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
                                        <Select defaultValue={params.isEdit ? surveyDetails?.details_of_location_a_is_located : ""} isInvalid={!!errors.details_of_location_a_is_located} onValueChange={(data) => setValue("details_of_location_a_is_located", data)}>
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
                                                    <ScrollView style={{ width: Dimensions.get('window').width, height: 300 }}>
                                                        {landLocatedData?.map((landItem: LandLocatedType) => (
                                                            <SelectItem key={landItem.id} label={landItem?.name} value={landItem.name.toString()} />
                                                        ))}
                                                    </ScrollView>
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
                                        <Select defaultValue={params.isEdit ? surveyDetails.details_of_location_b_nature : ""} isInvalid={!!errors.details_of_location_b_nature} onValueChange={(data) => setValue("details_of_location_b_nature", data)}>
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
                                                    <ScrollView style={{ width: Dimensions.get('window').width, height: 300 }}>
                                                        {natureData?.map((natureItem: BuildingNatureType) => (
                                                            <SelectItem key={natureItem?.id} label={natureItem?.name} value={natureItem.name.toString()} />
                                                        ))}
                                                    </ScrollView>
                                                </SelectContent>
                                            </SelectPortal>
                                        </Select>
                                    )}
                                />
                                {errors.details_of_location_b_nature && <Text className="pl-2 text-red-500" size="xs">{errors?.details_of_location_b_nature?.message}</Text>}
                            </VStack>

                            {Object.entries(formFields).map(([key, heading]) => (
                                <VStack key={key}>
                                    <Text size="sm" className="mb-1" bold>{heading} *</Text>
                                    <Controller
                                        name={key as keyof SurveyStepTwoType}
                                        control={control}
                                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                                            <Input variant="outline" className="rounded-2xl" size="lg" isDisabled={false} isInvalid={!!errors[key as keyof SurveyStepTwoType]} isReadOnly={false} >
                                                <InputField
                                                    className="text-sm font-bold"
                                                    onChange={(e) => onChange(e.nativeEvent.text)}
                                                    value={value as string}
                                                    placeholder={`Enter ${heading}`}
                                                />
                                            </Input>
                                        )}
                                    />
                                    {errors[key as keyof SurveyStepTwoType] && <Text className="pl-2 text-red-500" size="xs">{errors[key as keyof SurveyStepTwoType]?.message}</Text>}
                                </VStack>
                            ))}
                        </VStack>
                        <VStack className='flex flex-row justify-center' space="lg">
                            <Button isDisabled={isLoading} onPress={handleSubmit(onSubmit)} className='h-14 w-80 mt-4 rounded-3xl'>
                                {isLoading && <ButtonSpinner size={30} color={'black'} />}<ButtonText className='text-center'>Next</ButtonText></Button>
                        </VStack>
                    </KeyboardAvoidingView>
                </Box>
            </ScrollView>
        </SafeAreaView >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 10,
    }
});

export default SecondStep
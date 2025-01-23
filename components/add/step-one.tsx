import { Box } from '@/components/ui/box'
import { HStack } from '@/components/ui/hstack';
import { ChevronDownIcon, CircleIcon } from '@/components/ui/icon';
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import { Radio, RadioGroup, RadioIcon, RadioIndicator, RadioLabel } from '@/components/ui/radio';
import { Select, SelectBackdrop, SelectContent, SelectDragIndicator, SelectDragIndicatorWrapper, SelectIcon, SelectInput, SelectItem, SelectPortal, SelectTrigger } from '@/components/ui/select';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack'
import { useFetchWardQuery } from '@/redux/api/end-points/ward';
import { WardType } from '@/utils/types';
import { CombinedSurveyType, Step1Type, SurveyType } from '@/utils/validation-schema';
import React from 'react'
import { Control, Controller, FieldErrors, UseFormGetValues, UseFormSetValue, useWatch } from 'react-hook-form';
import { Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import RNDateTimePicker, { DateTimePickerAndroid, DateTimePickerEvent } from '@react-native-community/datetimepicker';
import AntDesign from '@expo/vector-icons/AntDesign';
import MonthYearPicker from '../month-year-picker';

const formFields = {
    nagarpalikaId: "E-Nagarpalika ID",
    parcelNo: "Parcel No *",
    propertyNo: "Property No / Unit No *",
    electricityId: "Electricity ID",
    khasraNo: "Khasra No",
    registryNo: "Registry No"
};

interface StepOneProps {
    control: Control<CombinedSurveyType, any>;
    errors: FieldErrors<CombinedSurveyType>
    setValue: UseFormSetValue<CombinedSurveyType>;
}

const StepOne = ({ control, errors, setValue }: StepOneProps) => {
    const { isFetching, data: wardData, error } = useFetchWardQuery();
    const [isDatePickerVisible, setDatePickerVisibility] = React.useState(false);
    const [isSlum, constructedDate] = useWatch({ control, name: ["isSlum", "constructedDate"] });

    const handleDate = (month:string,year:number) => {
        console.log(month,year);
        setValue("constructedDate",`${month} ${year}`);
    }
    return (
        <Box className='pt-2'>
            <VStack space='xs' className='mb-3'>
                <Text size='sm' bold>ULB's Name/Code *</Text>
                <Controller
                    name='ulbNameCode'
                    control={control}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <Input variant="outline" className="rounded-2xl" size="lg" isDisabled={false} isInvalid={!!errors.ulbNameCode} isReadOnly={true}>
                            <InputField
                                className="text-sm"
                                onChange={(e) => onChange(e.nativeEvent.text)}
                                value={value as string}
                                placeholder={`Enter ULB's Name/Code`}
                            />
                        </Input>
                    )}
                />
                {errors.ulbNameCode && <Text className='text-red-500' size='xs'>{errors?.ulbNameCode?.message}</Text>}
            </VStack>

            <VStack space='xs' className='mb-3'>
                <Text size="sm" className="mb-1" bold>Select Ward *</Text>
                <Controller
                    name='wardNo'
                    control={control}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <Select isInvalid={!!errors.wardNo} defaultValue={value ? wardData?.find((item: WardType) => item.id.toString() === value)?.name : ""} onValueChange={(data) => { setValue("wardNo", data); console.log(data) }}>
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
                {errors.wardNo && <Text className="pl-2 text-red-500" size="xs">{errors?.wardNo?.message}</Text>}
            </VStack>
            {Object.entries(formFields).map(([key, heading]) => (
                <VStack space='xs' className='mb-3' key={key}>
                    <Text size='sm' bold>{heading}</Text>
                    <Controller
                        name={key as keyof Step1Type}
                        control={control}
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <Input variant="outline" className="rounded-2xl" size="lg" isDisabled={false} isInvalid={!!errors[key as keyof Step1Type]} isReadOnly={false}>
                                <InputField
                                    className="text-sm"
                                    onChange={(e) => onChange(e.nativeEvent.text)}
                                    value={value as string}
                                    placeholder={`Enter ${heading}`}
                                    returnKeyType='next'
                                />
                            </Input>
                        )}
                    />
                    {errors[key as keyof Step1Type] && <Text className='text-red-500' size='xs'>{(errors[key as keyof Step1Type] as any)?.message}</Text>}
                </VStack>
            ))}
            <VStack space='xs' className='mb-3'>
                <Text size='sm' bold>Construction Date</Text>
                {/* {isDatePickerVisible && <RNDateTimePicker display='spinner' mode='date' maximumDate={new Date()} onChange={(event: DateTimePickerEvent, date: Date|undefined)=>handleDate(event,date)} value={new Date()}
                />} */}
                <MonthYearPicker open={isDatePickerVisible} onClose={()=>setDatePickerVisibility(false)} onConfirm={handleDate}/>
                    <Input variant="outline" className="rounded-2xl" size="lg" isDisabled={false} isInvalid={!!errors.constructedDate} isReadOnly={true}>
                        <InputField
                            className="text-sm"
                            value={constructedDate}
                            placeholder={`Enter Construction Date`}
                        />
                        <InputSlot onPress={() => setDatePickerVisibility(true)} className='p-2.5 bg-gray-300' >
                            <AntDesign name="calendar" size={20} color="black" />
                        </InputSlot>
                    </Input>
                {errors.constructedDate && <Text className='text-red-500' size='xs'>{errors?.constructedDate?.message}</Text>}
            </VStack>
            <RadioGroup value={isSlum} className='mb-2' onChange={(value) => setValue("isSlum", value)}>
                <HStack space="2xl">
                    <Text className='w-3/12' size='sm' bold>Slum</Text>
                    <Radio className='w-3/12' value="yes">
                        <RadioIndicator>
                            <RadioIcon as={CircleIcon} />
                        </RadioIndicator>
                        <RadioLabel>Yes</RadioLabel>
                    </Radio>
                    <Radio className='w-3/12' value="no">
                        <RadioIndicator>
                            <RadioIcon as={CircleIcon} />
                        </RadioIndicator>
                        <RadioLabel>No</RadioLabel>
                    </Radio>
                </HStack>
            </RadioGroup>

            {isSlum === "yes" && <VStack space='xs' className='mb-3'>
                <Text size='sm' bold>Slum Id</Text>
                <Controller
                    name='slumId'
                    control={control}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <Input variant="outline" className="rounded-2xl" size="lg" isDisabled={false} isInvalid={!!errors.slumId} isReadOnly={false}>
                            <InputField
                                className="text-sm"
                                onChange={(e) => onChange(e.nativeEvent.text)}
                                value={value as string}
                                placeholder={`Enter Slum Id`}
                            />
                        </Input>
                    )}
                />
                {errors.slumId && <Text className='text-red-500' size='xs'>{errors?.slumId?.message}</Text>}
            </VStack>}
        </Box>
    )
}

export default StepOne
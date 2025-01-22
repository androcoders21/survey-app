import { Box } from '@/components/ui/box'
import { Checkbox, CheckboxIcon, CheckboxIndicator, CheckboxLabel } from '@/components/ui/checkbox';
import { HStack } from '@/components/ui/hstack';
import { CheckIcon, ChevronDownIcon, CircleIcon } from '@/components/ui/icon';
import { Input, InputField } from '@/components/ui/input';
import { Radio, RadioGroup, RadioIcon, RadioIndicator, RadioLabel } from '@/components/ui/radio';
import { Select, SelectBackdrop, SelectContent, SelectDragIndicator, SelectDragIndicatorWrapper, SelectIcon, SelectInput, SelectItem, SelectPortal, SelectTrigger } from '@/components/ui/select';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack'
import { useFetchWardQuery } from '@/redux/api/end-points/ward';
import { WardType } from '@/utils/types';
import { CombinedSurveyType, Step3Type } from '@/utils/validation-schema';
import React from 'react'
import { Control, Controller, FieldErrors, UseFormGetValues, UseFormSetValue, useWatch } from 'react-hook-form';
import { Dimensions, ScrollView } from 'react-native';

const formFields1 = {
    houseNo: "House No./Plot/Building/Apartment No. *",
    streetNoName: "Street No./Name *",
    locality: "Locality *",
    colony: "Colony *",
    city: "City *",
    pincode: "Pincode *",
};

const formFields2 = {
    presentHouseNo: "House No./Plot/Building/Apartment No. *",
    presentStreetNoName: "Street No./Name *",
    presentLocality: "Locality *",
    presentColony: "Colony *",
    presentCity: "City *",
    presentPincode: "Pincode *",
};

interface StepThreeProps {
    control: Control<CombinedSurveyType, any>;
    errors: FieldErrors<CombinedSurveyType>
    setValue: UseFormSetValue<CombinedSurveyType>;
    getValues: UseFormGetValues<CombinedSurveyType>;
}

const StepThree = ({ control, errors, setValue, getValues }: StepThreeProps) => {

    const isSameAsProperty = useWatch({
        control,
        name: 'isSameAsProperty'
    })

    const handleCheckBox = (value: boolean) => {
        if (value) {
            setValue('presentHouseNo', getValues('houseNo'))
            setValue('presentStreetNoName', getValues('streetNoName'))
            setValue('presentLocality', getValues('locality'))
            setValue('presentColony', getValues('colony'))
            setValue('presentCity', getValues('city'))
            setValue('presentPincode', getValues('pincode'))
        } else {
            setValue('presentHouseNo', '')
            setValue('presentStreetNoName', '')
            setValue('presentLocality', '')
            setValue('presentColony', '')
            setValue('presentCity', '')
            setValue('presentPincode', '')
        }
        setValue('isSameAsProperty', value)
    }
    return (
        <Box className='pt-2'>
            {Object.entries(formFields1).map(([key, heading]) => (
                <VStack space='xs' className='mb-3' key={key}>
                    <Text size='sm' bold>{heading}</Text>
                    <Controller
                        name={key as keyof Step3Type}
                        control={control}
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <Input variant="outline" className="rounded-2xl" size="lg" isDisabled={false} isInvalid={!!errors[key as keyof Step3Type]} isReadOnly={false}>
                                <InputField
                                    keyboardType={key === "pincode" ? "number-pad" : "default"}
                                    className="text-sm"
                                    onChange={(e) => onChange(e.nativeEvent.text)}
                                    value={value as string}
                                    placeholder={`Enter ${heading}`}
                                    maxLength={key === "pincode" ? 6 : undefined}
                                />
                            </Input>
                        )}
                    />
                    {errors[key as keyof Step3Type] && <Text className='text-red-500' size='xs'>{(errors[key as keyof Step3Type] as any)?.message}</Text>}
                </VStack>
            ))}
            <Checkbox value='yes' isChecked={isSameAsProperty} onChange={(value) => handleCheckBox(value)} size="md" isInvalid={false} isDisabled={false}>
                <CheckboxLabel className='text-sm font-bold my-4'>Present address: (Same as property address)</CheckboxLabel>
                <CheckboxIndicator>
                    <CheckboxIcon as={CheckIcon} />
                </CheckboxIndicator>
            </Checkbox>
            {Object.entries(formFields2).map(([key, heading]) => (
                <VStack space='xs' className='mb-3' key={key}>
                    <Text size='sm' bold>{heading}</Text>
                    <Controller
                        name={key as keyof Step3Type}
                        control={control}
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <Input variant="outline" className="rounded-2xl" size="lg" isDisabled={false} isInvalid={!!errors[key as keyof Step3Type]} isReadOnly={isSameAsProperty}>
                                <InputField
                                    className="text-sm"
                                    keyboardType={key === "presentPincode" ? "number-pad" : "default"}
                                    onChange={(e) => onChange(e.nativeEvent.text)}
                                    value={value as string}
                                    placeholder={`Enter ${heading}`}
                                    maxLength={key === "presentPincode" ? 6 : undefined}
                                />
                            </Input>
                        )}
                    />
                    {errors[key as keyof Step3Type] && <Text className='text-red-500' size='xs'>{(errors[key as keyof Step3Type] as any)?.message}</Text>}
                </VStack>
            ))}
        </Box>
    )
}

export default StepThree
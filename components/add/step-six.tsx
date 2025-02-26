import React from 'react'
import { Box } from '@/components/ui/box'
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { ChevronDownIcon, CircleIcon } from '@/components/ui/icon';
import { Input, InputField } from '@/components/ui/input';
import { Radio, RadioGroup, RadioIcon, RadioIndicator, RadioLabel } from '@/components/ui/radio';
import { Select, SelectBackdrop, SelectContent, SelectDragIndicator, SelectDragIndicatorWrapper, SelectIcon, SelectInput, SelectItem, SelectPortal, SelectTrigger } from '@/components/ui/select';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack'
import { CombinedSurveyType, Step6Type } from '@/utils/validation-schema';
import { Control, Controller, FieldErrors, useFieldArray, UseFormSetValue, useWatch } from 'react-hook-form';
import { useFetchUsageTypeQuery } from '@/redux/api/end-points/property-type';
import { UsageType } from '@/utils/types';

const formFields = {
    totalWaterConnection: "No. of Connection *",
}

interface StepSixProps {
    control: Control<CombinedSurveyType, any>;
    errors: FieldErrors<CombinedSurveyType>
    setValue: UseFormSetValue<CombinedSurveyType>;
}

const StepSix = ({ control, errors, setValue }: StepSixProps) => {
    const { data: usageTypeData } = useFetchUsageTypeQuery();
    const [isMuncipalWaterSupply, waterConnectionType, sourceOfWater, isMuncipalWasteService, toiletType,totalWaterConnection,waterConnectionId] = useWatch({ control, name: ["isMuncipalWaterSupply", "waterConnectionType", "sourceOfWater", "isMuncipalWasteService", "toiletType","totalWaterConnection","waterConnectionId"] });

    const handleId = (value: string,index:number) => {
        const temp = [...waterConnectionId];
        temp[index] = value;
        console.log(temp);
        setValue("waterConnectionId",temp);
    }
    return (
        <Box>
            <Heading className='pb-3'>Water Supply:</Heading>
            <RadioGroup className='mb-2' value={isMuncipalWaterSupply} onChange={(value) => setValue("isMuncipalWaterSupply", value)}>
                <HStack space="2xl">
                    <Text className='w-6/12' size='sm' bold>Muncipal Water Supply Connection</Text>
                    <Radio className='w-2/12' value="yes">
                        <RadioIndicator>
                            <RadioIcon as={CircleIcon} />
                        </RadioIndicator>
                        <RadioLabel>Yes</RadioLabel>
                    </Radio>
                    <Radio className='w-2/12' value="no">
                        <RadioIndicator>
                            <RadioIcon as={CircleIcon} />
                        </RadioIndicator>
                        <RadioLabel>No</RadioLabel>
                    </Radio>
                </HStack>
            </RadioGroup>

            {isMuncipalWaterSupply === "yes" && <>
                {Object.entries(formFields).map(([key, heading]) => (
                    <VStack space='xs' className='mb-3' key={key}>
                        <Text size='sm' bold>{heading}</Text>
                        <Controller
                            name={key as keyof Step6Type}
                            control={control}
                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                <Input variant="outline" className="rounded-2xl" size="lg" isDisabled={false} isInvalid={!!errors[key as keyof Step6Type]} isReadOnly={false}>
                                    <InputField
                                        className="text-sm"
                                        keyboardType={key === "totalWaterConnection" ? "number-pad" : "default"}
                                        onChange={(e) => {
                                            onChange(e.nativeEvent.text);
                                            setValue("waterConnectionId",[]);
                                        }}
                                        value={value as string}
                                        placeholder={`Enter ${heading}`}
                                    />
                                </Input>
                            )}
                        />
                        {errors[key as keyof Step6Type] && <Text className='text-red-500' size='xs'>{(errors[key as keyof Step6Type] as any)?.message}</Text>}
                    </VStack>
                ))}
                {totalWaterConnection && Array.from({ length: Number(totalWaterConnection) }).map((_, index) => (
                    <VStack space='xs' className='mb-3' key={index}>
                        <Text size='sm' bold>Enter connection ID {index + 1}</Text>

                                <Input variant="outline" className="rounded-2xl" size="lg" isDisabled={false} isInvalid={!!errors.waterConnectionId} isReadOnly={false}>
                                    <InputField
                                        className="text-sm"
                                        onChange={(e) => handleId(e.nativeEvent.text,index)}
                                        value={waterConnectionId[index]}
                                        placeholder={`Enter connection ID`}
                                    />
                                </Input>
                        {errors?.waterConnectionId && <Text className='text-red-500' size='xs'>{errors?.waterConnectionId?.message}</Text>}
                    </VStack>
                ))}
                <VStack space='xs' className='mb-3'>
                    <Text size="sm" className="mb-1" bold>Water Connection Type *</Text>
                    <Controller
                        name='waterConnectionType'
                        control={control}
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <Select defaultValue={value === "Other" ? value : value ? usageTypeData?.find((mainItem: UsageType) => mainItem.id.toString() === value)?.type_name : ""} isInvalid={!!errors.waterConnectionType} onValueChange={(data) => { setValue("waterConnectionType", data); console.log(data) }}>
                                <SelectTrigger variant="outline" className='rounded-2xl' size="md" >
                                    <SelectInput className='text-sm font-bold' placeholder="Select type of use" />
                                    <SelectIcon className="mr-3" as={ChevronDownIcon} />
                                </SelectTrigger>
                                <SelectPortal>
                                    <SelectBackdrop />
                                    <SelectContent>
                                        <SelectDragIndicatorWrapper>
                                            <SelectDragIndicator />
                                        </SelectDragIndicatorWrapper>
                                        {usageTypeData?.map((item: UsageType) => (
                                            <SelectItem key={item.id} label={item.type_name} value={item.id.toString()} />
                                        ))}
                                        <SelectItem label='Other' value='Other' />
                                    </SelectContent>
                                </SelectPortal>
                            </Select>
                        )}
                    />
                    {errors.waterConnectionType && <Text className="pl-2 text-red-500" size="xs">{errors?.waterConnectionType?.message}</Text>}
                </VStack>
                {waterConnectionType === "Other" && <VStack space='xs' className='mb-3' >
                    <Text size='sm' bold>Water Connection Type Other *</Text>
                    <Controller
                        name="waterConnectionTypeOther"
                        control={control}
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <Input variant="outline" className="rounded-2xl" size="lg" isDisabled={false} isInvalid={!!errors.waterConnectionTypeOther} isReadOnly={false}>
                                <InputField
                                    className="text-sm"
                                    onChange={(e) => onChange(e.nativeEvent.text)}
                                    value={value as string}
                                    placeholder={`Enter Other`}
                                />
                            </Input>
                        )}
                    />
                    {errors.waterConnectionTypeOther && <Text className='text-red-500' size='xs'>{errors.waterConnectionTypeOther.message}</Text>}
                </VStack>
                }
            </>}
            {isMuncipalWaterSupply === "no" && <>
                <VStack space='xs' className='mb-3'>
                    <Text size="sm" bold>Source of Water *</Text>
                    <Controller
                        name='sourceOfWater'
                        control={control}
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <Select defaultValue={value} isInvalid={!!errors.sourceOfWater} onValueChange={(data) => { setValue("sourceOfWater", data); console.log(data) }}>
                                <SelectTrigger variant="outline" className='rounded-2xl' size="md" >
                                    <SelectInput className='text-sm font-bold' placeholder="Select source of water" />
                                    <SelectIcon className="mr-3" as={ChevronDownIcon} />
                                </SelectTrigger>
                                <SelectPortal>
                                    <SelectBackdrop />
                                    <SelectContent>
                                        <SelectDragIndicatorWrapper>
                                            <SelectDragIndicator />
                                        </SelectDragIndicatorWrapper>
                                        {["Government Tap", "Dug well", "Borewell", "Other"].map((item) => (
                                            <SelectItem key={item} label={item} value={item} />
                                        ))}
                                    </SelectContent>
                                </SelectPortal>
                            </Select>
                        )}
                    />
                    {errors.sourceOfWater && <Text className="pl-2 text-red-500" size="xs">{errors?.sourceOfWater?.message}</Text>}
                </VStack>
                {sourceOfWater === "Other" && <VStack space='xs' className='mb-3' >
                    <Text size='sm' bold>Source of Water Other *</Text>
                    <Controller
                        name="sourceOfWaterOther"
                        control={control}
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <Input variant="outline" className="rounded-2xl" size="lg" isDisabled={false} isInvalid={!!errors.sourceOfWaterOther} isReadOnly={false}>
                                <InputField
                                    className="text-sm"
                                    onChange={(e) => onChange(e.nativeEvent.text)}
                                    value={value as string}
                                    placeholder={`Enter Other`}
                                />
                            </Input>
                        )}
                    />
                    {errors.sourceOfWaterOther && <Text className='text-red-500' size='xs'>{errors.sourceOfWaterOther.message}</Text>}
                </VStack>
                }
            </>}
            <Heading className='pb-3 pt-1'>Sanitation:</Heading>
            <VStack space='xs' className='mb-3'>
                <Text size="sm" bold>If you have a toilet in the house, what kind is it ? *</Text>
                <Controller
                    name='toiletType'
                    control={control}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <Select defaultValue={value} isInvalid={!!errors.toiletType} onValueChange={(data) => { setValue("toiletType", data); console.log(data) }}>
                            <SelectTrigger variant="outline" className='rounded-2xl' size="md" >
                                <SelectInput className='text-sm font-bold' placeholder="Select" />
                                <SelectIcon className="mr-3" as={ChevronDownIcon} />
                            </SelectTrigger>
                            <SelectPortal>
                                <SelectBackdrop />
                                <SelectContent>
                                    <SelectDragIndicatorWrapper>
                                        <SelectDragIndicator />
                                    </SelectDragIndicatorWrapper>
                                    {["Connected to municipal sewage system", "Connected to specific tank", "Connected to surface drains", "Pour flush pit latrine", "Dry/Bucket latrine", "No toilet","Other"].map((item) => (
                                        <SelectItem key={item} label={item} value={item} />
                                    ))}
                                </SelectContent>
                            </SelectPortal>
                        </Select>
                    )}
                />
                {errors.toiletType && <Text className="pl-2 text-red-500" size="xs">{errors?.toiletType?.message}</Text>}
            </VStack>
            {toiletType === "Other" && <VStack space='xs' className='mb-3' >
                    <Text size='sm' bold>Toilet Type Other *</Text>
                    <Controller
                        name="toiletTypeOther"
                        control={control}
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <Input variant="outline" className="rounded-2xl" size="lg" isDisabled={false} isInvalid={!!errors.toiletTypeOther} isReadOnly={false}>
                                <InputField
                                    className="text-sm"
                                    onChange={(e) => onChange(e.nativeEvent.text)}
                                    value={value as string}
                                    placeholder={`Enter Other`}
                                />
                            </Input>
                        )}
                    />
                    {errors.toiletTypeOther && <Text className='text-red-500' size='xs'>{errors.toiletTypeOther.message}</Text>}
                </VStack>}
            <Heading className='pb-3 pt-1'>Solid Waste Management:</Heading>
            <RadioGroup className='mb-2' value={isMuncipalWasteService} nativeID='isMuncipalWasteService' onChange={(value) => setValue("isMuncipalWasteService", value)}>
                <HStack space="2xl">
                    <Text className='w-6/12' size='sm' bold>Muncipal Authority Door to Door Collection</Text>
                    <Radio className='w-2/12' value="yes">
                        <RadioIndicator>
                            <RadioIcon as={CircleIcon} />
                        </RadioIndicator>
                        <RadioLabel>Yes</RadioLabel>
                    </Radio>
                    <Radio className='w-2/12' value="no">
                        <RadioIndicator>
                            <RadioIcon as={CircleIcon} />
                        </RadioIndicator>
                        <RadioLabel>No</RadioLabel>
                    </Radio>
                </HStack>
            </RadioGroup>
            {errors.isMuncipalWasteService && <Text className="pl-2 text-red-500" size="xs">{errors?.isMuncipalWasteService?.message}</Text>}
        </Box>
    )
}

export default StepSix
import React from 'react'
import { Box } from '@/components/ui/box'
import { HStack } from '@/components/ui/hstack';
import { ChevronDownIcon, CircleIcon } from '@/components/ui/icon';
import { Input, InputField } from '@/components/ui/input';
import { Radio, RadioGroup, RadioIcon, RadioIndicator, RadioLabel } from '@/components/ui/radio';
import { Select, SelectBackdrop, SelectContent, SelectDragIndicator, SelectDragIndicatorWrapper, SelectIcon, SelectInput, SelectItem, SelectPortal, SelectTrigger } from '@/components/ui/select';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack'
import { WardType } from '@/utils/types';
import { CombinedSurveyType } from '@/utils/validation-schema';
import { Control, Controller, FieldErrors, UseFormSetValue, useWatch } from 'react-hook-form';
import { Dimensions, ScrollView } from 'react-native';

const formFields = {
    nagarpalikaId: "E-Nagarpalika ID",
    parcelNo: "Parcel No",
    propertyNo: "Property No",
    electricityId: "Electricity ID",
    khasraNo: "MP Khasra No",
    registryNo: "Registry No",
    constructedDate: "Constructed Date",
};

interface StepFourProps {
    control: Control<CombinedSurveyType, any>;
    errors: FieldErrors<CombinedSurveyType>
    setValue: UseFormSetValue<CombinedSurveyType>;
}

const StepFour = ({ control, errors, setValue }: StepFourProps) => {
    const [propertyOwnership, situation, propertyUse, commercial, isExemptionApplicable, exemptionType] = useWatch({ control, name: ["propertyOwnership", "situation", "propertyUse", "commercial", "isExemptionApplicable", "exemptionType"] });
    return (
        <Box className='pt-2'>
            <VStack space='xs' className='mb-3'>
                <Text size="sm" className="mb-1" bold>Current Tax Rate *</Text>
                <Controller
                    name='taxRateZone'
                    control={control}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <Select isInvalid={!!errors.taxRateZone} onValueChange={(data) => { setValue("taxRateZone", data); console.log(data) }}>
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
                                    <ScrollView style={{ width: Dimensions.get('window').width, height: 300 }}>
                                        {[].map((ward: WardType) => (
                                            <SelectItem key={ward.id} label={ward?.name} value={ward.id.toString()} />
                                        ))}
                                    </ScrollView>
                                </SelectContent>
                            </SelectPortal>
                        </Select>
                    )}
                />
                {errors.taxRateZone && <Text className="pl-2 text-red-500" size="xs">{errors?.taxRateZone?.message}</Text>}
            </VStack>

            <VStack space='xs' className='mb-3'>
                <Text size="sm" className="mb-1" bold>Property Ownership *</Text>
                <Controller
                    name='propertyOwnership'
                    control={control}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <Select isInvalid={!!errors.propertyOwnership} onValueChange={(data) => { setValue("propertyOwnership", data) }}>
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
                                    <ScrollView style={{ width: Dimensions.get('window').width, height: 300 }}>
                                        {[].map((ward: WardType) => (
                                            <SelectItem key={ward.id} label={ward?.name} value={ward.id.toString()} />
                                        ))}
                                        <SelectItem label="Other" value="Other" />
                                    </ScrollView>
                                </SelectContent>
                            </SelectPortal>
                        </Select>
                    )}
                />
                {errors.propertyOwnership && <Text className="pl-2 text-red-500" size="xs">{errors?.propertyOwnership?.message}</Text>}
            </VStack>

            {propertyOwnership === "Other" && <VStack space='xs' className='mb-3'>
                <Text size='sm' bold>Property Ownership Other</Text>
                <Controller
                    name='propertyOwnershipOther'
                    control={control}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <Input variant="outline" className="rounded-2xl" size="lg" isDisabled={false} isInvalid={!!errors.propertyOwnershipOther} isReadOnly={false}>
                            <InputField
                                className="text-sm"
                                onChange={(e) => onChange(e.nativeEvent.text)}
                                value={value as string}
                                placeholder={`Enter property ownership other`}
                            />
                        </Input>
                    )}
                />
                {errors.propertyOwnershipOther && <Text className='text-red-500' size='xs'>{errors?.propertyOwnershipOther?.message}</Text>}
            </VStack>}

            <VStack space='xs' className='mb-3'>
                <Text size="sm" className="mb-1" bold>Situation *</Text>
                <Controller
                    name='situation'
                    control={control}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <Select isInvalid={!!errors.situation} onValueChange={(data) => { setValue("situation", data) }}>
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
                                    <ScrollView style={{ width: Dimensions.get('window').width, height: 300 }}>
                                        {[].map((ward: WardType) => (
                                            <SelectItem key={ward.id} label={ward?.name} value={ward.id.toString()} />
                                        ))}
                                        <SelectItem label="Other" value="Other" />
                                    </ScrollView>
                                </SelectContent>
                            </SelectPortal>
                        </Select>
                    )}
                />
                {errors.situation && <Text className="pl-2 text-red-500" size="xs">{errors?.situation?.message}</Text>}
            </VStack>

            {situation === "Other" && <VStack space='xs' className='mb-3'>
                <Text size='sm' bold>Situation Other</Text>
                <Controller
                    name='situationOther'
                    control={control}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <Input variant="outline" className="rounded-2xl" size="lg" isDisabled={false} isInvalid={!!errors.situationOther} isReadOnly={false}>
                            <InputField
                                className="text-sm"
                                onChange={(e) => onChange(e.nativeEvent.text)}
                                value={value as string}
                                placeholder={`Enter property situation other`}
                            />
                        </Input>
                    )}
                />
                {errors.situationOther && <Text className='text-red-500' size='xs'>{errors?.situationOther?.message}</Text>}
            </VStack>}

            <VStack space='xs' className='mb-3'>
                <Text size="sm" className="mb-1" bold>Property Use *</Text>
                <Controller
                    name='propertyUse'
                    control={control}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <Select isInvalid={!!errors.propertyUse} onValueChange={(data) => { setValue("propertyUse", data) }}>
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
                                    <ScrollView style={{ width: Dimensions.get('window').width, height: 300 }}>
                                        {[].map((ward: WardType) => (
                                            <SelectItem key={ward.id} label={ward?.name} value={ward.id.toString()} />
                                        ))}
                                        <SelectItem label="Other" value="Other" />
                                    </ScrollView>
                                </SelectContent>
                            </SelectPortal>
                        </Select>
                    )}
                />
                {errors.propertyUse && <Text className="pl-2 text-red-500" size="xs">{errors?.propertyUse?.message}</Text>}
            </VStack>

            {propertyUse === "Other" && <VStack space='xs' className='mb-3'>
                <Text size='sm' bold>Property Use Other</Text>
                <Controller
                    name='propertyOther'
                    control={control}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <Input variant="outline" className="rounded-2xl" size="lg" isDisabled={false} isInvalid={!!errors.propertyOther} isReadOnly={false}>
                            <InputField
                                className="text-sm"
                                onChange={(e) => onChange(e.nativeEvent.text)}
                                value={value as string}
                                placeholder={`Enter property use other`}
                            />
                        </Input>
                    )}
                />
                {errors.propertyOther && <Text className='text-red-500' size='xs'>{errors?.propertyOther?.message}</Text>}
            </VStack>}

            <VStack space='xs' className='mb-3'>
                <Text size="sm" className="mb-1" bold>Commercial</Text>
                <Controller
                    name='commercial'
                    control={control}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <Select isInvalid={!!errors.commercial} onValueChange={(data) => { setValue("commercial", data) }}>
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
                                    <ScrollView style={{ width: Dimensions.get('window').width, height: 300 }}>
                                        {[].map((ward: WardType) => (
                                            <SelectItem key={ward.id} label={ward?.name} value={ward.id.toString()} />
                                        ))}
                                        <SelectItem label="NA" value="NA" />
                                    </ScrollView>
                                </SelectContent>
                            </SelectPortal>
                        </Select>
                    )}
                />
                {errors.commercial && <Text className="pl-2 text-red-500" size="xs">{errors?.commercial?.message}</Text>}
            </VStack>

            {commercial === "NA" && <VStack space='xs' className='mb-3'>
                <Text size='sm' bold>Commercial Other</Text>
                <Controller
                    name='commercialOther'
                    control={control}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <Input variant="outline" className="rounded-2xl" size="lg" isDisabled={false} isInvalid={!!errors.commercialOther} isReadOnly={false}>
                            <InputField
                                className="text-sm"
                                onChange={(e) => onChange(e.nativeEvent.text)}
                                value={value as string}
                                placeholder={`Enter commercial other`}
                            />
                        </Input>
                    )}
                />
                {errors.commercialOther && <Text className='text-red-500' size='xs'>{errors?.commercialOther?.message}</Text>}
            </VStack>}


            <VStack space='xs' className='mb-3'>
                <Text size="sm" className="mb-1" bold>Year of Construction *</Text>
                <Controller
                    name='yearOfConstruction'
                    control={control}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <Select isInvalid={!!errors.yearOfConstruction} onValueChange={(data) => { setValue("yearOfConstruction", data) }}>
                            <SelectTrigger variant="outline" className='rounded-2xl' size="md" >
                                <SelectInput className='text-sm font-bold' placeholder="Select Year of Construction" />
                                <SelectIcon className="mr-3" as={ChevronDownIcon} />
                            </SelectTrigger>
                            <SelectPortal>
                                <SelectBackdrop />
                                <SelectContent>
                                    <SelectDragIndicatorWrapper>
                                        <SelectDragIndicator />
                                    </SelectDragIndicatorWrapper>
                                    <ScrollView style={{ width: Dimensions.get('window').width, height: 300 }}>
                                        {["After 1997", "Between 1900 & 1997", "Prior to 1900"].map((item) => (
                                            <SelectItem key={item} label={item} value={item} />
                                        ))}
                                    </ScrollView>
                                </SelectContent>
                            </SelectPortal>
                        </Select>
                    )}
                />
                {errors.yearOfConstruction && <Text className="pl-2 text-red-500" size="xs">{errors?.yearOfConstruction?.message}</Text>}
            </VStack>


            <RadioGroup className='mb-2' onChange={(value) => setValue("isExemptionApplicable", value)}>
                <HStack space="2xl">
                    <Text className='w-6/12' size='sm' bold>Exemption Applicable(Are you as a property owner) entitled to any Concession (section 136)</Text>
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

            {isExemptionApplicable === "yes" && <> 
            <VStack space='xs' className='mb-3'>
                <Text size="sm" className="mb-1" bold>Exemption Type *</Text>
                <Controller
                    name='exemptionType'
                    control={control}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <Select isInvalid={!!errors.exemptionType} onValueChange={(data) => { setValue("exemptionType", data) }}>
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
                                    <ScrollView style={{ width: Dimensions.get('window').width, height: 300 }}>
                                        {[].map((ward: WardType) => (
                                            <SelectItem key={ward.id} label={ward?.name} value={ward.id.toString()} />
                                        ))}
                                        <SelectItem label="Other" value="Other" />
                                    </ScrollView>
                                </SelectContent>
                            </SelectPortal>
                        </Select>
                    )}
                />
                {errors.exemptionType && <Text className="pl-2 text-red-500" size="xs">{errors?.exemptionType?.message}</Text>}
            </VStack>

                {exemptionType === "Other" && <VStack space='xs' className='mb-3'>
                    <Text size='sm' bold>Exemption Type Other</Text>
                    <Controller
                        name='exemptionTypeOther'
                        control={control}
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <Input variant="outline" className="rounded-2xl" size="lg" isDisabled={false} isInvalid={!!errors.exemptionTypeOther} isReadOnly={false}>
                                <InputField
                                    className="text-sm"
                                    onChange={(e) => onChange(e.nativeEvent.text)}
                                    value={value as string}
                                    placeholder={`Enter exemption type other`}
                                />
                            </Input>
                        )}
                    />
                    {errors.exemptionTypeOther && <Text className='text-red-500' size='xs'>{errors?.exemptionTypeOther?.message}</Text>}
                </VStack>}
            </>}
        </Box>
    )
}

export default StepFour
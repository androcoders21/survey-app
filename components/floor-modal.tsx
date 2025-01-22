import React, { useEffect } from 'react'
import { Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader } from '@/components/ui/modal';
import { Heading } from './ui/heading';
import { ChevronDownIcon, CloseIcon, Icon } from './ui/icon';
import { VStack } from './ui/vstack';
import { Text } from './ui/text';
import { Input, InputField } from './ui/input';
import { Select, SelectBackdrop, SelectContent, SelectDragIndicator, SelectDragIndicatorWrapper, SelectIcon, SelectInput, SelectItem, SelectPortal, SelectTrigger } from '@/components/ui/select';
import { Controller, UseFieldArrayAppend, useForm, useWatch } from 'react-hook-form';
import { CombinedSurveyType, floorDetailsSchema, FloorDetailsType } from '@/utils/validation-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, ButtonText } from './ui/button';
import { Dimensions, ScrollView } from 'react-native';
import { ConstructionType, FactorType, FloorTypeType, UsageType, WardType } from '@/utils/types';
import { Box } from './ui/box';
import { useFetchConstructionTypeQuery, useFetchFloorTypeQuery, useFetchUsageFactorQuery, useFetchUsageTypeQuery } from '@/redux/api/end-points/property-type';

interface FloorModalProps {
    showModal: boolean;
    closeModal: () => void;
    append: UseFieldArrayAppend<CombinedSurveyType, "floors">
}

const FloorModal = ({ showModal, closeModal, append }: FloorModalProps) => {
    const { data: floorData } = useFetchFloorTypeQuery();
    const { data: usageTypeData } = useFetchUsageTypeQuery();
    const { data: usageFactorData } = useFetchUsageFactorQuery();
    const { data: constructionTypeData } = useFetchConstructionTypeQuery();

    const { control, handleSubmit, formState: { errors }, reset, setValue } = useForm<FloorDetailsType>({
        resolver: zodResolver(floorDetailsSchema),
    });
    const [floorType, usageType, usageFactor, constructionType] = useWatch({
        control,
        name: ['floorType', 'usageType', 'usageFactor', 'constructionType']
    });
    const onSubmit = (data: FloorDetailsType) => {
        console.log(data)
        append(data);
        reset();
        closeModal();
    }

    const areaSqFt = useWatch({
        control,
        name: 'areaSqFt'
    });

    const handleClose = () => {
        reset()
        closeModal()
    }

    useEffect(() => {
        setValue('areaSqMt', (parseInt(areaSqFt || "0") * 0.092903).toFixed(4))
    }, [areaSqFt])

    return (
        <Modal
            isOpen={showModal}
            onClose={handleClose}
            size="lg"
        >
            <ModalBackdrop />
            <ModalContent className="bg-white rounded-2xl py-3 px-4">
                <ModalHeader>
                    <Heading size="lg" className="text-typography-950">
                        Area Detail
                    </Heading>
                    <ModalCloseButton>
                        <Icon
                            as={CloseIcon}
                            size="md"
                            className="stroke-background-400 group-[:hover]/modal-close-button:stroke-background-700 group-[:active]/modal-close-button:stroke-background-900 group-[:focus-visible]/modal-close-button:stroke-background-900"
                        />
                    </ModalCloseButton>
                </ModalHeader>
                <ModalBody>
                    <VStack space='xs' className='my-3'>
                        <Text size="sm" bold>Floor No *</Text>
                        <Controller
                            name='floorType'
                            control={control}
                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                <Select isInvalid={!!errors.floorType} onValueChange={(data) => { setValue("floorType", data) }}>
                                    <SelectTrigger variant="outline" className='rounded-2xl' size="md" >
                                        <SelectInput className='text-sm font-bold' placeholder="Select flooor type" />
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
                                                <SelectItem label="Other" value="Other" />
                                            </ScrollView>
                                        </SelectContent>
                                    </SelectPortal>
                                </Select>
                            )}
                        />
                        {errors.floorType && <Text className="pl-2 text-red-500" size="xs">{errors?.floorType?.message}</Text>}
                    </VStack>
                    {floorType === "Other" && <VStack space='xs' className='mb-3'>
                        <Text size="sm" className="mb-1" bold>Floor type Other *</Text>
                        <Controller
                            name='floorTypeOther'
                            control={control}
                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                <Input variant="outline" className="rounded-2xl" size="lg" isDisabled={false} isInvalid={!!errors.floorTypeOther} isReadOnly={false}>
                                    <InputField
                                        className="text-sm"
                                        onChange={(e) => onChange(e.nativeEvent.text)}
                                        value={value as string}
                                        placeholder={`Enter floor type other`}
                                    />
                                </Input>
                            )}
                        />
                        {errors.floorTypeOther && <Text className="pl-2 text-red-500" size="xs">{errors?.floorTypeOther?.message}</Text>}
                    </VStack>}
                    <VStack space='xs' className='mb-3'>
                        <Text size='sm' bold>Area *</Text>
                        <Box className='flex flex-row justify-between'>
                            <Box className='w-1/2 pr-2'>
                                <Controller
                                    name='areaSqFt'
                                    control={control}
                                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                                        <Input variant="outline" className="rounded-2xl" size="lg" isDisabled={false} isInvalid={!!errors.areaSqFt} isReadOnly={false}>
                                            <InputField
                                                className="text-sm"
                                                keyboardType='numeric'
                                                onChange={(e) => onChange(e.nativeEvent.text)}
                                                value={value as string}
                                                placeholder={`sq feet`}
                                            />
                                        </Input>
                                    )}
                                />
                                <Text className='text-slate-600' size='xs'>Unit (square feet)</Text>
                            </Box>
                            <Box className='w-1/2 pl-2'>
                                <Controller
                                    name='areaSqMt'
                                    control={control}
                                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                                        <Input variant="outline" className="rounded-2xl" size="lg" isInvalid={!!errors.areaSqMt} isReadOnly={true}>
                                            <InputField
                                                className="text-sm"
                                                keyboardType='numeric'
                                                onChange={(e) => onChange(e.nativeEvent.text)}
                                                value={value as string}
                                                placeholder={`sq meter`}
                                            />
                                        </Input>
                                    )}
                                />
                                <Text className='text-slate-600' size='xs'>Unit (square meter)</Text>
                            </Box>
                        </Box>
                        {errors.areaSqFt && <Text className='text-red-500' size='xs'>{errors?.areaSqFt?.message}</Text>}
                    </VStack>

                    <VStack space='xs' className='mb-3'>
                        <Text size="sm" bold>Usage Type *</Text>
                        <Controller
                            name='usageType'
                            control={control}
                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                <Select isInvalid={!!errors.usageType} onValueChange={(data) => { setValue("usageType", data) }}>
                                    <SelectTrigger variant="outline" className='rounded-2xl' size="md" >
                                        <SelectInput className='text-sm font-bold' placeholder="Select usage type" />
                                        <SelectIcon className="mr-3" as={ChevronDownIcon} />
                                    </SelectTrigger>
                                    <SelectPortal>
                                        <SelectBackdrop />
                                        <SelectContent>
                                            <SelectDragIndicatorWrapper>
                                                <SelectDragIndicator />
                                            </SelectDragIndicatorWrapper>
                                            <ScrollView style={{ width: Dimensions.get('window').width, height: 300 }}>
                                                {usageTypeData?.map((item: UsageType) => (
                                                    <SelectItem key={item.id} label={item.type_name} value={item.id.toString()} />
                                                ))}
                                                <SelectItem label="Other" value="Other" />
                                            </ScrollView>
                                        </SelectContent>
                                    </SelectPortal>
                                </Select>
                            )}
                        />
                        {errors.usageType && <Text className="pl-2 text-red-500" size="xs">{errors?.usageType?.message}</Text>}
                    </VStack>

                    {usageType === "Other" && <VStack space='xs' className='mb-3'>
                        <Text size="sm" className="mb-1" bold>Usage type Other *</Text>
                        <Controller
                            name='usageTypeOther'
                            control={control}
                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                <Input variant="outline" className="rounded-2xl" size="lg" isDisabled={false} isInvalid={!!errors.usageTypeOther} isReadOnly={false}>
                                    <InputField
                                        className="text-sm"
                                        onChange={(e) => onChange(e.nativeEvent.text)}
                                        value={value as string}
                                        placeholder={`Enter usage type other`}
                                    />
                                </Input>
                            )}
                        />
                        {errors.usageTypeOther && <Text className="pl-2 text-red-500" size="xs">{errors?.usageTypeOther?.message}</Text>}
                    </VStack>}

                    <VStack space='xs' className='mb-3'>
                        <Text size="sm" bold>Usage Factor *</Text>
                        <Controller
                            name='usageFactor'
                            control={control}
                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                <Select isInvalid={!!errors.usageFactor} onValueChange={(data) => { setValue("usageFactor", data) }}>
                                    <SelectTrigger variant="outline" className='rounded-2xl' size="md" >
                                        <SelectInput className='text-sm font-bold' placeholder="Select usage factor" />
                                        <SelectIcon className="mr-3" as={ChevronDownIcon} />
                                    </SelectTrigger>
                                    <SelectPortal>
                                        <SelectBackdrop />
                                        <SelectContent>
                                            <SelectDragIndicatorWrapper>
                                                <SelectDragIndicator />
                                            </SelectDragIndicatorWrapper>
                                            <ScrollView style={{ width: Dimensions.get('window').width, height: 300 }}>
                                                {usageFactorData?.map((item: FactorType) => (
                                                    <SelectItem key={item.id} label={item.name} value={item.id.toString()} />
                                                ))}
                                                <SelectItem label="Other" value="Other" />
                                            </ScrollView>
                                        </SelectContent>
                                    </SelectPortal>
                                </Select>
                            )}
                        />
                        {errors.usageFactor && <Text className="pl-2 text-red-500" size="xs">{errors?.usageFactor?.message}</Text>}
                    </VStack>

                    {usageFactor === "Other" && <VStack space='xs' className='mb-3'>
                        <Text size="sm" className="mb-1" bold>Usage Factor type Other *</Text>
                        <Controller
                            name='usageFactorOther'
                            control={control}
                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                <Input variant="outline" className="rounded-2xl" size="lg" isDisabled={false} isInvalid={!!errors.usageFactorOther} isReadOnly={false}>
                                    <InputField
                                        className="text-sm"
                                        onChange={(e) => onChange(e.nativeEvent.text)}
                                        value={value as string}
                                        placeholder={`Enter usage factor type other`}
                                    />
                                </Input>
                            )}
                        />
                        {errors.usageFactorOther && <Text className="pl-2 text-red-500" size="xs">{errors?.usageFactorOther?.message}</Text>}
                    </VStack>}

                    <VStack space='xs' className='mb-3'>
                        <Text size="sm" bold>Construction Type *</Text>
                        <Controller
                            name='constructionType'
                            control={control}
                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                <Select isInvalid={!!errors.constructionType} onValueChange={(data) => { setValue("constructionType", data) }}>
                                    <SelectTrigger variant="outline" className='rounded-2xl' size="md" >
                                        <SelectInput className='text-sm font-bold' placeholder="Select construction type" />
                                        <SelectIcon className="mr-3" as={ChevronDownIcon} />
                                    </SelectTrigger>
                                    <SelectPortal>
                                        <SelectBackdrop />
                                        <SelectContent>
                                            <SelectDragIndicatorWrapper>
                                                <SelectDragIndicator />
                                            </SelectDragIndicatorWrapper>
                                            <ScrollView style={{ width: Dimensions.get('window').width, height: 300 }}>
                                                {constructionTypeData?.map((item: ConstructionType) => (
                                                    <SelectItem key={item.id} label={item.name} value={item.id.toString()} />
                                                ))}
                                                <SelectItem label="Other" value="Other" />
                                            </ScrollView>
                                        </SelectContent>
                                    </SelectPortal>
                                </Select>
                            )}
                        />
                        {errors.constructionType && <Text className="pl-2 text-red-500" size="xs">{errors?.constructionType?.message}</Text>}
                    </VStack>

                    {constructionType === "Other" && <VStack space='xs' className='mb-3'>
                        <Text size="sm" className="mb-1" bold>Construction type Other *</Text>
                        <Controller
                            name='constructionTypeOther'
                            control={control}
                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                <Input variant="outline" className="rounded-2xl" size="lg" isDisabled={false} isInvalid={!!errors.constructionTypeOther} isReadOnly={false}>
                                    <InputField
                                        className="text-sm"
                                        onChange={(e) => onChange(e.nativeEvent.text)}
                                        value={value as string}
                                        placeholder={`Enter construction type other`}
                                    />
                                </Input>
                            )}
                        />
                        {errors.constructionTypeOther && <Text className="pl-2 text-red-500" size="xs">{errors?.constructionTypeOther?.message}</Text>}
                    </VStack>}

                </ModalBody>
                <ModalFooter>
                    <Button
                        variant="outline"
                        action="secondary"
                        onPress={handleClose}
                    >
                        <ButtonText>Cancel</ButtonText>
                    </Button>
                    <Button
                        onPress={handleSubmit(onSubmit)}
                    >
                        <ButtonText>Add</ButtonText>
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default FloorModal
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
import { FloorTypeType, WardType } from '@/utils/types';
import { Box } from './ui/box';
import { useFetchFloorTypeQuery } from '@/redux/api/end-points/property-type';

interface FloorModalProps {
    showModal: boolean;
    closeModal: () => void;
    append: UseFieldArrayAppend<CombinedSurveyType, "floors">
}

const FloorModal = ({ showModal, closeModal, append }: FloorModalProps) => {
    const { data: floorData } = useFetchFloorTypeQuery();
    const { control, handleSubmit, formState: { errors }, reset, setValue } = useForm<FloorDetailsType>({
        resolver: zodResolver(floorDetailsSchema),
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

    useEffect(() => {
            setValue('areaSqMt', (parseInt(areaSqFt || "0") * 0.092903).toFixed(4))
    }, [areaSqFt])

    return (
        <Modal
            isOpen={showModal}
            onClose={closeModal}
            size="md"
        >
            <ModalBackdrop />
            <ModalContent>
                <ModalHeader>
                    <Heading size="md" className="text-typography-950">
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
                                                {floorData?.map((floorItem: FloorTypeType) => (
                                                    <SelectItem key={floorItem?.id} label={floorItem?.name} value={floorItem.id.toString()} />
                                                ))}
                                            </ScrollView>
                                        </SelectContent>
                                    </SelectPortal>
                                </Select>
                            )}
                        />
                        {errors.floorType && <Text className="pl-2 text-red-500" size="xs">{errors?.floorType?.message}</Text>}
                    </VStack>
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
                                                {["Residential", "Commercial", "Industrial"].map((item) => (
                                                    <SelectItem key={item} label={item} value={item} />
                                                ))}
                                            </ScrollView>
                                        </SelectContent>
                                    </SelectPortal>
                                </Select>
                            )}
                        />
                        {errors.usageType && <Text className="pl-2 text-red-500" size="xs">{errors?.usageType?.message}</Text>}
                    </VStack>

                    <VStack space='xs' className='mb-3'>
                        <Text size="sm" bold>Usage Factor *</Text>
                        <Controller
                            name='usageFactor'
                            control={control}
                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                <Select isInvalid={!!errors.usageFactor} onValueChange={(data) => { setValue("usageFactor", data) }}>
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
                                                {["Self Occupied", "Rented"].map((item) => (
                                                    <SelectItem key={item} label={item} value={item} />
                                                ))}
                                            </ScrollView>
                                        </SelectContent>
                                    </SelectPortal>
                                </Select>
                            )}
                        />
                        {errors.usageFactor && <Text className="pl-2 text-red-500" size="xs">{errors?.usageFactor?.message}</Text>}
                    </VStack>

                    <VStack space='xs' className='mb-3'>
                        <Text size="sm" bold>Construction Type *</Text>
                        <Controller
                            name='constructionType'
                            control={control}
                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                <Select isInvalid={!!errors.constructionType} onValueChange={(data) => { setValue("constructionType", data) }}>
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
                                                {[
                                                    "आर.सी.सी, आर् या पत्थर की छत युक्त पक्के भवन",
                                                    "सीमेन्ट या लोहे की चादर की छत युक्त पक्के भवन",
                                                    "अन्य आशिंक कच्चे भवन जो उपरोक्त में नहीं आते",
                                                    "खुली भूमि"
                                                ].map((item) => (
                                                    <SelectItem key={item} label={item} value={item} />
                                                ))}
                                            </ScrollView>
                                        </SelectContent>
                                    </SelectPortal>
                                </Select>
                            )}
                        />
                        {errors.constructionType && <Text className="pl-2 text-red-500" size="xs">{errors?.constructionType?.message}</Text>}
                    </VStack>

                </ModalBody>
                <ModalFooter>
                    <Button
                        variant="outline"
                        action="secondary"
                        onPress={closeModal}
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
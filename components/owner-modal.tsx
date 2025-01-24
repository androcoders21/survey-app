import React from 'react'
import { Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader } from '@/components/ui/modal';
import { Heading } from './ui/heading';
import { CloseIcon, Icon } from './ui/icon';
import { VStack } from './ui/vstack';
import { Text } from './ui/text';
import { Input, InputField } from './ui/input';
import { Controller, UseFieldArrayAppend, useForm } from 'react-hook-form';
import { CombinedSurveyType, ownerDetailsSchema, OwnerDetailsType } from '@/utils/validation-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, ButtonText } from './ui/button';

interface OwnerModalProps {
    showModal: boolean;
    closeModal: () => void;
    append: UseFieldArrayAppend<CombinedSurveyType, "ownerDetails">
}

const ownerFields = {
    name: "Owner Name *",
    fatherName: "Father/Husband Name *",
    mobile: "Mobile No. *",
    // landline: "Landline No.",
    email: "Email",
    secondaryPhone: "Secondary Phone",
}

const OwnerModal = ({ showModal, closeModal,append }: OwnerModalProps) => {
    const { control, handleSubmit, formState: { errors }, reset, setFocus } = useForm<OwnerDetailsType>({
        resolver: zodResolver(ownerDetailsSchema),
    });
    const onSubmit = (data: OwnerDetailsType) => {
        console.log(data)
        append(data);
        reset();
        closeModal();
    }

    const handleClose = () => {
        reset();
        closeModal();
    }

    return (
        <Modal
            isOpen={showModal}
            onClose={handleClose}
            size="md"
        >
            <ModalBackdrop />
            <ModalContent>
                <ModalHeader>
                    <Heading size="md" className="text-typography-950">
                        Add Owner
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
                    {Object.entries(ownerFields).map(([key, heading]) => (
                        <VStack space='xs' className='mt-3' key={key}>
                            <Text size='sm' bold>{heading}</Text>
                            <Controller
                                name={key as keyof OwnerDetailsType}
                                control={control}
                                render={({ field: { onChange, value }, fieldState: { error } }) => (
                                    <Input variant="outline" className="rounded-2xl" size="lg" isDisabled={false} isInvalid={!!errors[key as keyof OwnerDetailsType]} isReadOnly={false}>
                                        <InputField
                                            className="text-sm"
                                            keyboardType={key === "mobile" || key === "landline" ? "phone-pad" : "default"}
                                            onChange={(e) => onChange(e.nativeEvent.text)}
                                            value={value}
                                            placeholder={`Enter ${heading}`}
                                            maxLength={key === "mobile" ? 10 : undefined}
                                            returnKeyType='next'
                                            onSubmitEditing={() => setFocus(key === "email" ? "name" : key === "landline" ? "email" : "landline")}
                                            
                                        />
                                    </Input>
                                )}
                            />
                            {errors[key as keyof OwnerDetailsType] && <Text className='text-red-500' size='xs'>{(errors[key as keyof OwnerDetailsType] as any)?.message}</Text>}
                        </VStack>
                    ))}
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

export default OwnerModal
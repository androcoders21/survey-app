import React from 'react'
import { Box } from '@/components/ui/box'
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { ChevronDownIcon, CircleIcon } from '@/components/ui/icon';
import { Input, InputField } from '@/components/ui/input';
import { Select, SelectBackdrop, SelectContent, SelectDragIndicator, SelectDragIndicatorWrapper, SelectIcon, SelectInput, SelectItem, SelectPortal, SelectTrigger } from '@/components/ui/select';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack'
import { CombinedSurveyType, Step6Type } from '@/utils/validation-schema';
import { Control, Controller, FieldErrors, UseFormSetValue, useWatch } from 'react-hook-form';
import CapturePhoto from '@/components/capture-photo';
import { Image } from 'expo-image';

const formFields = {
    totalWaterConnection: "No. of Connection",
    waterConnectionId: "Water supply connection ID",
}

interface StepSevenProps {
    control: Control<CombinedSurveyType, any>;
    errors: FieldErrors<CombinedSurveyType>
    setValue: UseFormSetValue<CombinedSurveyType>;
}

const StepSeven = ({ control, errors, setValue }: StepSevenProps) => {

    return (
        <Box>
            <Heading className='pb-3'>Property Photo:</Heading>
            <VStack space='lg' className='mb-3'>
                <CapturePhoto label='Capture first photo'/>
                <CapturePhoto label='Capture second photo'/>
            </VStack>

            <Heading className='pb-3 pt-1'>Property Location:</Heading>

            <Heading className='pb-3 pt-1'>Upload Supporting Documents:</Heading>
            <Heading className='pb-3 pt-1'>Remark</Heading>
            <Controller
                name='remark'
                control={control}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <Input variant="outline" className="rounded-2xl" size="lg" isDisabled={false} isInvalid={!!errors.remark} isReadOnly={false}>
                        <InputField
                            className="text-sm"
                            onChange={(e) => onChange(e.nativeEvent.text)}
                            value={value as string}
                            placeholder={`Enter Remark`}
                            multiline={true}
                            numberOfLines={4}
                        />
                    </Input>
                )}
            />
            <Box>
                <Image style={{flex: 1,
        height: 100,
        marginTop: 10,}} source='file:///data/user/0/host.exp.exponent/files/cd485715-d100-4888-856a-b06c3ca6f6d3.jpeg'/>
            </Box>
        </Box>
    )
}

export default StepSeven
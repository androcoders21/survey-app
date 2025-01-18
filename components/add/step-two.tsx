import OwnerModal from '@/components/owner-modal';
import { Box } from '@/components/ui/box'
import { Icon } from '@/components/ui/icon';
import { Input, InputField } from '@/components/ui/input';
import { TableBody, TableCaption, TableData, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack'
import { CombinedSurveyType, Step1Type, Step2Type, SurveyType } from '@/utils/validation-schema';
import { Table } from '@expo/html-elements';
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react'
import { Control, Controller, FieldErrors, useFieldArray, UseFormSetValue } from 'react-hook-form';
import { TouchableOpacity } from 'react-native';
import CapturePhoto from '../capture-photo';

const formFields = {
    respondentName: "Name of the Respondent *",
    respondentRelationship: "Relationship with Owner *",
    ownerAadhaarNumber: "Owner Aadhaar Number",
};

interface StepTwoProps {
    control: Control<CombinedSurveyType, any>;
    errors: FieldErrors<CombinedSurveyType>
    setValue: UseFormSetValue<CombinedSurveyType>;
}

interface OwnerDetails {
    name: string,
    fatherName: string,
    mobile: string,
    landline: string,
    email: string,
}

const StepTwo = ({ control, errors, setValue }: StepTwoProps) => {
    const [showModal, setShowModal] = React.useState(false);
    const { fields, append, remove, replace } = useFieldArray({
        control,
        name: "ownerDetails",
    });

    const handleLongPress = (index: number) => {
        remove(index);
    }

    return (
        <Box className='pt-2'>
            {Object.entries(formFields).map(([key, heading]) => (
                <VStack space='xs' className='mb-3' key={key}>
                    <Text size='sm' bold>{heading}</Text>
                    <Controller
                        name={key as keyof Step2Type}
                        control={control}
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <Input variant="outline" className="rounded-2xl" size="lg" isDisabled={false} isInvalid={!!errors[key as keyof Step2Type]} isReadOnly={false}>
                                <InputField
                                    className="text-sm"
                                    onChange={(e) => onChange(e.nativeEvent.text)}
                                    value={value as string}
                                    placeholder={`Enter ${heading}`}
                                    multiline={key === "remarks"}
                                />
                            </Input>
                        )}
                    />
                    {errors[key as keyof Step2Type] && <Text className='text-red-500' size='xs'>{(errors[key as keyof Step2Type] as any)?.message}</Text>}
                </VStack>
            ))}
            <Box className='mb-5 mt-2'>
                    <CapturePhoto handleImage={(value)=>setValue("aadhaarPhoto",value)} label='Capture Aadhar photo'/>
                    {errors.aadhaarPhoto && <Text className='text-red-500' size='xs'>{errors?.aadhaarPhoto?.message}</Text>}
                </Box>

            <Box className="rounded-lg overflow-hidden border border-slate-300 w-full">
                <Table className="w-full">
                    <TableHeader>
                        <TableRow className='bg-slate-100 py-1'>
                            <TableHead className='text-sm p-0 text-center align-middle'>Name</TableHead>
                            <TableHead className='text-sm p-0 text-center align-middle'>Father/Husband Name</TableHead>
                            <TableHead className='text-sm p-0 text-center align-middle'>Mobile No.</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {fields.map((item,index) => (
                            <TouchableOpacity key={item.id} activeOpacity={0.7} onPress={() => console.log('clicked')} onLongPress={() => handleLongPress(index)}>
                                <TableRow className='py-1'>
                                    <TableData className='text-sm p-0 text-center align-middle'>{item.name}</TableData>
                                    <TableData className='text-sm p-0 text-center align-middle'>{item.fatherName}</TableData>
                                    <TableData className='text-sm p-0 text-center align-middle'>{item.mobile}</TableData>
                                </TableRow>
                            </TouchableOpacity>
                        ))}
                    </TableBody>
                    {errors.ownerDetails && <TableCaption className='p-1 text-center align-middle'>
                        <Text size='xs' className='text-red-500' bold>Please add atleast one owner</Text>
                    </TableCaption>}
                </Table>
            </Box>
            <Box className='flex flex-row justify-between items-center mt-2'>
                <Text size='sm' className='text-gray-500 w-11/12'>Note: Long press on a row to delete the row</Text>
                <TouchableOpacity className='w-1/12' onPress={() => setShowModal(true)}>
                    <Icon as={() => <MaterialIcons name="add-circle-outline" size={24} color="black" />} size="md" />
                </TouchableOpacity>
            </Box>
            <OwnerModal showModal={showModal} closeModal={()=>setShowModal(false)} append={append}/>
        </Box>
    )
}

export default StepTwo
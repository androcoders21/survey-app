import OwnerModal from '@/components/owner-modal';
import { Box } from '@/components/ui/box'
import { ChevronDownIcon, Icon } from '@/components/ui/icon';
import { Input, InputField } from '@/components/ui/input';
import { Table,TableBody, TableCaption, TableData, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack'
import { CombinedSurveyType, Step1Type, Step2Type, SurveyType } from '@/utils/validation-schema';
import { MaterialIcons } from '@expo/vector-icons';
import { Select, SelectBackdrop, SelectContent, SelectDragIndicator, SelectDragIndicatorWrapper, SelectIcon, SelectInput, SelectItem, SelectPortal, SelectTrigger } from '@/components/ui/select';
import React from 'react'
import { Control, Controller, FieldErrors, useFieldArray, UseFormSetValue, useWatch } from 'react-hook-form';
import { ScrollView, TouchableOpacity } from 'react-native';
import CapturePhoto from '../capture-photo';

const formFields = {
    respondentName: "Name of the Respondent *",
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
    const [respondentRelationship,aadhaarPhoto] = useWatch({control:control,name:['respondentRelationship','aadhaarPhoto']});

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
            <VStack space='xs' className='mb-3'>
                <Text size="sm" bold>Relationship with Owner *</Text>
                <Controller
                    name='respondentRelationship'
                    control={control}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <Select isInvalid={!!errors.respondentRelationship} defaultValue={value} onValueChange={(data) => { setValue("respondentRelationship", data); console.log(data) }}>
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
                                    {["Self", "Daughter", "Son", "Brother", "Wife", "Mother","Father","Other"].map((item) => (
                                        <SelectItem key={item} label={item} value={item} />
                                    ))}
                                </SelectContent>
                            </SelectPortal>
                        </Select>
                    )}
                />
                {errors.respondentRelationship && <Text className="pl-2 text-red-500" size="xs">{errors?.respondentRelationship?.message}</Text>}
            </VStack>
            {respondentRelationship === "Other" && <VStack space='xs' className='mb-3'>
                    <Text size='sm' bold>Other *</Text>
                    <Controller
                        name={'respondentRelationshipOther'}
                        control={control}
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <Input variant="outline" className="rounded-2xl" size="lg" isDisabled={false} isInvalid={!!errors.respondentRelationshipOther} isReadOnly={false}>
                                <InputField
                                    className="text-sm"
                                    onChange={(e) => onChange(e.nativeEvent.text)}
                                    value={value}
                                    placeholder={`Enter Realtionship with owner`}
                                />
                            </Input>
                        )}
                    />
                    {errors.respondentRelationshipOther && <Text className='text-red-500' size='xs'>{errors?.respondentRelationshipOther?.message}</Text>}
                </VStack>}
            <VStack space='xs' className='mb-3'>
                    <Text size='sm' bold>Owner Aadhaar Number</Text>
                    <Controller
                        name={'ownerAadhaarNumber'}
                        control={control}
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <Input variant="outline" className="rounded-2xl" size="lg" isDisabled={false} isInvalid={!!errors.ownerAadhaarNumber} isReadOnly={false}>
                                <InputField
                                    className="text-sm"
                                    onChange={(e) => onChange(e.nativeEvent.text)}
                                    value={value}
                                    placeholder={`Enter owner aadhaar number`}
                                />
                            </Input>
                        )}
                    />
                    {errors.ownerAadhaarNumber && <Text className='text-red-500' size='xs'>{errors?.ownerAadhaarNumber?.message}</Text>}
                </VStack>
            <Box className='mb-5 mt-2'>
                    <CapturePhoto handleImage={(value)=>setValue("aadhaarPhoto",value.uri)} label={aadhaarPhoto ? aadhaarPhoto.split('/').pop() || 'Capture Aadhar photo' : 'Capture Aadhar photo'}/>
                    {errors.aadhaarPhoto && <Text className='text-red-500' size='xs'>{errors?.aadhaarPhoto?.message}</Text>}
                </Box>

            <Box className="rounded-lg overflow-auto border border-slate-300 w-full">
            <ScrollView horizontal={true}>
                <Table className="w-full" style={{overflowX:'scroll'}}>
                    <TableHeader>
                        <TableRow className='bg-slate-100 py-1'>
                            <TableHead className='text-xs p-0 w-36 text-center align-middle'>Name</TableHead>
                            <TableHead className='text-xs p-0 w-36 text-center align-middle'>Father/Husband Name</TableHead>
                            <TableHead className='text-xs p-0 w-36 text-center align-middle'>Mobile No.</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {fields.map((item,index) => (
                            <TouchableOpacity key={item.id} activeOpacity={0.7} onPress={() => console.log('clicked')} onLongPress={() => handleLongPress(index)}>
                                <TableRow className='py-1'>
                                    <TableData className='text-sm p-0 w-36 text-center align-middle'>{item.name}</TableData>
                                    <TableData className='text-sm p-0 w-36 text-center align-middle'>{item.fatherName}</TableData>
                                    <TableData className='text-sm p-0 w-36 text-center align-middle'>{item.mobile}</TableData>

                                </TableRow>
                            </TouchableOpacity>
                        ))}
                    </TableBody>
                    {errors.ownerDetails && <TableCaption className='p-1 text-center align-middle'>
                        <Text size='xs' className='text-red-500' bold>Please add atleast one owner</Text>
                    </TableCaption>}
                </Table>
                </ScrollView>
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
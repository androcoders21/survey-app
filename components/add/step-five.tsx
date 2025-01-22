import React, { useEffect } from 'react'
import { Box } from '@/components/ui/box'
import { Icon } from '@/components/ui/icon';
import { Input, InputField } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack'
import { CombinedSurveyType } from '@/utils/validation-schema';
import { MaterialIcons } from '@expo/vector-icons';
import { Control, Controller, FieldErrors, useFieldArray, UseFormGetValues, UseFormSetValue, useWatch } from 'react-hook-form';
import { ScrollView, TouchableOpacity } from 'react-native';
import { Table, TableBody, TableCaption, TableData, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import FloorModal from '@/components/floor-modal';
import { useFetchConstructionTypeQuery, useFetchFloorTypeQuery, useFetchUsageFactorQuery, useFetchUsageTypeQuery } from '@/redux/api/end-points/property-type';
import { ConstructionType, FactorType, FloorType, FloorTypeType, UsageType } from '@/utils/types';


interface StepFiveProps {
    control: Control<CombinedSurveyType, any>;
    errors: FieldErrors<CombinedSurveyType>
    setValue: UseFormSetValue<CombinedSurveyType>;
}

const StepFive = ({ control, errors, setValue }: StepFiveProps) => {
    const [showModal, setShowModal] = React.useState(false);
    const { data: floorData } = useFetchFloorTypeQuery();
    const { data: usageTypeData } = useFetchUsageTypeQuery();
    const { data: usageFactorData } = useFetchUsageFactorQuery();
    const { data: constructionTypeData } = useFetchConstructionTypeQuery();
    const { fields, append, remove, replace } = useFieldArray({
        control,
        name: "floors",
    });
    const [plotAreaSqFt, plinthAreaSqFt] = useWatch({
        control,
        name: ['plotAreaSqFt', 'plinthAreaSqFt']
    });

    useEffect(() => {
        const plotArea = parseFloat(plotAreaSqFt || "0") * 0.092903;
        const plinthArea = parseFloat(plinthAreaSqFt || "0") * 0.092903;
        setValue('plotAreaSqMeter', plotArea.toFixed(4));
        setValue('plinthAreaSqMeter', plinthArea.toFixed(4));
    }, [plotAreaSqFt, plinthAreaSqFt]);

    useEffect(() => {
        const totalBuiltUpAreaSqFt = fields.reduce((acc, curr) => acc + parseInt(curr.areaSqFt || "0"), 0);
        setValue('totalBuiltUpAreaSqFt', totalBuiltUpAreaSqFt.toString());
        setValue('totalBuiltUpAreaSqMeter', (totalBuiltUpAreaSqFt * 0.092903).toFixed(4));
    }, [fields]);

    const handleLongPress = (index: number) => {
        remove(index);
    }
    return (
        <Box className='pt-2'>
            <VStack space='xs' className='mb-3'>
                <Text size='sm' bold>Plot Area</Text>
                <Box className='flex flex-row justify-between'>
                    <Box className='w-1/2 pr-2'>
                        <Controller
                            name='plotAreaSqFt'
                            control={control}
                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                <Input variant="outline" className="rounded-2xl" size="lg" isDisabled={false} isInvalid={!!errors.plotAreaSqFt} isReadOnly={false}>
                                    <InputField
                                        className="text-sm"
                                        keyboardType='numeric'
                                        onChange={(e) => onChange(e.nativeEvent.text)}
                                        value={value}
                                        placeholder={`sq feet`}
                                    />
                                </Input>
                            )}
                        />
                        <Text className='text-slate-600' size='xs'>Unit (square feet)</Text>
                    </Box>
                    <Box className='w-1/2 pl-2'>
                        <Controller
                            name='plotAreaSqMeter'
                            control={control}
                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                <Input variant="outline" className="rounded-2xl" size="lg" isInvalid={!!errors.plotAreaSqMeter} isReadOnly={true}>
                                    <InputField
                                        className="text-sm"
                                        keyboardType='numeric'
                                        onChange={(e) => onChange(e.nativeEvent.text)}
                                        value={value}
                                        placeholder={`sq meter`}
                                    />
                                </Input>
                            )}
                        />
                        <Text className='text-slate-600' size='xs'>Unit (square meter)</Text>
                    </Box>
                </Box>
                {errors.plotAreaSqFt && <Text className='text-red-500' size='xs'>{errors?.plotAreaSqFt?.message}</Text>}
            </VStack>

            <VStack space='xs' className='mb-3'>
                <Text size='sm' bold>Plinth Area</Text>
                <Box className='flex flex-row justify-between'>
                    <Box className='w-1/2 pr-2'>
                        <Controller
                            name='plinthAreaSqFt'
                            control={control}
                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                <Input variant="outline" className="rounded-2xl" size="lg" isDisabled={false} isInvalid={!!errors.plinthAreaSqFt} isReadOnly={false}>
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
                            name='plinthAreaSqMeter'
                            control={control}
                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                <Input variant="outline" className="rounded-2xl" size="lg" isInvalid={!!errors.plinthAreaSqMeter} isReadOnly={true}>
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
                {errors.plinthAreaSqFt && <Text className='text-red-500' size='xs'>{errors?.plinthAreaSqFt?.message}</Text>}
            </VStack>

            <Box className="rounded-lg overflow-hidden border border-slate-300 border-b-0 w-full">
                <ScrollView horizontal>
                    <Table className="w-full">
                        <TableHeader>
                            <TableRow className='bg-slate-100 py-1'>
                                <TableHead className='text-sm p-0 w-32 text-center align-middle'>Floor No.</TableHead>
                                <TableHead className='text-sm p-0 w-32 text-center align-middle'>Area</TableHead>
                                <TableHead className='text-sm p-0 w-32 text-center align-middle'>Usage Type</TableHead>
                                <TableHead className='text-sm p-0 w-32 text-center align-middle'>Usage Factor</TableHead>
                                <TableHead className='text-sm p-0 w-52 text-center align-middle'>Construction Type</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {fields.map((item, index) => (
                                <TouchableOpacity key={item.id} activeOpacity={0.7} onPress={() => console.log('clicked')} onLongPress={() => handleLongPress(index)}>
                                    <TableRow className='py-1'>
                                        <TableData className='text-sm w-32 p-0 text-center align-middle'>{item.floorType === "Other" ? item.floorTypeOther : floorData?.find((mainItem:FloorTypeType)=>mainItem.id.toString() === item.floorType)?.name || ""}</TableData>
                                        <TableData className='text-sm w-32 p-0 text-center align-middle'>{item?.areaSqFt}</TableData>
                                        <TableData className='text-sm w-32 p-0 text-center align-middle'>{item.usageType === "Other" ? item.usageTypeOther : usageTypeData?.find((mainItem:UsageType)=>mainItem.id.toString() === item.usageType)?.type_name || ""}</TableData>
                                        <TableData className='text-sm w-32 p-0 text-center align-middle'>{item.usageFactor === "Other" ? item.usageFactorOther : usageFactorData?.find((mainItem:FactorType)=>mainItem.id.toString() === item.usageFactor)?.name || ""}</TableData>
                                        <TableData className='text-sm w-52 p-0 text-center align-middle'>{item.constructionType === "Other" ? item.constructionTypeOther : constructionTypeData?.find((mainItem:ConstructionType)=>mainItem.id.toString() === item.constructionType)?.name || ""}</TableData>
                                    </TableRow>
                                </TouchableOpacity>
                            ))}
                        </TableBody>
                        {errors.floors && <TableCaption className='p-1 text-center align-middle'>
                            <Text size='xs' className='text-red-500' bold>Please add atleast one floor</Text>
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

            <VStack space='xs' className='mb-3'>
                <Text size='sm' bold>Total Built Up Area</Text>
                <Box className='flex flex-row justify-between'>
                    <Box className='w-1/2 pr-2'>
                        <Controller
                            name='totalBuiltUpAreaSqFt'
                            control={control}
                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                <Input variant="outline" className="rounded-2xl" size="lg" isDisabled={false} isInvalid={!!errors.totalBuiltUpAreaSqFt} isReadOnly={true}>
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
                            name='totalBuiltUpAreaSqMeter'
                            control={control}
                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                <Input variant="outline" className="rounded-2xl" size="lg" isInvalid={!!errors.totalBuiltUpAreaSqMeter} isReadOnly={true}>
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
                {errors.totalBuiltUpAreaSqFt && <Text className='text-red-500' size='xs'>{errors?.totalBuiltUpAreaSqFt?.message}</Text>}
            </VStack>
            {showModal && <FloorModal showModal={showModal} closeModal={() => setShowModal(false)} append={append} />}
        </Box>
    )
}

export default StepFive
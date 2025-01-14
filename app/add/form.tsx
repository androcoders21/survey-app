import React, { useCallback } from 'react';
import { StyleSheet, Platform, KeyboardAvoidingView, ScrollView, ToastAndroid, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { Controller, useForm } from 'react-hook-form';
import { Input, InputField } from '@/components/ui/input';
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateSurveyMutation } from '@/redux/api/end-points/survey';
import { useAppDispatch, useAppSelector } from '@/utils/hooks';
import { router, useFocusEffect } from 'expo-router';
import * as Location from 'expo-location';
import { useFetchWardQuery } from '@/redux/api/end-points/ward';
import Foundation from '@expo/vector-icons/Foundation';
import { clearLocal } from '@/utils/helper';
import { setUserId, setUserToken } from '@/redux/slices/user';
import { apiSlice } from '@/redux/api/api-slice';

// Define notRequiredFields array (optional fields)
const notRequiredFields: string[] = [
  "eNagarpalikaId",
  "electricityId",
  "mpKhasraNo",
  "registryNo",
  "ownerSamagraId",
  "landlineNo",
  "email",
  "presentLocality",
  "exemptionApplicable",
  "totalBuiltUpAreaSqFt",
  "totalBuiltUpAreaSqMeter",
  "remarks",
];

// Form field definitions for each step
const formFields1 = {
  ulbNameCode: "ULB's Name/Code*",
  wardNo: "Ward No*",
  eNagarpalikaId: "E-Nagarpalika ID",
  parcelNo: "Parcel No*",
  propertyNo: "Property No*",
  electricityId: "Electricity ID",
  mpKhasraNo: "MP Khasra No",
  registryNo: "Registry No",
  constructedDate: "Constructed Date*",
};

const formFields2 = {
  respondentName: "Name of the Respondent*",
  respondentRelationship: "Relationship with Owner*",
  ownerSamagraId: "Owner Samagra ID",
  ownerAadhaarNumber: "Owner Aadhaar Number*",
  aadhaarPhoto: "Capture Aadhaar Photo*",
  ownerName: "Owner Name*",
  fatherHusbandName: "Father/Husband Name*",
  mobileNo: "Mobile No.*",
  landlineNo: "Landline No.",
  email: "Email",
};

const formFields3 = {
  houseNo: "House No./Plot/Building/Apartment No.*",
  streetNoName: "Street No./Name*",
  locality: "Locality*",
  colony: "Colony*",
  city: "City*",
  pincode: "Pincode*",
  presentAddressSame: "Present address: (Same as property address)",
  presentHouseNo: "House No./Plot/Building/Apartment No.*",
  presentStreetNoName: "Street No./Name*",
  presentLocality: "Locality",
  presentColony: "Colony*",
  presentCity: "City*",
  presentPincode: "Pincode*",
};

const formFields4 = {
  taxRateZone: "Current Tax Rate Zone*",
  propertyOwnership: "Property Ownership*",
  situation: "Situation*",
  propertyUse: "Property Use*",
  yearOfConstruction: "Year of Construction*",
  exemptionApplicable: "Are you entitled to any concession?",
};

const formFields5 = {
  plotAreaSqFt: "Plot Area (Square Feet)*",
  plotAreaSqMeter: "Plot Area (Square Meter)*",
  totalBuiltUpAreaSqFt: "Total Built-Up Area (Square Feet)",
  totalBuiltUpAreaSqMeter: "Total Built-Up Area (Square Meter)",
};

const formFields6 = {
  municipalWaterSupply: "Municipal Water Supply?*",
  toiletType: "Type of Toilet?*",
  solidWasteService: "Solid Waste Service Available?*",
};

const formFields7 = {
  propertyPhoto1: "Upload Property Photo 1*",
  propertyPhoto2: "Upload Property Photo 2*",
  supportingDocuments: "Upload Supporting Documents",
  remarks: "Add any additional remarks.",
};

// Zod Schemas for each step
const step1Schema = z.object({
  ulbNameCode: z.string().min(1, "ULB's Name/Code is required"),
  wardNo: z.string().min(1, "Ward No is required"),
  parcelNo: z.string().min(1, "Parcel No is required"),
  propertyNo: z.string().min(1, "Property No is required"),
  constructedDate: z.string().min(1, "Constructed Date is required"),
});

const step2Schema = z.object({
  respondentName: z.string().min(1, "Name of the Respondent is required"),
  respondentRelationship: z.string().min(1, "Relationship with Owner is required"),
  ownerAadhaarNumber: z.string().min(12, "Aadhaar Number must be 12 digits").max(12, "Aadhaar Number must be 12 digits"),
  aadhaarPhoto: z.string().min(1, "Aadhaar Photo is required"),
  ownerName: z.string().min(1, "Owner Name is required"),
  fatherHusbandName: z.string().min(1, "Father/Husband Name is required"),
  mobileNo: z.string().min(10, "Mobile No must be 10 digits").max(10, "Mobile No must be 10 digits"),
});

const step3Schema = z.object({
  houseNo: z.string().min(1, "House No is required"),
  streetNoName: z.string().min(1, "Street No/Name is required"),
  locality: z.string().min(1, "Locality is required"),
  colony: z.string().min(1, "Colony is required"),
  city: z.string().min(1, "City is required"),
  pincode: z.string().min(6, "Pincode must be 6 digits").max(6, "Pincode must be 6 digits"),
  presentHouseNo: z.string().min(1, "Present House No is required"),
  presentStreetNoName: z.string().min(1, "Present Street No/Name is required"),
  presentColony: z.string().min(1, "Present Colony is required"),
  presentCity: z.string().min(1, "Present City is required"),
  presentPincode: z.string().min(6, "Present Pincode must be 6 digits").max(6, "Present Pincode must be 6 digits"),
});

const step4Schema = z.object({
  taxRateZone: z.string().min(1, "Tax Rate Zone is required"),
  propertyOwnership: z.string().min(1, "Property Ownership is required"),
  situation: z.string().min(1, "Situation is required"),
  propertyUse: z.string().min(1, "Property Use is required"),
  yearOfConstruction: z.string().min(4, "Year of Construction must be 4 digits").max(4, "Year of Construction must be 4 digits"),
});

const step5Schema = z.object({
  plotAreaSqFt: z.string().min(1, "Plot Area (Square Feet) is required"),
  plotAreaSqMeter: z.string().min(1, "Plot Area (Square Meter) is required"),
});

const step6Schema = z.object({
  municipalWaterSupply: z.string().min(1, "Municipal Water Supply is required"),
  toiletType: z.string().min(1, "Type of Toilet is required"),
  solidWasteService: z.string().min(1, "Solid Waste Service is required"),
});

const step7Schema = z.object({
  propertyPhoto1: z.string().min(1, "Property Photo 1 is required"),
  propertyPhoto2: z.string().min(1, "Property Photo 2 is required"),
});

// Combined Zod Schema for the entire form
const surveySchema = z.union([step1Schema, step2Schema, step3Schema, step4Schema, step5Schema, step6Schema, step7Schema]);

type SurveyType = z.infer<typeof surveySchema>;

interface FormProps {
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

const Form: React.FC<FormProps> = ({ currentStep, setCurrentStep }) => {
  const [createSurvey, { isLoading }] = useCreateSurveyMutation();
  const { isFetching, data: wardData } = useFetchWardQuery();
  const dispatch = useAppDispatch();

  const hadelValidation = (type: number) => {
    switch (type) {
      case 1:
        return zodResolver(step1Schema);
      case 2:
        return zodResolver(step2Schema);
      case 3:
        return zodResolver(step3Schema);
      case 4:
        return zodResolver(step4Schema);
      case 5:
        return zodResolver(step5Schema);
      case 6:
        return zodResolver(step6Schema);
      case 7:
        return zodResolver(step7Schema);
      default:
        return zodResolver(surveySchema);
    }
  };

  const { control, handleSubmit, formState: { errors }, reset, setValue } = useForm<SurveyType>({
    resolver: hadelValidation(currentStep),
  });

  const userId = useAppSelector(state => state.user.userId);

  const onSubmit = async (data: SurveyType) => {
    if (currentStep !== 7) {
      handleNextStep();
      return;
    }

    try {
      const response = await createSurvey({ ...data, user_id: userId }).unwrap();
      ToastAndroid.show("Survey created successfully", ToastAndroid.SHORT);
      router.navigate({ pathname: '/form/step-second', params: { formId: response?.survey_form?.id } });
      reset();
    } catch (error: any) {
      if (error?.data?.status === 401) {
        handleLogout();
        ToastAndroid.show("Session expired, Please Re-login", ToastAndroid.LONG);
      } else if (error && typeof error?.data?.error === "string") {
        ToastAndroid.show(error?.data?.error, ToastAndroid.SHORT);
      } else {
        ToastAndroid.show("Unable to create survey", ToastAndroid.SHORT);
      }
    }
  };

  const handleLogout = () => {
    clearLocal();
    dispatch(setUserToken(""));
    dispatch(setUserId(""));
    dispatch(apiSlice.util.resetApiState());
    router.replace('/signin');
  };

  useFocusEffect(
    useCallback(() => {
      async function getCurrentLocation() {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          ToastAndroid.show('Permission to access location was denied', ToastAndroid.SHORT);
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;
        const address = await Location.reverseGeocodeAsync({ latitude, longitude });
        // Set location-related fields if needed
      }

      getCurrentLocation();
    }, [setValue])
  );

  const renderFormFields = (fields: Record<string, string>) => {
    return Object.entries(fields).map(([key, heading]) => (
      <VStack key={key}>
        <Text style={styles.label}>{heading} {!notRequiredFields.includes(key) && "*"}</Text>
        <Controller
          name={key as keyof SurveyType}
          control={control}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <Input variant="outline" className="rounded-2xl" size="lg" isDisabled={false} isInvalid={!!errors[key as keyof SurveyType]} isReadOnly={false}>
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
        {errors[key as keyof SurveyType] && <Text style={styles.errorText}>{errors[key as keyof SurveyType]?.message}</Text>}
      </VStack>
    ));
  };

  const handleNextStep = () => {
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Box className='p-1'>
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? 'padding' : undefined}>
            <VStack space="sm" style={{ marginTop: 5 }}>
              {/* Step 1: Basic Property Details */}
              {currentStep === 1 && (
                <Box className='bg-gray-300 w-full p-2 rounded-xl'>
                  <VStack space='lg' className='bg-white px-2 py-2 my-2 rounded-2xl'>
                    {renderFormFields(formFields1)}
                  </VStack>
                </Box>
              )}

              {/* Step 2: Owner Details */}
              {currentStep === 2 && (
                <Box className='bg-gray-300 w-full p-2 rounded-xl'>
                  <VStack space='lg' className='bg-white px-2 py-2 my-2 rounded-2xl'>
                    {renderFormFields(formFields2)}
                  </VStack>
                </Box>
              )}

              {/* Step 3: Property Address */}
              {currentStep === 3 && (
                <Box className='bg-gray-300 w-full p-2 rounded-xl'>
                  <VStack space='lg' className='bg-white px-2 py-2 my-2 rounded-2xl'>
                    {renderFormFields(formFields3)}
                  </VStack>
                </Box>
              )}

              {/* Step 4: Taxation and General Property Details */}
              {currentStep === 4 && (
                <Box className='bg-gray-300 w-full p-2 rounded-xl'>
                  <VStack space='lg' className='bg-white px-2 py-2 my-2 rounded-2xl'>
                    {renderFormFields(formFields4)}
                  </VStack>
                </Box>
              )}

              {/* Step 5: Property Area Details */}
              {currentStep === 5 && (
                <Box className='bg-gray-300 w-full p-2 rounded-xl'>
                  <VStack space='lg' className='bg-white px-2 py-2 my-2 rounded-2xl'>
                    {renderFormFields(formFields5)}
                  </VStack>
                </Box>
              )}

              {/* Step 6: Utilities and Sanitation */}
              {currentStep === 6 && (
                <Box className='bg-gray-300 w-full p-2 rounded-xl'>
                  <VStack space='lg' className='bg-white px-2 py-2 my-2 rounded-2xl'>
                    {renderFormFields(formFields6)}
                  </VStack>
                </Box>
              )}

              {/* Step 7: Supporting Details and Documentation */}
              {currentStep === 7 && (
                <Box className='bg-gray-300 w-full p-2 rounded-xl'>
                  <VStack space='lg' className='bg-white px-2 py-2 my-2 rounded-2xl'>
                    {renderFormFields(formFields7)}
                  </VStack>
                </Box>
              )}
            </VStack>
          </KeyboardAvoidingView>
        </Box>
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={{ ...styles.navigationContainer, padding: 20 }}>
        {currentStep > 1 && (
          <Button
            isDisabled={isLoading}
            onPress={handlePreviousStep}
            className={`h-19 w-20 rounded-full p-1`}
          >
            <Foundation
              name="previous"
              size={40}
              color={'#FFFFFF'}
              margin={0}
            />
          </Button>
        )}
        <Button
          isDisabled={isLoading}
          onPress={handleSubmit(onSubmit)}
          className='h-14 w-80 rounded-3xl ml-auto'
        >
          {isLoading && <ButtonSpinner size={30} color={'black'} />}
          <ButtonText className='text-center'>
            {currentStep === 7 ? 'Submit' : 'Next'}
          </ButtonText>
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 10,
  },
  label: {
    marginBottom: 5,
  },
  errorText: {
    paddingLeft: 5,
    color: 'red',
    fontSize: 10,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
});

export default Form;
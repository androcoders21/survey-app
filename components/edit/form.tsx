import React, { useCallback, useEffect } from 'react';
import { StyleSheet, Platform, KeyboardAvoidingView, ToastAndroid, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { useForm } from 'react-hook-form';
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreatePropertyMutation } from '@/redux/api/end-points/survey';
import { useAppDispatch } from '@/utils/hooks';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import * as Location from 'expo-location';
import { useFetchWardQuery } from '@/redux/api/end-points/ward';
import { getFromLocal, storeToLocal } from '@/utils/helper';
import { CombinedSurveyType, step1Schema, step2Schema, step3Schema, step4Schema, step5Schema, step6Schema, step7Schema } from '@/utils/validation-schema';
import StepOne from '../add/step-one';
import StepTwo from '../add/step-two';
import StepThree from '../add/step-three';
import StepFour from '../add/step-four';
import StepFive from '../add/step-five';
import StepSix from '../add/step-six';
import StepSeven from '../add/step-seven';

interface FormProps {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  id:string;
}

const Form = ({ currentStep, setCurrentStep,id }: FormProps) => {
  const params = useLocalSearchParams<{ id: string }>();
  const [draftData, setDraftData] = React.useState<CombinedSurveyType | undefined>(undefined);
  const [isFetching, setIsFetching] = React.useState(true);
  const [createSurvey, { isLoading }] = useCreatePropertyMutation();
  const { data: wardData } = useFetchWardQuery();

  useEffect(() => {
          getFromLocal(params.id).then((data) => {
              console.log(data);
              setDraftData(data ? JSON.parse(data) : undefined);
              reset(data ? JSON.parse(data) : undefined);
          }).catch((error) => {
              console.log(error);
          }).finally(() => {
              setIsFetching(false);
          });
      }, []);

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
        return zodResolver(z.object({}));
    }
  };

  const { control, handleSubmit, formState: { errors }, reset, setValue, getValues } = useForm<CombinedSurveyType>({
    // resolver: hadelValidation(currentStep),
    defaultValues: {
      ulbNameCode:  "",
      wardNo: draftData?.wardNo || "",
      isSlum: draftData?.isSlum || "no",
      nagarpalikaId: draftData?.nagarpalikaId || "",
      parcelNo: draftData?.parcelNo || "",
      propertyNo: draftData?.propertyNo || "",
      electricityId: draftData?.electricityId || "",
      khasraNo: draftData?.khasraNo || "",
      registryNo: draftData?.registryNo || "",
      constructedDate: draftData?.constructedDate || "",
      slumId: "",
      respondentName: "",
      respondentRelationship: "",
      respondentRelationshipOther: "",
      ownerDetails: [
      ],
      ownerAadhaarNumber: "",
      aadhaarPhoto: "",
      city: "",
      pincode: "",
      houseNo: "",
      streetNoName: "",
      locality: "",
      colony: "",
      presentHouseNo: "",
      presentStreetNoName: "",
      presentLocality: "",
      presentColony: "",
      presentCity: "",
      presentPincode: "",
      colonyOther: "",
      isSameAsProperty: false,
      taxRateZone: "",
      propertyOwnership: "",
      propertyOwnershipOther: "",
      situation: "",
      situationOther: "",
      propertyUse: "",
      propertyOther: "",
      commercial: "",
      commercialOther: "",
      yearOfConstruction: "",
      isExemptionApplicable: "no",
      exemptionType: "",
      exemptionTypeOther: "",
      floors: [],
      plotAreaSqFt: "",
      plotAreaSqMeter: "",
      plinthAreaSqFt: "",
      plinthAreaSqMeter: "",
      totalBuiltUpAreaSqFt: "",
      totalBuiltUpAreaSqMeter: "",
      isMuncipalWaterSupply: "no",
      toiletType: "",
      isMuncipalWasteService: "yes",
      totalWaterConnection: "",
      waterConnectionId: [],
      waterConnectionType: "",
      waterConnectionTypeOther: "",
      sourceOfWater: "",
      sourceOfWaterOther: "",
      propertyFirstImage: { name: '', uri: '', type: '', size: 0 },
      propertySecondImage: { name: '', uri: '', type: '', size: 0 },
      latitude: "",
      longitude: "",
      supportingDocuments: [],
      remark: "",
    },
  });

  const onSubmit = async (data: any) => {
    if (currentStep !== 7) {
      console.log(data);
      handleNextStep();
      return;
    }
    console.log("Last Step", getValues());
    const values = getValues();
    try {
      storeToLocal(params.id,JSON.stringify(values)).then((isSaved) => {
        console.log("Draft Saved", isSaved);
          ToastAndroid.show("Survey updated in drafts", ToastAndroid.SHORT);
          router.replace({ pathname: '/(tabs)/main' });
      }).catch(()=>{
        ToastAndroid.show("Unable to save in draft", ToastAndroid.SHORT);
      });
    } catch (error) {
      console.log('Error', error);
    }
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

  if (isFetching || !draftData) {
          return (
              <Box className='mt-4' style={styles.container}>
                  <ActivityIndicator size={30}/>
              </Box>
          )
      }

  return (
    <SafeAreaView style={styles.container}>

      <Box className='p-1 pt-0'>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? 'padding' : undefined}>
          <VStack space="sm">
            {/* Step 1: Basic Property Details */}
            {currentStep === 1 && (
              <Box className='bg-gray-300 w-full p-2 rounded-xl'>
                <VStack space='lg' className='bg-white px-2 py-2 my-2 rounded-2xl'>
                  <StepOne control={control} errors={errors} setValue={setValue} />
                </VStack>
              </Box>
            )}

            {/* Step 2: Owner Details */}
            {currentStep === 2 && (
              <Box className='bg-gray-300 w-full p-2 rounded-xl'>
                <VStack space='lg' className='bg-white px-2 py-2 my-2 rounded-2xl'>
                  <StepTwo control={control} errors={errors} setValue={setValue} />
                </VStack>
              </Box>
            )}

            {/* Step 3: Property Address */}
            {currentStep === 3 && (
              <Box className='bg-gray-300 w-full p-2 rounded-xl'>
                <VStack space='lg' className='bg-white px-2 py-2 my-2 rounded-2xl'>
                  <StepThree control={control} errors={errors} setValue={setValue} getValues={getValues} />
                </VStack>
              </Box>
            )}

            {/* Step 4: Taxation and General Property Details */}
            {currentStep === 4 && (
              <Box className='bg-gray-300 w-full p-2 rounded-xl'>
                <VStack space='lg' className='bg-white px-2 py-2 my-2 rounded-2xl'>
                  <StepFour control={control} errors={errors} setValue={setValue} />
                </VStack>
              </Box>
            )}

            {/* Step 5: Property Area Details */}
            {currentStep === 5 && (
              <Box className='bg-gray-300 w-full p-2 rounded-xl'>
                <VStack space='lg' className='bg-white px-2 py-2 my-2 rounded-2xl'>
                  <StepFive control={control} errors={errors} setValue={setValue} />
                </VStack>
              </Box>
            )}

            {/* Step 6: Utilities and Sanitation */}
            {currentStep === 6 && (
              <Box className='bg-gray-300 w-full p-2 rounded-xl'>
                <VStack space='lg' className='bg-white px-2 py-2 my-2 rounded-2xl'>
                  <StepSix control={control} errors={errors} setValue={setValue} />
                </VStack>
              </Box>
            )}

            {/* Step 7: Supporting Details and Documentation */}
            {currentStep === 7 && (
              <Box className='bg-gray-300 w-full p-2 rounded-xl'>
                <VStack space='lg' className='bg-white px-2 py-2 my-2 rounded-2xl'>
                  <StepSeven control={control} errors={errors} setValue={setValue} />
                </VStack>
              </Box>
            )}
          </VStack>
        </KeyboardAvoidingView>
      </Box>

      {/* Navigation Buttons */}
      <Box className={`flex-row items-center mt-3 pt-4 px-2 pb-2 border-t border-gray-300 ${currentStep > 1 ? 'justify-between' : 'justify-center'}`}>
        {currentStep > 1 && (
          <Button
            isDisabled={isLoading}
            onPress={handlePreviousStep}
            className='h-12 rounded-xl w-40 mx-2'
            variant='outline'
          >
            <ButtonText className='text-center'>
              Previous
            </ButtonText>
          </Button>
        )}
        <Button
          isDisabled={isLoading}
          onPress={handleSubmit(onSubmit)}
          className='h-12 rounded-xl w-40 mx-2'
        >
          {isLoading && <ButtonSpinner size={30} color={'black'} />}
          <ButtonText className='text-center'>
            {currentStep === 7 ? 'Save in Drafts' : 'Next'}
          </ButtonText>
        </Button>
      </Box>
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
  }
});

export default Form;
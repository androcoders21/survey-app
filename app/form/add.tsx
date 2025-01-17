import React, { useState } from 'react';
import { StyleSheet, Platform, KeyboardAvoidingView, ScrollView, SafeAreaView, View } from 'react-native';
import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { VStack } from '@/components/ui/vstack';
import Stepper from '../add/navbar';
import Form from '../add/form';

const AddSurvey = () => {
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.stickyTopComponent}>
        <Box style={styles.headerBox}>
          <Heading size="2xl" style={{ paddingTop: 10, textAlign: 'center' }}>
            Add Survey
          </Heading>
        </Box>
        <View style={styles.stepperWrapper}>
          <Stepper currentStep={currentStep} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Box style={styles.contentBox}>
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? 'padding' : undefined}>
            <VStack space="sm">
              <Box>
                <VStack>
                  <Form currentStep={currentStep} setCurrentStep={setCurrentStep} />
                </VStack>
              </Box>
            </VStack>
          </KeyboardAvoidingView>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  stickyTopComponent: {
    position: 'absolute',
    paddingTop: Platform.OS === 'android' ? 25 : 0,
    zIndex: 1000,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  },
  headerBox: {
    backgroundColor: '#ffffff',
    width: '100%',
    padding: 10,
    borderBottomColor: '#e0e0e0',
  },
  stepperWrapper: {
    width: '100%',
  },
  scrollContent: {
    paddingTop: 140,
  },
  contentBox: {
    padding: 5,
  },
});

export default AddSurvey;
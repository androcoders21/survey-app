import React, { useEffect, useState } from 'react';
import { StyleSheet, Platform, KeyboardAvoidingView, ScrollView, SafeAreaView, View, Alert, BackHandler } from 'react-native';
import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { VStack } from '@/components/ui/vstack';
import Stepper from '../../components/add/navbar';
import Form from '../../components/add/form';
import { router, Stack } from 'expo-router';

const AddSurvey = () => {
    const [currentStep, setCurrentStep] = useState(1);
    useEffect(() => {
        const backAction = () => {
          Alert.alert('Hold on!', 'Are you sure you want to go back?', [
            {
              text: 'Cancel',
              onPress: () => null,
              style: 'cancel',
            },
            {text: 'YES', onPress: () => router.back()},
          ]);
          return true;
        };
        const backHandler = BackHandler.addEventListener(
          'hardwareBackPress',
          backAction,
        );
    
        return () => backHandler.remove();
      }, []);

    return (
        <>
            <Stack.Screen options={{
                title: 'Add Survey',
                headerTitle: "Add Survey",
                headerShown: true,
                headerTitleStyle: { fontWeight: '700' },
            }} />
            <View style={styles.container}>
                <View style={styles.stickyTopComponent}>
                    <View style={styles.stepperWrapper}>
                        <Stepper currentStep={currentStep} />
                    </View>
                </View>

                <ScrollView>
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
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    stickyTopComponent: {
        zIndex: 100,
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 5,
    },
    headerBox: {
        backgroundColor: '#ffffff',
        width: '100%',
        borderBottomColor: '#e0e0e0',
    },
    stepperWrapper: {
        width: '100%',
    },
    scrollContent: {

    },
    contentBox: {
        padding: 5,
        paddingTop: 0,
    },
});

export default AddSurvey;
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const steps = [
  'Property Details',
  'Owner Details',
  'Address Details',
  'Taxation Details',
  'Area Detail',
  'Municipal Supply',
  'Property Photo',
];

interface StepperProps {
  currentStep: number; // Updated to accept a number
}

const Stepper: React.FC<StepperProps> = ({ currentStep }) => {
  return (
    <View style={styles.container}>
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progress,
            { width: `${(currentStep / steps.length) * 100}%` }, // Progress based on currentStep
          ]}
        />
      </View>
      <View style={styles.stepsContainer}>
        {steps.map((step, index) => (
          <View key={index} style={styles.stepContainer}>
            <View
              style={[
                styles.circle,
                currentStep >= index + 1 && styles.activeCircle, // Highlight active steps
              ]}
            >
              <Text
                style={[
                  styles.stepNumber,
                  currentStep >= index + 1 && styles.activeStepNumber, // Highlight active step numbers
                ]}
              >
                {index + 1}
              </Text>
            </View>
            <Text
              style={[
                styles.stepLabel,
                currentStep >= index + 1 && styles.activeStepLabel, // Highlight active step labels
              ]}
            >
              {step}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
    backgroundColor: '#05837a',
    elevation: 3,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#fff',
    borderRadius: 3,
    overflow: 'hidden',
    margin: 10,
  },
  progress: {
    height: '100%',
    backgroundColor: '#b5db0b', // Progress bar color
  },
  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stepContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  activeCircle: {
    backgroundColor: '#aacc12', // Active circle color
  },
  stepNumber: {
    color: '#757575',
    fontWeight: 'bold',
  },
  activeStepNumber: {
    color: '#757575', // Active step number color
  },
  stepLabel: {
    fontSize: 12,
    color: '#fff',
    textAlign: 'center',
  },
  activeStepLabel: {
    color: '#fff', // Active step label color
  },
});

export default Stepper;
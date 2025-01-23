import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader } from '@/components/ui/modal';
import { Button, ButtonText } from './ui/button';
import { Heading } from './ui/heading';
import { CloseIcon, Icon } from './ui/icon';
import { Box } from './ui/box';

interface MonthYearPickerProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (month: string, year: number) => void;
}

const months: string[] = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const MonthYearPicker = ({ open, onClose, onConfirm }: MonthYearPickerProps) => {
  const [month, setMonth] = useState<string>("January");
  const [year, setYear] = useState<number>(new Date().getFullYear());

  // Generate an array of years (current year - 5 to current year + 4)
  const years: number[] = Array.from({ length: 101 }, (_, i) => new Date().getFullYear() - 100 + i);

  const handleConfirm = () => {
    onConfirm(month, year);
    onClose();
  };

  return (
    <View>
      <Modal
        isOpen={open}
        onClose={onClose}
        size="lg"
      >
        <ModalBackdrop />
        <ModalContent className="bg-white rounded-2xl py-3 px-4">
          <ModalHeader>
            <Heading size="lg" className="text-typography-950">
              Select Month and Year
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
              <Picker
                selectedValue={month}
                onValueChange={(itemValue: string) => setMonth(itemValue)}
              >
                {months.map((m) => (
                  <Picker.Item key={m} label={m} value={m} />
                ))}
              </Picker>

              {/* Year Picker */}
              <Picker
                selectedValue={year}
                onValueChange={(itemValue: number) => setYear(itemValue)}
              >
                {years.map((y) => (
                  <Picker.Item key={y} label={y.toString()} value={y} />
                ))}
              </Picker>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="outline"
              action="secondary"
              onPress={onClose}
            >
              <ButtonText>Cancel</ButtonText>
            </Button>
            <Button
              onPress={handleConfirm}
            >
              <ButtonText>Ok</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
    backgroundColor: '#ddd',
    alignItems: 'center',
    borderRadius: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  pickerContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  confirmButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#2196F3',
    alignItems: 'center',
    borderRadius: 5,
  },
});

export default MonthYearPicker;
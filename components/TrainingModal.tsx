import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';

interface TrainingModalProps {
  isVisible: boolean;
  onClose: () => void;
  onAddTraining: (training: { name: string; sets: number; reps: number; interval: number }) => void;
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    width: '80%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
    marginBottom: 10,
  },
    pickerContainer: {
       borderWidth: 1,
      borderColor: '#ccc',
        borderRadius: 4,
      marginBottom: 10,
    },
    picker: {
       height: 50,
      width: 150,
    },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  button: {
    padding: 10,
    borderRadius: 4,
      marginLeft: 10,
    backgroundColor: 'aqua',
  },
});

const TrainingModal: React.FC<TrainingModalProps> = ({ isVisible, onClose, onAddTraining }) => {
  const [trainingName, setTrainingName] = useState('');
  const [trainingSets, setTrainingSets] = useState(1);
  const [trainingReps, setTrainingReps] = useState(1);
    const [trainingInterval, setTrainingInterval] = useState(1);

    const handleAddTraining = () => {
        onAddTraining({
            name: trainingName,
            sets: trainingSets,
            reps: trainingReps,
            interval: trainingInterval,
        });
      onClose();
   };

  return (
    <Modal visible={isVisible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
            <TextInput
                style={styles.input}
                placeholder="トレーニング名"
                value={trainingName}
                onChangeText={setTrainingName}
            />
            <View style={styles.pickerContainer}>
                <Text>セット数</Text>
                <Picker
                    style={styles.picker}
                    selectedValue={trainingSets}
                    onValueChange={(value) => setTrainingSets(Number(value))}
                 >
                   {Array.from({ length: 10 }, (_, i) => i + 1).map((value) => (
                         <Picker.Item key={value} label={String(value)} value={value} />
                    ))}
                 </Picker>
             </View>
                <View style={styles.pickerContainer}>
                    <Text>レップ回数</Text>
                    <Picker
                        style={styles.picker}
                         selectedValue={trainingReps}
                        onValueChange={(value) => setTrainingReps(Number(value))}
                    >
                         {Array.from({ length: 20 }, (_, i) => i + 1).map((value) => (
                            <Picker.Item key={value} label={String(value)} value={value} />
                         ))}
                   </Picker>
                 </View>
              <View style={styles.pickerContainer}>
                    <Text>インターバル</Text>
                     <Picker
                         style={styles.picker}
                         selectedValue={trainingInterval}
                         onValueChange={(value) => setTrainingInterval(Number(value))}
                    >
                         {Array.from({ length: 10 }, (_, i) => i + 1).map((value) => (
                            <Picker.Item key={value} label={String(value)} value={value} />
                        ))}
                    </Picker>
              </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={onClose}>
              <Text>キャンセル</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleAddTraining}>
              <Text>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default TrainingModal;
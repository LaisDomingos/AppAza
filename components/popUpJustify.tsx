import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, Alert } from 'react-native';
import { styles } from '../styles/PopUp.styles';
import { deleteTruck } from '../database/truck_data';
import AsyncStorage from '@react-native-async-storage/async-storage';

type PopupPropsJustify = {
  visible: boolean;
  message: string;
  buttonMessage1: string;
  buttonMessage2: string;
  onButton1Press: () => void;
  onButton2Press: () => void;
  onClose: () => void;
  truck_id: number;
  navigation: any
};

const PopupJustify: React.FC<PopupPropsJustify> = ({
  visible,
  message,
  buttonMessage1,
  buttonMessage2,
  onButton1Press,
  onButton2Press,
  onClose,
  truck_id,
  navigation
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (text: string) => {
    setInputValue(text);
  };

  const handleOkPress = async () => {
    // Aqui você pode fazer o que quiser com o valor do input
    console.log('Input value:', inputValue);
    console.log("depois do input: ", truck_id)
    deleteTruck(truck_id)
    await AsyncStorage.removeItem("currentStep");
    await AsyncStorage.removeItem("truck_id");
    Alert.alert("Éxito", "¡El viaje ha sido finalizado con éxito!");
    navigation.navigate('DestinationPoint', {
      truck_id: truck_id // Passa o ID do caminhão
    });
    // Fecha o pop-up após o botão "OK" ser pressionado
    onClose();
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.popup}>
          <Text style={styles.message}>{String(message)}</Text>
          <TextInput
            style={styles.input} // Estilo para o input
            placeholder="Escriba la justificación"
            value={inputValue}
            onChangeText={handleInputChange}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={handleOkPress}>
              <Text style={[styles.buttonText, styles.yesText, styles.buttonBorderYes]}>
                Guardar
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onButton2Press}>
              <Text style={[styles.buttonText, styles.noText, styles.buttonBorderNo]}>
                {buttonMessage2}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default PopupJustify;

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { styles } from '../styles/PopUp.styles';

type PopupProps = {
  visible: boolean;
  message: string;
  buttonMessage1: string;
  buttonMessage2: string;
  onButton1Press: () => void;
  onButton2Press: () => void;
  onClose: () => void;
};

const Popup: React.FC<PopupProps> = ({
  visible,
  message,
  buttonMessage1,
  buttonMessage2,
  onButton1Press,
  onButton2Press,
  onClose,
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.popup}>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.separator} /> {/* Linha separadora */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={onButton1Press}>
              <Text style={[styles.buttonText, styles.yesText, styles.buttonBorderYes]}>{buttonMessage1}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onButton2Press}>
              <Text style={[styles.buttonText, styles.noText, styles.buttonBorderNo]}>{buttonMessage2}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

    </Modal>
  );
};

export default Popup;
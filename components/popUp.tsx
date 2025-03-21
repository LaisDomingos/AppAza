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
  pendingData: any;
};

const Popup: React.FC<PopupProps> = ({
  visible,
  message,
  buttonMessage1,
  buttonMessage2,
  onButton1Press,
  onButton2Press,
  onClose,
  pendingData,
}) => {
  // Lógica para verificar se há dados pendentes
  const displayMessage = pendingData && pendingData.length > 0 
    ? "Não pode encerrar o turno com viagem em aberto" 
    : message; // Exibe a mensagem personalizada se houver dados pendentes

  const isButton1Disabled = pendingData && pendingData.length > 0; // Desativa o botão "Sim" se houver dados

  // Se houver dados pendentes, mudar o texto do botão 2 para "Fechar"
  const button2Text = pendingData && pendingData.length > 0 ? "Fechar" : buttonMessage2;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.popup}>
          {/* Exibe a mensagem de erro ou a mensagem normal dentro de <Text> */}
          <Text style={styles.message}>{String(displayMessage)}</Text> 

          <View style={styles.buttonContainer}>
            {!isButton1Disabled && (
              <TouchableOpacity onPress={onButton1Press}>
                <Text style={[styles.buttonText, styles.yesText, styles.buttonBorderYes]}>{buttonMessage1}</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity onPress={onButton2Press}>
              {/* Exibe "Fechar" ou o texto do botão 2 */}
              <Text style={[styles.buttonText, styles.noText, styles.buttonBorderNo]}>{button2Text}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default Popup;

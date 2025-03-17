import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { styles } from '../styles/UserHeader.styles';
import { endTurn } from '../functions/UseHeaderComponent/endTurn';
import { NavigationProp } from '@react-navigation/native';
import Popup from './popUp';

type UserHeaderProps = {
  name: string | null;
  patente: string | null;
  navigation: NavigationProp<any>;
};

const UserHeader: React.FC<UserHeaderProps> = ({ name, patente, navigation }) => {
  // Estado para controlar a visibilidade do pop-up
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  // Função para abrir o pop-up
  const openPopup = () => {
    setIsPopupVisible(true);
  };

  // Função para fechar o pop-up
  const closePopup = () => {
    setIsPopupVisible(false);
  };

  // Função chamada quando o botão "Sim" é pressionado no pop-up
  const handleEndTurn = () => {
    endTurn(navigation);
    closePopup(); // Fecha o pop-up após chamar a função
  };

  return (
    <View style={styles.containerTop}>
      {/* Nome e patente empilhados */}
      <View style={styles.nameContainer}>
        <Text style={styles.labelData}>{name || 'Carregando...'}</Text>
        <Text style={styles.labelData}>{patente || 'Carregando...'}</Text>
      </View>

      {/* Botão para abrir o pop-up */}
      <TouchableOpacity style={styles.buttonTurn} onPress={openPopup}>
        <Text style={styles.buttonTextTurn}>Encerrar Turno</Text>
      </TouchableOpacity>

      {/* Componente Popup */}
      <Popup
        visible={isPopupVisible}
        message="¿Estás seguro de que deseas cerrar el turno?"
        buttonMessage1="Sí"
        buttonMessage2="No"
        onButton1Press={handleEndTurn}
        onButton2Press={closePopup}
        onClose={closePopup}
      />
    </View>
  );
};

export default UserHeader;

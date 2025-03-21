import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { styles } from '../styles/UserHeader.styles';
import { endTurn } from '../functions/UseHeaderComponent/endTurn';
import { NavigationProp } from '@react-navigation/native';
import Popup from './popUp';
import { getData, TruckData } from '../database/truck_data';

type UserHeaderProps = {
  name: string | null;
  patente: string | null;
  navigation: NavigationProp<any>;
};

const UserHeader: React.FC<UserHeaderProps> = ({ name, patente, navigation }) => {
  // Estado para controlar a visibilidade do pop-up
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [pendingData, setPendingData] = useState<TruckData[]>([]); // Estado com os dados pendentes
  const [errorMessage, setErrorMessage] = useState(''); // Estado para a mensagem de erro

  useEffect(() => {
    // Função assíncrona para buscar os dados
    const fetchData = async () => {
      try {
        const data = await getData(); // Chama a função assíncrona para buscar os dados
        setPendingData(data); // Armazena os dados no estado pendingData
      } catch (error) {
        console.error('Erro ao buscar os dados:', error); // Trate erros, se necessário
      }
    };

    fetchData(); // Chama a função assíncrona
  }, []);

  // Função para abrir o pop-up
  const openPopup = () => {
    setIsPopupVisible(true);
  };

  // Função para fechar o pop-up
  const closePopup = () => {
    setIsPopupVisible(false);
  };

  // Função chamada quando o botão "Sim" é pressionado no pop-up
  const handleEndTurn = async () => {
    // Passando a função setErrorMessage para mostrar a mensagem de erro no Popup
    await endTurn(navigation);
  };

  return (
    <View style={styles.containerTop}>
      {/* Nome e patente empilhados */}
      <View style={styles.nameContainer}>
        <Text style={styles.labelData}>{name || 'Cargando...'}</Text>
        <Text style={styles.labelData}>{patente || 'Cargando...'}</Text>
      </View>

      {/* Botão para abrir o pop-up */}
      <TouchableOpacity style={styles.buttonTurn} onPress={openPopup}>
        <Text style={styles.buttonTextTurn}>Cerrar Turno</Text>
      </TouchableOpacity>

      {/* Componente Popup */}
      <Popup
        visible={isPopupVisible}
        message="¿Estás seguro de que deseas cerrar el turno?"
        pendingData={pendingData}
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

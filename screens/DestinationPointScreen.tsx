import React, { useState, useEffect } from 'react';
import { Text, View, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { styles } from '../styles/DestinationPointScreen.styles';
import { loadData } from '../functions/DestinationPointScreen/loadData';
import { handleStart } from '../functions/DestinationPointScreen/handleStart';
import { deleteTruck, getData, missingData } from '../database/truck_data';
import UserHeader from '../components/userHeader';
import Popup from '../components/popUp';
import { pendingTrip } from '../functions/DestinationPointScreen/pendingTrip';
export type RootStackParamList = {
  DestinationPoint: undefined;
  StartRoute: { truck_id: number };
};

type DestinationPointScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'DestinationPoint'
>;

type Props = {
  navigation: DestinationPointScreenNavigationProp;
  route: any;
};

export default function DestinationPoint({ navigation }: Props) {
  const [selectedSetor, setSelectedSetor] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [setores, setSetores] = useState<string[]>([]);
  const [nome, setNome] = useState<string | null>(null);
  const [patente, setPatente] = useState<string | null>(null);
  const [truckBrand, setTruckBrand] = useState<string | null>(null);
  const [rut, setRut] = useState<string | null>(null);

  // Estados para o popup
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [selectedTruckId, setSelectedTruckId] = useState<number | null>(null);

  // Busca os dados para mostrar na tela 
  const loadNamePatente = async () => {
    try {
      const nameAsync = await AsyncStorage.getItem('name');
      const patenteAsync = await AsyncStorage.getItem('patente');
      const truckBrandAsync = await AsyncStorage.getItem('truckBrand');
      const rutAsync = await AsyncStorage.getItem('rut');

      setNome(nameAsync || '');
      setPatente(patenteAsync || '');
      setTruckBrand(truckBrandAsync || '');
      setRut(rutAsync || '');
    } catch (error) {
      console.error('Erro ao carregar nome e patente:', error);
    }
  };

  // Função para mostrar no popUp que possui viagem em aberto
  const fetchMissingData = async () => {
    const missingRows = await getData(); // Busca los viajes no finalizados

    if (missingRows.length > 0) {
      const row = missingRows[0]; // Tomamos solo el primer viaje no finalizado
      console.log("MIUSSING: ", row);
      let message = `🚨 Hay un viaje no finalizado, aquí están sus datos:\nDestino: ${row.destination_location_name}`;

      if (!row.material_destination_code) {
        message += `\nPróxima etapa: Material`;
      } else if (!row.radioactive_status) {
        message += `\nMaterial: ${row.material_destination_name}\nPróxima etapa: Portal Radiactivo`;
      } else if (!row.weight) {
        message += `\nMaterial: ${row.material_destination_name}\nPróxima etapa: Báscula`;
      } else {
        message += `\nMaterial: ${row.material_destination_name}\nPróxima etapa: Destino, confirmar el fin del viaje`;
      }

      message += `\n¿Desea continuar con el viaje?`;

      setPopupMessage(message);
      setSelectedTruckId(row.id); // Almacena el ID del viaje
      setPopupVisible(true); // Muestra el popup
    }
  };

  useEffect(() => {
    fetchMissingData();
    loadNamePatente();
    loadData().then((setoresData) => {
      setSetores(setoresData);
    });
  }, []);

  return (
    <>
      <View>
        <UserHeader name={nome} patente={patente} navigation={navigation} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Puesto de Descarga:</Text>
          <SelectDropdown
            data={setores}
            onSelect={(setor) => {
              setSelectedSetor(setor);
              setErrorMessage(null);
            }}
            renderButton={(selectedItem) => (
              <View style={styles.dropdownButtonStyle}>
                <Text style={styles.dropdownButtonTxtStyle}>
                  {selectedItem || 'Seleccione un sector'}
                </Text>
              </View>
            )}
            renderItem={(item, _, isSelected) => (
              <View
                style={{
                  ...styles.dropdownItemStyle,
                  ...(isSelected && { backgroundColor: '#D2D9DF' }),
                }}
              >
                <Text style={styles.dropdownItemTxtStyle}>{item}</Text>
              </View>
            )}
            showsVerticalScrollIndicator={false}
            dropdownStyle={styles.dropdownMenuStyle}
          />
        </View>
        {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            if (truckBrand && patente && nome && rut) {
              handleStart(truckBrand, patente, rut, nome, selectedSetor, setErrorMessage, navigation);
            }
          }}
        >
          <Text style={styles.buttonText}>Iniciar</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Componente do Popup */}
      <Popup
        visible={popupVisible}
        message={popupMessage}
        buttonMessage1="Sim"
        buttonMessage2="Não"
        onButton1Press={() => {
          if (selectedTruckId !== null) {
            pendingTrip(navigation, selectedTruckId);
          }
          setPopupVisible(false);
        }}
        onButton2Press={() => {
          if (selectedTruckId !== null) {
            deleteTruck(selectedTruckId);
            setErrorMessage("Puede iniciar un nuevo viaje")
          } else {
            console.error("Erro: Nenhum caminhão selecionado.");
          }
          setPopupVisible(false);
        }}
        onClose={() => {
          setPopupVisible(false);
        }}
      />
    </>
  );
}

import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image, ScrollView, Button } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import { StackNavigationProp } from '@react-navigation/stack';

import { styles } from '../styles/DestinationPointScreen.styles';
import { loadData } from '../functions/DestinationPointScreen/loadData';
import { handleStart } from '../functions/DestinationPointScreen/handleStart';
import UserHeader from '../components/userHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type RootStackParamList = {
  DestinationPoint: undefined;
  StartRoute: { truck_id: number };
};

type DestinationPointScreenNavigationProp = StackNavigationProp<RootStackParamList, 'DestinationPoint'>;

type Props = {
  navigation: DestinationPointScreenNavigationProp;
  route: any;
};

export default function DestinationPoint({ navigation, route }: Props) {
  const [selectedSetor, setSelectedSetor] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [setores, setSetores] = useState<string[]>([]);
  const [nome, setNome] = useState<string | null>(null);
  const [patente, setPatente] = useState<string | null>(null);
  const [truckBrand, setTruckBrand] = useState<string | null>(null);
  const [rut, setRut] = useState<string | null>(null);

  const loadNamePatente = async () => {
    try {
      const nameAsync = await AsyncStorage.getItem('name');
      const patenteAsync = await AsyncStorage.getItem('patente');
      const truckBrandAsync = await AsyncStorage.getItem('truckBrand')
      const rutAsync = await AsyncStorage.getItem('rut')
      setNome(nameAsync || "");
      setPatente(patenteAsync || "");
      setTruckBrand(truckBrandAsync || "");
      setRut(rutAsync || "");
    } catch (error) {
      console.error("Erro ao carregar nome e patente:", error);
    }
  };

  useEffect(() => {
    loadNamePatente();
    loadData().then((setoresData) => {
      setSetores(setoresData); // Chama a função e atualiza o estado
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
        <TouchableOpacity style={styles.button} onPress={() => {
          if (truckBrand && patente && nome && rut) {
            handleStart(truckBrand, patente, rut, nome, selectedSetor, setErrorMessage, navigation);
          }
        }} >
          <Text style={styles.buttonText}>Iniciar</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}


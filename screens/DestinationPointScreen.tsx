import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image, ScrollView, Button } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import { StackNavigationProp } from '@react-navigation/stack';

import { styles } from '../styles/DestinationPointScreen.styles';
import { loadData } from '../functions/DestinationPointScreen/loadData';
import { handleStart } from '../functions/DestinationPointScreen/handleStart';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserHeader from '../components/userHeader';

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
  const { truck_id } = route.params;
  const [selectedSetor, setSelectedSetor] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [setores, setSetores] = useState<string[]>([]);
  const [name, setName] = useState<string | null>(null);
  const [patente, setPatente] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const nameAsync = await AsyncStorage.getItem('name');
        const patenteAsync = await AsyncStorage.getItem('patente');
        if (nameAsync) setName(nameAsync);
        if (patenteAsync) setPatente(patenteAsync);
      } catch (error) {
        console.error('Erro ao recuperar dados do AsyncStorage', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    loadData().then((setoresData) => {
      setSetores(setoresData); // Chama a função e atualiza o estado
    });

  }, []);

  return (
    <>
      <View>
        <UserHeader name={name} patente={patente} navigation={navigation} />
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
        <TouchableOpacity style={styles.button} onPress={() => handleStart(selectedSetor, truck_id, setErrorMessage, navigation)} >
          <Text style={styles.buttonText}>Iniciar</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}


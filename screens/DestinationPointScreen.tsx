import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import SelectDropdown from 'react-native-select-dropdown';
import { StackNavigationProp } from '@react-navigation/stack';
import { fetchMovInternos } from '../services/get/destinationPoint';
import fetchDriver from '../services/post/driver_truck';
import { updateDestinationLocation } from '../database/sqliteDatabase';


export type RootStackParamList = {
  DestinationPoint: undefined;
  StartRoute: { truck_id: number }; 
};

type DestinationPointScreenNavigationProp = StackNavigationProp<RootStackParamList, 'DestinationPoint'>;

type Props = {
  navigation: DestinationPointScreenNavigationProp;
  route: any;
};

interface DriverData {
  driver_name: string;
  driver_rut: string;
  plate: string;
  destination_name: string;
  sent?: boolean;
  id?: number;
}

export default function DestinationPoint({ navigation, route }: Props) {
  const { nome_driver, patente, rut_driver, truck_brand, truck_id } = route.params;
  const [selectedSetor, setSelectedSetor] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [setores, setSetores] = useState<string[]>([]);
  
  useEffect(() => {
    const loadJsonData = async () => {
      try {
        const data = await fetchMovInternos();
        const setoresData = data?.map((item: any) => item);
        setSetores(setoresData || []);
      } catch (error) {
        console.error('Erro ao carregar dados do JSON:', error);
      }
    };

    loadJsonData();

  }, []);

  const handleStart = async () => {
    if (!selectedSetor) {
      setErrorMessage('Por favor, seleccione un sector.');
      return;
    }

    setErrorMessage(null);
    const code = selectedSetor.slice(0, 3).toUpperCase(); // .toUpperCase() para garantir que as letras estejam maiúsculas

    updateDestinationLocation(truck_id, code, selectedSetor)
    navigation.navigate('StartRoute', {
      truck_id: truck_id // Passa o ID do caminhão
    });
  };

  return (
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
      <TouchableOpacity style={styles.button} onPress={handleStart}>
        <Text style={styles.buttonText}>Iniciar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F1F1F1',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  inputContainer: {
    width: '90%',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: 'black',
  },
  dropdownButtonStyle: {
    width: '100%',
    height: 50,
    backgroundColor: '#E9ECEF',
    borderRadius: 12,
    borderColor: 'black',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  dropdownButtonTxtStyle: {
    fontSize: 16,
    color: '#151E26',
    textAlign: 'left',
    flex: 1,
  },
  dropdownMenuStyle: {
    backgroundColor: '#E9ECEF',
    borderRadius: 8,
  },
  dropdownItemStyle: {
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  dropdownItemTxtStyle: {
    fontSize: 16,
    color: '#151E26',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#0066cc',
    paddingVertical: 10,
    paddingHorizontal: 160,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
});
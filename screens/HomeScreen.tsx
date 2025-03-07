import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown'; // Importando o SelectDropdown
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importando AsyncStorage

import { getPendingData } from '../database/sqliteDatabase';
import { handleLogin } from '../functions/HomeScreen/login';
import { loadData } from '../functions/HomeScreen/loadData';
import { changeScanCount } from '../functions/HomeScreen/changeScanCount';
import { styles } from '../styles/HomeScreen.styles';
import { saveDataAsync } from '../functions/HomeScreen/saveDataAsync';
import { fetchToken } from '../functions/HomeScreen/verifyLogin';

export type RootStackParamList = {
  Home: undefined; // Home não recebe parâmetros
  DestinationPoint: {
    truck_id: number
  };
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

type Truck = {
  plate: string;
  brand: string;
};

export default function HomeScreen({ navigation }: Props) {
  const [nome, setNome] = useState<string>(''); // Estado para o nome
  const [driverId, setDriverId] = useState<string>(''); // Estado para o driver id
  const [rut, setRut] = useState<string>(''); // Estado para o RUT
  const [patente, setPatente] = useState<string>(''); // Estado para a patente
  const [erro, setErro] = useState<string>(''); // Estado para mensagem de erro
  const [motoristas, setMotoristas] = useState<any[]>([]); // Estado para armazenar motoristas
  const [loading, setLoading] = useState<boolean>(true); // Estado para controlar o carregamento
  const [patentesfetch, setPatentesFetch] = useState<string[]>([]); // Estado para patentes buscadas
  const [brands, setBrands] = useState<{ [key: string]: string }>({}); // Mapeamento patente -> marca
  const [truckBrands, setTruckBrands] = useState<{ [key: string]: string }>({}); // Estado para armazenar mapeamento patente -> marca
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    getPendingData();
    changeScanCount();
    loadData(
      setMotoristas,
      setPatentesFetch,
      setTruckBrands,
      setBrands,
      setErro,
      setLoading
    );
    fetchToken(navigation, setToken); 
  }, []);


  const getDriverId = (name: string) => {
    const driver = motoristas.find((driver) => driver.name === name);
    return driver ? driver.id : '';
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nombre:</Text>
        {loading ? (
          <Text>Cargando conductores...</Text>
        ) : (
          <SelectDropdown
            data={motoristas.map(driver => driver.name)}
            onSelect={(selectedItem) => {
              setNome(selectedItem);
              setDriverId(getDriverId(selectedItem)); // Salva o id do motorista
            }}
            renderButton={(selectedItem) => (
              <View style={styles.dropdownButtonStyle}>
                <Text style={styles.dropdownButtonTxtStyle}>
                  {selectedItem || 'Seleccione su nombre'}
                </Text>
              </View>
            )}
            renderItem={(item, index, isSelected) => (
              <View style={{ ...styles.dropdownItemStyle, ...(isSelected && { backgroundColor: '#D2D9DF' }) }}>
                <Text style={styles.dropdownItemTxtStyle}>{item}</Text>
              </View>
            )}
            dropdownStyle={styles.dropdownMenuStyle}
          />
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>RUT:</Text>
        <TextInput
          style={styles.input}
          onChangeText={setRut}
          value={rut}
          placeholder="Digite su RUT"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Patente:</Text>
        {loading ? (
          <Text>Cargando patentes...</Text>
        ) : (
          <SelectDropdown
            data={patentesfetch}
            onSelect={(selectedItem) => setPatente(selectedItem)}
            renderButton={(selectedItem) => (
              <View style={styles.dropdownButtonStyle}>
                <Text style={styles.dropdownButtonTxtStyle}>
                  {selectedItem || 'Seleccione su patente'}
                </Text>
              </View>
            )}
            renderItem={(item, index, isSelected) => (
              <View style={{ ...styles.dropdownItemStyle, ...(isSelected && { backgroundColor: '#D2D9DF' }) }}>
                <Text style={styles.dropdownItemTxtStyle}>{item}</Text>
              </View>
            )}
            dropdownStyle={styles.dropdownMenuStyle}
          />
        )}
      </View>

      {erro ? <Text style={styles.error}>{erro}</Text> : null}

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          handleLogin(nome, driverId, rut, patente, motoristas, truckBrands, setErro, navigation);
        }}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
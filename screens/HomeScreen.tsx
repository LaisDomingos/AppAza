/*import React, { useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';

const App = () => {
  const [nome, setNome] = useState('');
  const [caminhao, setCaminhao] = useState('');

  // Dados estáticos
  const motoristasData = [
    { id: '1', name: 'João Silva' },
    { id: '2', name: 'Maria Oliveira' },
    { id: '3', name: 'Carlos Souza' },
  ];

  const truckData = [
    { id: '1', name: 'Caminhão A' },
    { id: '2', name: 'Caminhão B' },
    { id: '3', name: 'Caminhão C' },
  ];

  return (
    <View style={styles.container}>
      <SelectDropdown
        data={motoristasData.map(driver => driver.name)} // Mapeando os nomes dos motoristas
        onSelect={(selectedItem) => setNome(selectedItem)}
        renderButton={(selectedItem) => (
          <View style={styles.dropdownButtonStyle}>
            <Text style={styles.dropdownButtonTxtStyle}>
              {selectedItem || 'Selecione o motorista'}
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

      <SelectDropdown
        data={truckData.map(truck => truck.name)} // Mapeando os nomes dos caminhões
        onSelect={(selectedItem) => setCaminhao(selectedItem)}
        renderButton={(selectedItem) => (
          <View style={styles.dropdownButtonStyle}>
            <Text style={styles.dropdownButtonTxtStyle}>
              {selectedItem || 'Selecione o caminhão'}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownButtonStyle: {
    width: 300,
    height: 40,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    justifyContent: 'center',
    paddingLeft: 10,
  },
  dropdownButtonTxtStyle: {
    fontSize: 16,
    color: '#333',
  },
  dropdownItemStyle: {
    padding: 10,
  },
  dropdownItemTxtStyle: {
    fontSize: 16,
    color: '#333',
  },
  dropdownMenuStyle: {
    width: 300,
  },
});

export default App;*/


import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown'; // Importando o SelectDropdown
import { StackNavigationProp } from '@react-navigation/stack';

import {  getPendingData } from '../database/sqliteDatabase';
import { handleLogin } from '../functions/HomeScreen/login';
import { loadData } from '../functions/HomeScreen/loadData';
import { changeScanCount } from '../functions/HomeScreen/changeScanCount';
import { styles } from '../styles/HomeScreen.styles';

export type RootStackParamList = {
  Home: undefined; // Home não recebe parâmetros
  DestinationPoint: {
    nome_driver: string;
    patente: string;
    rut_driver: string;
    truck_brand: string;
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
  const [rut, setRut] = useState<string>(''); // Estado para o RUT
  const [patente, setPatente] = useState<string>(''); // Estado para a patente
  const [erro, setErro] = useState<string>(''); // Estado para mensagem de erro
  const [motoristas, setMotoristas] = useState<any[]>([]); // Estado para armazenar motoristas
  const [loading, setLoading] = useState<boolean>(true); // Estado para controlar o carregamento
  const [patentesfetch, setPatentesFetch] = useState<string[]>([]); // Estado para patentes buscadas
  const [brands, setBrands] = useState<{ [key: string]: string }>({}); // Mapeamento patente -> marca
  const [truckBrands, setTruckBrands] = useState<{ [key: string]: string }>({}); // Estado para armazenar mapeamento patente -> marca

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
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nombre:</Text>
        {loading ? (
          <Text>Cargando conductores...</Text>
        ) : (
          /* SelectDropdown para exibir os motoristas */
          <SelectDropdown
            data={motoristas.map(driver => driver.name)}
            onSelect={(selectedItem) => setNome(selectedItem)}
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
        {/* Input para RUT */}
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
          /* SelectDropdown para exibir as patentes */
          <SelectDropdown
            data={patentesfetch} // Usando as patentes buscadas
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

      <TouchableOpacity style={styles.button} onPress={() => handleLogin(nome, rut, patente, motoristas, truckBrands, setErro, navigation)}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}



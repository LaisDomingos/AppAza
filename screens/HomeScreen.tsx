import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown'; // Importando o SelectDropdown
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';

import { fetchDrivers } from '../services/get/driver'; // Importe a função que busca os motoristas
import { fetchTrucks } from '../services/get/truck'; // Importando a função que busca os caminhões

export type RootStackParamList = {
  Home: undefined; // Home não recebe parâmetros
  DestinationPoint: { nome_driver: string; patente: string }; 
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

type Truck = {
  plate: string; // Adicione outras propriedades, se existirem
};

export default function HomeScreen({ navigation }: Props) {
  const [nome, setNome] = useState<string>(''); // Estado para o nome
  const [rut, setRut] = useState<string>('');
  const [patente, setPatente] = useState<string>('');
  const [erro, setErro] = useState<string>(''); // Estado para mensagem de erro
  const [motoristas, setMotoristas] = useState<any[]>([]); // Estado para armazenar motoristas
  const [loading, setLoading] = useState<boolean>(true); // Estado para controlar o carregamento
  const [patentesfetch, setPatentesFetch] = useState<string[]>([]); // Estado para patentes buscadas

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
  
      try {
        // Primeiro, tentar carregar os dados salvos no dispositivo
        const savedDrivers = await AsyncStorage.getItem('drivers');
        const savedTrucks = await AsyncStorage.getItem('trucks');
  
        if (savedDrivers && savedTrucks) {
          setMotoristas(JSON.parse(savedDrivers));
          setPatentesFetch(JSON.parse(savedTrucks));
        }
  
        // Depois, tentar buscar os dados mais atualizados da API
        const drivers = await fetchDrivers();
        const trucks = await fetchTrucks();
  
        setMotoristas(drivers);
        setPatentesFetch(trucks.map((truck: Truck) => truck.plate));
  
        // Salvar os novos dados localmente
        await AsyncStorage.setItem('drivers', JSON.stringify(drivers));
        await AsyncStorage.setItem('trucks', JSON.stringify(trucks.map((truck: Truck) => truck.plate)));
      } catch (error) {
        console.error('Erro ao buscar dados da API:', error);
  
        if (!motoristas.length || !patentesfetch.length) {
          setErro('Error al cargar los datos.');
        }
      } finally {
        setLoading(false);
      }
    };
  
    loadData();
  }, []);
  
  const handleLogin = () => {
    if (!nome || !rut || !patente) {
      setErro('Por favor, complete todos los campos obligatorios.');
      return;
    }

    const motoristaSelecionado = motoristas.find(driver => driver.name === nome);

    if (!motoristaSelecionado) {
      setErro('Conductor no encontrado.');
      return;
    }

    if (motoristaSelecionado.rutNumber !== rut) {
      setErro('RUT incorrecto para el conductor seleccionado.');
      return;
    }

    setErro('');
    console.log('Login bem-sucedido', nome, rut, patente);
    navigation.navigate('DestinationPoint', {
      nome_driver: nome,
      patente: patente,
    });
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

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
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
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  input: {
    height: 40,
    backgroundColor: '#E9ECEF',
    borderRadius: 12,
    borderColor: 'black',
    width: '100%',
    paddingLeft: 10,
    color: 'black',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: 'black',
  },
  button: {
    backgroundColor: '#0066cc',
    paddingVertical: 10,
    paddingHorizontal: 160,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  error: {
    marginTop: 20,
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  dropdownButtonStyle: {
    width: '100%',
    height: 50,
    backgroundColor: '#E9ECEF',
    borderRadius: 12,
    borderColor: 'black',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: '#151E26',
  },
  dropdownMenuStyle: {
    backgroundColor: '#E9ECEF',
    borderRadius: 8,
  },
  dropdownItemStyle: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: '#151E26',
  },
});
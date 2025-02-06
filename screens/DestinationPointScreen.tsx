import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import SelectDropdown from 'react-native-select-dropdown';
import { StackNavigationProp } from '@react-navigation/stack';
import { fetchMovInternos } from '../services/get/destinationPoint';
import fetchDriver from '../services/post/driver_truck';
import { getPendingData, insertData, markAsSent } from '../database/sqliteDatabase';


export type RootStackParamList = {
  StartRoute: undefined;
  DestinationPoint: undefined;
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'DestinationPoint'>;

type Props = {
  navigation: HomeScreenNavigationProp;
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
  const { nome_driver, patente, rut_driver, truck_brand } = route.params;
  console.log("brand recebida: ", route.params)
  const [selectedSetor, setSelectedSetor] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [setores, setSetores] = useState<string[]>([]);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected) {
        console.log('Conexão restaurada! Tentando enviar dados pendentes...');
        sendSavedData();
      }
    });
  
    // Verifica se há dados salvos quando o componente monta
    sendSavedData();
  
    return () => {
      unsubscribe(); // Remove o listener quando o componente desmonta
    };
  }, []);
  
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

    // Monitorando a conectividade
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected) {
        sendSavedData(); // Tenta enviar dados quando a conexão for restaurada
      }
    });

    // Verifica se há dados salvos quando o componente monta
    sendSavedData();

    return () => {
      unsubscribe(); // Limpa o ouvinte ao desmontar o componente
    };
  }, []);

  const saveDataLocally = async (data: DriverData) => {
    try {
      // Salva no SQLite se não houver conexão
      await insertData(data.driver_name, data.driver_rut, data.plate, data.destination_name);
      console.log('Dados salvos no SQLite (sem internet).');
    } catch (error) {
      console.error('Erro ao salvar dados no SQLite:', error);
    }
  };

  let isSyncing = false; // Variável global para evitar múltiplas execuções

  const sendSavedData = async () => {
    if (isSyncing) {
      console.log('🔄 Sincronização já em andamento, evitando chamadas duplicadas.');
      return;
    }
  
    isSyncing = true; // Bloqueia chamadas simultâneas
  
    try {
      const networkState = await NetInfo.fetch();
      if (!networkState.isConnected) {
        console.log('📴 Sem conexão, aguardando para enviar os dados...');
        isSyncing = false;
        return; // Para a execução se não há internet
      }
  
      const pendingData = await getPendingData();
      if (pendingData.length === 0) {
        console.log('✅ Nenhum dado pendente para enviar.');
        isSyncing = false;
        return;
      }
  
      for (const item of pendingData) {
        try {
          if (!item.sent && item.id !== undefined) {
            await fetchDriver(item); // Envia para a API
            console.log('📡 Dados enviados com sucesso:', item);
  
            await markAsSent(item.id); // Marca como enviado
          }
        } catch (error) {
          console.error('❌ Erro ao enviar dados:', error);
        }
      }
    } finally {
      isSyncing = false; // Libera a execução para a próxima vez
    }
  };
  

  const handleStart = async () => {
    if (!selectedSetor) {
      setErrorMessage('Por favor, seleccione un sector.');
      return;
    }

    setErrorMessage(null);
    console.log('Setor selecionado:', selectedSetor);

    const driverData = {
      driver_name: nome_driver,
      plate: patente,
      driver_rut: rut_driver,
      destination_name: selectedSetor,
    };

    try {
      const networkState = await NetInfo.fetch();
      if (networkState.isConnected) {
        console.log("Conectado");
        // Envia os dados diretamente ao servidor
        await fetchDriver(driverData);
        console.log('Dados enviados ao servidor:', driverData);
      } else {
        console.log("Sem conexão");
        // Salva os dados no SQLite se não houver conexão
        await saveDataLocally(driverData);
        console.log('Dados salvos no SQLite (sem internet).');
      }

      navigation.navigate('StartRoute');
    } catch (error) {
      console.error('Erro ao processar motorista:', error);
    }
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
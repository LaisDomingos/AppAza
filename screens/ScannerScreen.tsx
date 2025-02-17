import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchTruckByTag } from '../services/get/tag';
import { StackNavigationProp } from '@react-navigation/stack';
import { TruckData, updateRadioactiveStatus, updateTruckDetails, getPendingData, markAsSent } from '../database/sqliteDatabase';
import fetchDriver from '../services/post/driver_truck';
import NetInfo from '@react-native-community/netinfo';
import { saveLocations, setupDatabase } from '../database/location';

export type RootStackParamList = {
  Scanner: undefined;
  StartRoute: { truck_id: number };
};

type ScannerScreenNavigationProp = StackNavigationProp<RootStackParamList, 'StartRoute'>;

type Props = {
  navigation: ScannerScreenNavigationProp;
  route: any;
};

const tags = [
  '2fnoou7igp2gh7h3',
  'xg8yuklldnx7ez6f',
  'fyau3gdxxsos9h3m',
  '2gyvmjgbb4g1u5nl',
  'wxkzfyq5blznmkcn',
  'nekqafsjasvq5r0s'
];

export default function ScannerScreen({ navigation, route }: Props) {
  const { truck_id } = route.params;
  const [scanCount, setScanCount] = useState(0);
  const [trySent, setTrySent] = useState(false);
  // Carrega o contador salvo ao iniciar
  useEffect(() => {
    setupDatabase();
    const loadScanCount = async () => {
      const savedCount = await AsyncStorage.getItem('scanCount');
      if (savedCount) {
        setScanCount(parseInt(savedCount, 10));
      }
    };
    loadScanCount();

  }, []);

  //Permissão para a pegar a localização
  async function requestLocationPermission() {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Permiso de ubicación',
            message: 'Esta aplicación necesita acceder a su ubicación.',
            buttonNeutral: 'Preguntar después',
            buttonNegative: 'Cancelar',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  }

  //Pega a localização
  async function getLocationAndScan() {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      Alert.alert('Erro', 'Permiso de ubicación no concedido.');
      return;
    }

    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        //console.log('Localização capturada: ', { latitude, longitude });
        readNdef();
      },
      error => {
        console.warn('Erro ao obter localização:', error);
        Alert.alert('Erro', 'No se pudo obtener la ubicación.');
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      }
    );
  }
  // Enviar dados pendentes
  async function sendPendingData() {

    const trucks = await getPendingData();
    if (trucks.length === 0) {
      console.log("Nenhum dado pendente para enviar.");
    }
    let success = false;

    for (const truck of trucks) {
      const result = await sendDriverData(truck); // Tenta enviar os dados do motorista
      if (result) {
        success = true; // Marca sucesso se pelo menos um envio funcionar
        break; // Interrompe o loop ao encontrar sucesso
      }
    }

    return success; // Retorna o status final (true ou false)

  }

  // Envia os dados do motorista
  async function sendDriverData(truck: TruckData): Promise<boolean> {
    const response = await fetchDriver({
      unidad: truck.unidad,
      supplier_name: truck.supplier_name,
      supplier_rut: truck.supplier_rut,
      truck_brand: truck.truck_brand,
      plate: truck.plate,
      radioactive_status: truck.radioactive_status,
      date_time: truck.date_time,
      driver_rut: truck.driver_rut,
      driver_name: truck.driver_name,
      material_destination_name: truck.material_destination_name,
      material_destination_code: truck.material_destination_code,
      version_name: truck.version_name,
      version_code: truck.version_code,
      material_origen_name: truck.material_origen_name,
      material_origen_code: truck.material_origen_code,
      destination_location_code: truck.destination_location_code,
      destination_location_name: truck.destination_location_name,
    });

    if (response) {
      markAsSent(truck.id); // Marca como enviado se a resposta for bem-sucedida
      return true;
    } else {
      console.error("Falha ao criar motorista, sem resposta.");
      return false;
    }

  }

  /*/ Faz a leitura "falsa" do NFC
  async function readNdef() {
    try {
      const newCount = scanCount + 1;
      setScanCount(newCount);
      await AsyncStorage.setItem('scanCount', newCount.toString());

      if (newCount === 1) {
        /*const randomTag = tags[Math.floor(Math.random() * tags.length)];
        const tagData = await fetchTruckByTag(randomTag);
        updateTruckDetails(
          truck_id,
          tagData.description,
          tagData.code,
          "",
          "",
          tagData.process[0].description,
          tagData.process[0].code
        );

        if (tagData?.description) {
          Alert.alert('Material', `Material: ${tagData.description}`, [
            {
              text: 'OK',
              onPress: () => {
                setTimeout(() => {
                  navigation.navigate('StartRoute', { truck_id });
                }, 500);
              },
            },
          ]);
        } else {
          Alert.alert('Erro', 'Não foi possível encontrar o material para essa tag.');
        }*/
  /*updateTruckDetails(
  truck_id,
  "CONSUMO-CHATARRA BOLAS",
  "56000523",
  "",
  "",
  "CLASIFICACION",
  "V001"
);
Alert.alert('Material', `Material: CONSUMO-CHATARRA BOLAS`, [
  {
    text: 'OK',
    onPress: () => {
      setTimeout(() => {
        navigation.navigate('StartRoute', { truck_id });
      }, 500);
    },
  },
]);

} else if (newCount === 2) {
updateRadioactiveStatus(truck_id, true);
sendPendingData();
Alert.alert('Portal radioativo', `El conductor pasó por el portal radiactivo.`, [
  {
    text: 'OK',
    onPress: () => {
      setTimeout(() => {
        navigation.navigate('StartRoute', { truck_id });
      }, 500);
    },
  },
]);
} else if (newCount === 3) {
const state = await NetInfo.fetch();
if (state.isConnected) {
  const pendingDataExists = await getPendingData();
  if (pendingDataExists.length === 0) {
    console.log("Nenhum dado pendente para enviar.");
    Alert.alert('Erro', 'Nenhum dado pendente para envio.');
    return; // Interrompe o fluxo
  } else {
    const success = await sendPendingData(); // Tenta enviar dados pendentes
    if (success) {
      Alert.alert('Sucesso', 'Dados enviados com sucesso!', [
        {
          text: 'OK',
          onPress: () => {
            setTimeout(() => {
              navigation.navigate('StartRoute', { truck_id });
            }, 500);
          },
        },
      ]);
    } else {
      Alert.alert('Erro', 'Não foi possível enviar os dados. Tente novamente.');
    }
  }
} else {
  Alert.alert('Erro', 'Sem conexão com a internet.');
}
}
} catch (ex) {
console.error("Erro no readNdef:", ex);
Alert.alert('Erro', 'Erro ao ler o RFID');
}
}*/
  async function readNdef() {
    try {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        Alert.alert('Erro', 'Permissão de localização não concedida.');
        return;
      }

      Geolocation.getCurrentPosition(
        async position => {
          const { latitude, longitude } = position.coords;

          const newCount = scanCount + 1;
          setScanCount(newCount);
          await AsyncStorage.setItem('scanCount', newCount.toString());

          if (newCount === 1) {
            const randomTag = tags[Math.floor(Math.random() * tags.length)];
            saveLocations([
              {
                latitude: latitude.toString(),
                longitude: longitude.toString(),
                tag: randomTag,
                material: 'Material especificado',
              },
            ]);

            updateTruckDetails(
              truck_id,
              'CONSUMO-CHATARRA BOLAS',
              '56000523',
              '',
              '',
              'CLASIFICACION',
              'V001'
            );

            Alert.alert('Material', `Material: CONSUMO-CHATARRA BOLAS`, [
              {
                text: 'OK',
                onPress: () => {
                  setTimeout(() => {
                    navigation.navigate('StartRoute', { truck_id });
                  }, 500);
                },
              },
            ]);
          } else if (newCount === 2) {
            saveLocations([
              {
                latitude: latitude.toString(),
                longitude: longitude.toString(),
                tag: 'Tag radioativa',
                material: 'radioativo',
              },
            ]);

            updateRadioactiveStatus(truck_id, true);
            sendPendingData();

            Alert.alert('Portal radioativo', `El conductor pasó por el portal radiactivo.`, [
              {
                text: 'OK',
                onPress: () => {
                  setTimeout(() => {
                    navigation.navigate('StartRoute', { truck_id });
                  }, 500);
                },
              },
            ]);
          } else if (newCount === 3) {
            saveLocations([
              {
                latitude: latitude.toString(),
                longitude: longitude.toString(),
                tag: 'Tag pesagem',
                material: 'pesagem',
              },
            ]);

            const state = await NetInfo.fetch();
            if (state.isConnected) {
              const pendingDataExists = await getPendingData();
              if (pendingDataExists.length === 0) {
                Alert.alert('Erro', 'Nenhum dado pendente para envio.');
                return;
              } else {
                const success = await sendPendingData();
                if (success) {
                  Alert.alert('Sucesso', 'Dados enviados com sucesso!', [
                    {
                      text: 'OK',
                      onPress: () => {
                        setTimeout(() => {
                          navigation.navigate('StartRoute', { truck_id });
                        }, 500);
                      },
                    },
                  ]);
                } else {
                  Alert.alert('Erro', 'Não foi possível enviar os dados. Tente novamente.');
                }
              }
            } else {
              Alert.alert('Erro', 'Sem conexão com a internet.');
            }
          }
        },
        error => {
          console.warn('Erro ao obter localização:', error);
          Alert.alert('Erro', 'Não foi possível obter a localização.');
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        }
      );
    } catch (ex) {
      console.error('Erro no readNdef:', ex);
      Alert.alert('Erro', 'Erro ao ler o RFID');
    }
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.iconContainer}>
        <Image
          source={require('../assets/nfc-phone.png')}
          style={styles.phoneImage}
        />
      </View>

      <Text style={styles.title}>Escáner NFC</Text>

      <TouchableOpacity style={styles.button} onPress={getLocationAndScan}>
        <Text style={styles.buttonText}>
          {scanCount === 0 && 'Escanear material'}
          {scanCount === 1 && 'Escanear portal radioativo'}
          {scanCount >= 2 && 'Escanear pesagem'}
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  iconContainer: {
    marginBottom: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  phoneImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  scanCount: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#0066cc',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
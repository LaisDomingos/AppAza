import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchTruckByTag } from '../services/get/tag';
import { StackNavigationProp } from '@react-navigation/stack';
import { updateRadioactiveStatus, updateTruckDetails } from '../database/sqliteDatabase';

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

  // Carrega o contador salvo ao iniciar
  useEffect(() => {
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
        console.log('Localização capturada: ', { latitude, longitude });
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

  //Faz a leitura "falsa" do NFC
  async function readNdef() {
    try {
      const newCount = scanCount + 1;
      setScanCount(newCount);
      await AsyncStorage.setItem('scanCount', newCount.toString());
  
      if (newCount === 1) {
        // Primeiro scan: busca material
        const randomTag = tags[Math.floor(Math.random() * tags.length)];
        
        const tagData = await fetchTruckByTag(randomTag);
        updateTruckDetails(
          truck_id, 
          tagData.description, 
          tagData.code, 
          "", 
          "", 
          tagData.process[0].description, 
          tagData.process[0].code 
        )
        if (tagData?.description) {
          Alert.alert('Material', `Material: ${tagData.description}`, [
            {
              text: 'OK',
              onPress: () => {
                setTimeout(() => {
                  navigation.navigate('StartRoute', { truck_id });
                }, 1000);
              },
            },
          ]);
        } else {
          Alert.alert('Erro', 'Não foi possível encontrar o material para essa tag.');
        }
      } else if (newCount === 2) {
        updateRadioactiveStatus(truck_id, true)
        // Segundo scan: mostra alerta "Portal radioativo true"
        Alert.alert('Portal radiactivo', `El conductor pasó por el portal radiactivo.`, [
          {
            text: 'OK',
            onPress: () => {
              setTimeout(() => {
                navigation.navigate('StartRoute', { truck_id });
              }, 1000);
            },
          },
        ]);
      }
    } catch (ex) {
      console.warn('Erro ao ler a tag:', ex);
      Alert.alert('Erro', 'Ocorrió un error al intentar leer la etiqueta NFC.');
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
        <Text style={styles.buttonText}>Escanear la etiqueta</Text>
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

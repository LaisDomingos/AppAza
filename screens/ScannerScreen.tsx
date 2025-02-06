import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid } from 'react-native'; // Para permissões no Android
import { fetchTruckByTag } from '../services/get/tag'; // Importe a função que você criou para buscar a tag específica
import { StackNavigationProp } from '@react-navigation/stack';
export type RootStackParamList = {
  Scanner: undefined;
  StartRoute: undefined;
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'StartRoute'>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

const tags = [
  '2fnoou7igp2gh7h3',
  'xg8yuklldnx7ez6f',
  'fyau3gdxxsos9h3m',
  '2gyvmjgbb4g1u5nl',
  'wxkzfyq5blznmkcn',
];

export default function ScannerScreen({ navigation }: Props) {

  // Função para solicitar permissões de localização no Android
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

  // Função principal para obter a localização e escanear a tag NFC
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

        // Após capturar a localização, execute o scanner
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

  // Função de leitura da tag NFC
  async function readNdef() {
    try {
      // Seleciona aleatoriamente uma tag
      const randomTag = tags[Math.floor(Math.random() * tags.length)];

      console.warn('Tag selecionada:', randomTag);

      // Chama a função para buscar a tag
      const tagData = await fetchTruckByTag(randomTag);
      console.log(tagData)
      if (tagData?.material) {
        Alert.alert('Material da Tag', `Material: ${tagData.material}`, [
          {
            text: 'OK',
            onPress: () => {
              setTimeout(() => {
                navigation.navigate('StartRoute');
              }, 1000);
            },
          },
        ]);
      } else {
        Alert.alert('Erro', 'Não foi possível encontrar o material para essa tag.');
      }
    } catch (ex) {
      console.warn('Erro ao ler a tag:', ex);
      Alert.alert('Erro', 'Ocurrió un error al intentar leer la etiqueta NFC.');
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

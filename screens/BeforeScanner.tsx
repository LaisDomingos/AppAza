import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import NfcManager, { NfcTech } from 'react-native-nfc-manager';
import Geolocation from '@react-native-community/geolocation';
<<<<<<< HEAD
import { styles } from '../styles/Scanner.styles';
import { sendLocationToApi } from '../services/post/location';
=======
import { sendLocation } from '../services/post/location';
import { resendLocations } from '../functions/Scanner/resendLocation';
import { getLocations, saveLocations, setupDatabase } from '../database/location';

>>>>>>> b07abd4bbade608f1284c3bf1d9fbc46e18be652
NfcManager.start();

function BeforeScanner() {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    setupDatabase();
    // getLocations();
    resendLocations();
  })
  async function readNdef() {

    // Chama a função para obter a localização quando o NFC for lido
    getLocation();
    
    sendLocationToApi("5666","longitude","45678", "desc1")
    try {
      console.log('Tentando ler tag...');

      console.log('Cancelando requisição antiga...');
      await NfcManager.cancelTechnologyRequest();

      await NfcManager.requestTechnology([NfcTech.Ndef, NfcTech.NfcA, NfcTech.NfcB]);

      const tag = await NfcManager.getTag();
      console.log('Tag completa:', tag);

      if (tag?.id) {
        const cardNumber = tag.id;
        Alert.alert('Cartão Lido', `Número do cartão (RFID): ${cardNumber}`);
      } else {
        Alert.alert('Erro', 'Não foi possível encontrar o número do cartão.');
      }
    } catch (ex) {
      console.warn('Erro ao ler a tag:', ex);
      Alert.alert('Erro', 'Ocorreu um erro ao tentar ler a tag NFC.');
    } finally {
      console.log('Cancelando requisição ativa (final)');
      await NfcManager.cancelTechnologyRequest();
    }
  }

  // Função separada para pegar a geolocalização
  function getLocation() {
    Geolocation.getCurrentPosition(
<<<<<<< HEAD
      position => {
        const { latitude, longitude } = position.coords;
        console.log('Localização:', latitude, longitude);
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
=======
        position => {
          const { latitude, longitude } = position.coords;
          sendLocation(latitude, longitude, "890190", "Tag Two").catch((error) => {
            console.warn('Erro ao enviar localização:', error);
            
            // Em caso de erro ao enviar a localização, salva localmente
            saveLocations([{ latitude, longitude, tag: "890190", descricao: "Tag Two", sent: 0 }]);
          });
        },
        error => {
          console.warn('Erro ao obter localização:', error);
          Alert.alert('Erro', 'Não foi possível obter a localização.');
        },
        {
          enableHighAccuracy: false,
          timeout: 15000,
          maximumAge: 10000,
        }
      );
>>>>>>> b07abd4bbade608f1284c3bf1d9fbc46e18be652
  }



  return (
    <View style={styles.wrapper}>
      <View style={styles.iconContainer}>
        <Image
          source={require('../assets/nfc-phone.png')}
          style={styles.phoneImage}
        />
      </View>

      <Text style={styles.title}>NFC Scanner</Text>

      <TouchableOpacity style={styles.button} onPress={getLocation}>
        <Text style={styles.buttonText}>Scan a Tag</Text>
      </TouchableOpacity>
    </View>
  );
}



export default BeforeScanner;

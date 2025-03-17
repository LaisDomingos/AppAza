import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import NfcManager, { NfcTech } from 'react-native-nfc-manager';
import Geolocation from '@react-native-community/geolocation';
import { styles } from '../styles/Scanner.styles';
import { sendLocationToApi } from '../services/post/location';
NfcManager.start();

function BeforeScanner() {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    async function checkNFC() {
      const isSupported = await NfcManager.isSupported();
      console.log('NFC Suportado:', isSupported);

      const isEnabled = await NfcManager.isEnabled();
      console.log('NFC Ativado:', isEnabled);

      if (!isEnabled) {
        Alert.alert('Atenção', 'O NFC está desligado');
      }
    }

    checkNFC();
  }, []);

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

      <TouchableOpacity style={styles.button} onPress={readNdef}>
        <Text style={styles.buttonText}>Scan a Tag</Text>
      </TouchableOpacity>
    </View>
  );
}



export default BeforeScanner;

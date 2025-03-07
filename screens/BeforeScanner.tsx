import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import NfcManager, { NfcTech } from 'react-native-nfc-manager';

NfcManager.start();

function BeforeScanner() {
  
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

export default BeforeScanner;

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import NfcManager, { NfcTech } from 'react-native-nfc-manager';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Certifique-se de que react-native-vector-icons esteja instalado

// Pre-step, call this before any NFC operations
NfcManager.start();

function ScannerScreen() {
  async function readNdef() {
    try {
      // register for the NFC tag with NDEF in it
      await NfcManager.requestTechnology(NfcTech.Ndef);
      // the resolved tag object will contain `ndefMessage` property
      const tag = await NfcManager.getTag();
      console.warn('Tag found', tag);
    } catch (ex) {
      console.warn('Oops!', ex);
    } finally {
      // stop the nfc scanning
      NfcManager.cancelTechnologyRequest();
    }
  }

  return (
    <View style={styles.wrapper}>
      {/* Icone representando o celular se aproximando do Wi-Fi */}
      <View style={styles.iconContainer}>
        <Icon name="wifi" size={80} color="#0066cc" style={styles.wifiIcon} />
        <Image
          source={require('../assets/nfc-phone.png')} // Substitua pelo caminho correto da imagem de um celular
          style={styles.phoneIcon}
        />
      </View>

      {/* Título */}
      <Text style={styles.title}>NFC Scanner</Text>

      {/* Botão estilizado */}
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
    backgroundColor: '#f8f9fa', // Fundo claro para contraste
  },
  iconContainer: {
    marginBottom: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wifiIcon: {
    position: 'absolute',
    top: 20,
  },
  phoneIcon: {
    width: 100,
    height: 100,
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
    elevation: 5, // Para sombras no Android
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default ScannerScreen;

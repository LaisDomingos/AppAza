import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import NfcManager, { NfcTech } from 'react-native-nfc-manager';

import { resendLocations } from '../functions/Scanner/resendLocation';
import { setupDatabase } from '../database/location';
import { styles } from '../styles/Scanner.styles';
import { readNFC } from '../functions/Scanner/readNFC';

NfcManager.start();

function ScannerScreen() {

  useEffect(() => {
    setupDatabase();
    resendLocations();
  })

  return (
    <View style={styles.wrapper}>
      <View style={styles.iconContainer}>
        <Image
          source={require('../assets/nfc-phone.png')}
          style={styles.phoneImage}
        />
      </View>

      <Text style={styles.title}>NFC Scanner</Text>

      <TouchableOpacity style={styles.button} onPress={readNFC}>
        <Text style={styles.buttonText}>Scan a Tag</Text>
      </TouchableOpacity>
    </View>
  );
}

export default ScannerScreen;
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { setupDatabase } from '../database/location';
import { styles } from '../styles/ScannerScreen';

import { getLocationScan } from '../functions/ScannerScreen/getLocationScan';
import { readNfc } from '../functions/ScannerScreen/readNfc';

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

  async function handleGetLocationScanPress() {
    await getLocationScan(() => readNfc(scanCount, setScanCount, truck_id, navigation)); 
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

      <TouchableOpacity style={styles.button} onPress={handleGetLocationScanPress}>
        <Text style={styles.buttonText}>
          {scanCount === 0 && 'Escanear material'}
          {scanCount === 1 && 'Escanear portal radioativo'}
          {scanCount >= 2 && 'Escanear pesagem'}
        </Text>
      </TouchableOpacity>

    </View>
  );
}

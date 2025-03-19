import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import NfcManager, { NfcTech } from 'react-native-nfc-manager';

import { resendLocations } from '../functions/Scanner/resendLocation';
import { setupDatabase } from '../database/location';
import { styles } from '../styles/Scanner.styles';
import { readNFC } from '../functions/Scanner/readNFC';
import { StackNavigationProp } from '@react-navigation/stack';
import PopupJustify from '../components/popUpJustify';

export type RootStackParamList = {
  StartRoute: undefined;
  Scanner: {
    truck_id: number
  };
};

type ScannerScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Scanner'>;

type Props = {
  navigation: ScannerScreenNavigationProp;
  route: any;
};
NfcManager.start();

function ScannerScreen({ navigation, route }: Props) {
  const { truck_id } = route.params;
  // 1️⃣ Criamos um estado para controlar o popup
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const showPopup = (message: string) => {
    setPopupMessage(message);
    setPopupVisible(true);
  };

  const closePopup = () => {
    setPopupVisible(false);
  };

  console.log("truck: ", truck_id)
  useEffect(() => {
    setupDatabase();
    resendLocations();
  })

  return (
    <>
    <View style={styles.wrapper}>
      <View style={styles.iconContainer}>
        <Image
          source={require('../assets/nfc-phone.png')}
          style={styles.phoneImage}
        />
      </View>

      <Text style={styles.title}>NFC Scanner</Text>

      <TouchableOpacity style={styles.button} onPress={() => readNFC(truck_id, showPopup, navigation)}>
        <Text style={styles.buttonText}>Scan a Tag</Text>
      </TouchableOpacity>
    </View>
    <PopupJustify
        visible={isPopupVisible}
        message={popupMessage}
        buttonMessage1="OK"
        buttonMessage2="Cancelar"
        onButton1Press={() => {
          console.log("Justificativa enviada");
          closePopup();
        }}
        onButton2Press={closePopup}
        onClose={closePopup}
        truck_id={truck_id}
      />
    </>
  );
}

export default ScannerScreen;
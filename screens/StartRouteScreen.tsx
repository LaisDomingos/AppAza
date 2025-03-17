import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../styles/StartRouteScreen.styles';
import UserHeader from '../components/userHeader';

export type RootStackParamList = {
  StartRoute: undefined;
  Scanner: { truck_id: number };
  BeforeScanner: undefined;
};

type StartRouteScreenNavigationProp = StackNavigationProp<RootStackParamList, 'StartRoute'>;

type Props = {
  navigation: StartRouteScreenNavigationProp;
  route: any;
};

export default function StartRouteScreen({ navigation, route }: Props) {
  const [name, setName] = useState<string | null>(null);
  const [patente, setPatente] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const nameAsync = await AsyncStorage.getItem('name');
        const patenteAsync = await AsyncStorage.getItem('patente');
        if (nameAsync) setName(nameAsync);
        if (patenteAsync) setPatente(patenteAsync);
      } catch (error) {
        console.error('Erro ao recuperar dados do AsyncStorage', error);
      }
    };

    fetchData();
  }, []);

  const handleStartRoute = () => {
    /*navigation.navigate('Scanner', {
      truck_id: truck_id
    });*/

    navigation.navigate('BeforeScanner')
  };

  return (
    <>
      <View>
        <UserHeader name={name} patente={patente} navigation={navigation} />
      </View>
      <View style={styles.container}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <Text style={styles.title}>Inicio del trayecto</Text>

        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: '50%' }]} />
        </View>

        <View style={styles.pointsContainer}>
          <View style={styles.point}>
            <Image
              source={require('../assets/location.png')}
              style={styles.locationIcon}
            />
            <Text style={styles.pointText}>Inicio</Text>
          </View>

          <View style={styles.point}>
            <Image
              source={require('../assets/truck.png')}
              style={styles.truckImage}
            />
          </View>

          <View style={styles.point}>
            <Image
              source={require('../assets/location.png')}
              style={styles.locationIcon}
            />
            <Text style={styles.pointText}>Fin</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleStartRoute}>
          <Text style={styles.buttonText}>Escáner</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
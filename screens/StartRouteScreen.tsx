import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../styles/StartRouteScreen.styles';
import UserHeader from '../components/userHeader';
import { useFocusEffect } from '@react-navigation/native';

export type RootStackParamList = {
  StartRoute: undefined;
  Scanner: {
    truck_id: number
  };
};

type StartRouteScreenNavigationProp = StackNavigationProp<RootStackParamList, 'StartRoute'>;

type Props = {
  navigation: StartRouteScreenNavigationProp;
  route: any;
};

export default function StartRouteScreen({ navigation, route }: Props) {
  const { truck_id } = route.params;
  const [name, setName] = useState<string | null>(null);
  const [patente, setPatente] = useState<string | null>(null);
  const [destinoAt, setDestinoAt] = useState<string>("Material");

  const fetchData = async () => {
    try {
      // Recuperando os dados do AsyncStorage
      const nameAsync = await AsyncStorage.getItem('name');
      const patenteAsync = await AsyncStorage.getItem('patente');
      const currentStepAsync = await AsyncStorage.getItem('currentStep'); // Adicionando recuperação do currentStep
      console.log("etapa: ", currentStepAsync)
  
      if (nameAsync) setName(nameAsync);
      if (patenteAsync) setPatente(patenteAsync);
      
      if (currentStepAsync) {
        // Verificando o valor de currentStep e atualizando destinoAt
        if (currentStepAsync === 'PESAGEM') {
          setDestinoAt('ROMANA');
        } else if (currentStepAsync === 'P_DESCARGA') {
          setDestinoAt('P.DESCARGA');
        } else if (currentStepAsync === 'PORTAL') {
          setDestinoAt('P.RADIACTIVO');
        } else {
          setDestinoAt(currentStepAsync); // Caso o valor não corresponda a nenhum dos casos
        }
      }
  
    } catch (error) {
      console.error('Erro ao recuperar dados do AsyncStorage', error);
    }
  };
  

  // Usando useFocusEffect para garantir que a função fetchData seja chamada sempre que a página for aberta
  useFocusEffect(
    React.useCallback(() => {
      fetchData(); // Chama a função sempre que a página for aberta
    }, [])
  );
  const handleStartRoute = () => {
    navigation.navigate('Scanner', {
      truck_id: truck_id, // Passa o ID do caminhão
    });
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
            <Text style={styles.pointText}>{destinoAt}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleStartRoute}>
          <Text style={styles.buttonText}>Escáner</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
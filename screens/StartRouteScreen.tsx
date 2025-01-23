import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';

export type RootStackParamList = {
  Scanner: undefined; 
  StartRoute: undefined; 
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'StartRoute'>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

type Truck = {
  plate: string; // Adicione outras propriedades, se existirem
};

export default function StartRouteScreen({ navigation }: Props) {
  const [isFinished, setIsFinished] = useState(false);

  const handleStartRoute = () => {
    if (!isFinished) {
      navigation.navigate('Scanner');
      //setIsFinished(true);
      
    } else {
      Alert.alert('Trajeto concluído!', 'O caminhão chegou ao destino final.');
    }
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>Início do Trajeto</Text>

      {/* Container do trajeto */}
      <View style={styles.routeContainer}>
        {/* Linha pontilhada conectando os pontos */}
        <View style={styles.dottedLine} />

        {/* Ponto de Início */}
        <View style={styles.startPoint}>
          <Image
            source={require('../assets/location.png')} // Ícone de localização inicial
            style={styles.locationIcon}
          />
          {!isFinished && (
            <Image
              source={require('../assets/truck.png')} // Caminhão na posição inicial
              style={styles.truckImage}
            />
          )}
        </View>

        {/* Ponto de Fim */}
        <View style={styles.endPoint}>
          <Image
            source={require('../assets/location.png')} // Ícone de localização final
            style={styles.locationIcon}
          />
          {isFinished && (
            <Image
              source={require('../assets/truck.png')} // Caminhão na posição final
              style={styles.truckImage}
            />
          )}
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleStartRoute}>
        <Text style={styles.buttonText}>
          {isFinished ? 'Trajeto Concluído' : 'Scanner'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    marginTop: 50
  },
  routeContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  dottedLine: {
    position: 'absolute',
    width: 2,
    height: '60%',
    left: '50%',
    top: '20%',
    borderStyle: 'dotted', // Estilo pontilhado
    borderWidth: 2,
    borderColor: '#0066cc',
  }, 
  startPoint: {
    position: 'absolute',
    top: '10%',
    left: '45%', // movendo mais para a esquerda
    marginLeft: -15,
    alignItems: 'center',
  },
  endPoint: {
    position: 'absolute',
    top: '80%',
    left: '45%',
    marginLeft: -15,
    alignItems: 'center',
  },
  pointLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 5,
  },
  locationIcon: {
    width: 70,
    height: 70,
    marginBottom: 5,
    marginTop: 0
  },
  truckImage: {
    width: 40,
    height: 100,
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
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});


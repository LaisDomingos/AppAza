import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';

export type RootStackParamList = {
  StartRoute: undefined;
  Scanner:  { truck_id: number }; 
};

type StartRouteScreenNavigationProp = StackNavigationProp<RootStackParamList, 'StartRoute'>;

type Props = {
  navigation: StartRouteScreenNavigationProp;
  route: any;
};

export default function StartRouteScreen({ navigation, route }: Props) {
  const {truck_id } = route.params
  const [isFinished, setIsFinished] = useState(false);

  const handleStartRoute = () => {
    navigation.navigate('Scanner', {
      truck_id: truck_id
    });
    setIsFinished(true); // Quando o botão for pressionado, marca como "finalizado"
  };

  return (
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
  },
  progressContainer: {
    width: '90%',
    height: 10,
    backgroundColor: '#dcdcdc',
    borderRadius: 5,
    overflow: 'hidden',
    marginVertical: 30,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4caf50',
    borderRadius: 5,
  },
  pointsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '80%',
  },
  point: {
    alignItems: 'center',
  },
  locationIcon: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  truckImage: {
    width: 150,
    height: 50,
  },
  pointText: {
    fontSize: 16,
    color: '#555',
  },
  button: {
    marginTop: 30,
    backgroundColor: '#0066cc',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

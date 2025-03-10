import Geolocation from 'react-native-geolocation-service';
import { requestLocationPermission } from './requestLocationPermission';
import { Alert } from 'react-native';

export const getLocationScan = async (readNdef: Function) => {
  const hasPermission = await requestLocationPermission();
  if (!hasPermission) {
    Alert.alert('Erro', 'Permissão de localização não concedida.');
    return;
  }

  Geolocation.getCurrentPosition(
    position => {
      const { latitude, longitude } = position.coords;
      console.log(latitude, longitude)
      readNdef();
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
};

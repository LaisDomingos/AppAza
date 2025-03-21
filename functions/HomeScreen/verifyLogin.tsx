import AsyncStorage from '@react-native-async-storage/async-storage';
import { saveDataAsync } from './saveDataAsync'; // Importando o saveDataAsync caso precise usá-lo

export const fetchToken = async (navigation: any) => {
  // Busca o token
  const token = await AsyncStorage.getItem('auth_token');
  // Busca o horário do login
  const loginTime = await AsyncStorage.getItem('login_time');
  console.log('TOKEN: ', token, ' E LOGIN TIME: ', loginTime)
  // Armazenar o truck_id como string
  const truckIdString = await AsyncStorage.getItem('truck_id');
  const truckId = truckIdString ? parseInt(truckIdString, 10) : 0;

  if (token && loginTime) {
    const now = new Date();
    const loginDate = new Date(loginTime);
    const diffInMinutes = (now.getTime() - loginDate.getTime()) / (1000 * 60); // Diferença em minutos

    if (diffInMinutes > 2) {
      saveDataAsync(); // Remove os dados do AsyncStorage
    } else {
      // Navega para a página DestinationPoint, passando os dados necessários
      navigation.navigate('DestinationPoint', {
        truck_id: truckId // Passa o ID do caminhão
      });
    }
  }
};
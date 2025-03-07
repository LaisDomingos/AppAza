import AsyncStorage from '@react-native-async-storage/async-storage';
import { saveDataAsync } from './saveDataAsync'; // Importando o saveDataAsync caso precise usá-lo

export const fetchToken = async (navigation: any, setToken: any) => {
  // Busca o token
  const token = await AsyncStorage.getItem('auth_token');
  // Busca o horário do login
  const loginTime = await AsyncStorage.getItem('loginTime');

  // Armazenar o truck_id como string
  // Recuperar o truck_id do AsyncStorage e converter para número
  const truckIdString = await AsyncStorage.getItem('truck_id');
  const truckId = truckIdString ? parseInt(truckIdString, 10) : 0;

  if (token && loginTime) {
    const now = new Date();
    const loginDate = new Date(loginTime);
    const diffInMinutes = (now.getTime() - loginDate.getTime()) / (1000 * 60); // Diferença em minutos

    if (diffInMinutes > 2) {
      saveDataAsync('remove', '', 0); // Remove os dados do AsyncStorage
      setToken(null); // Remove o token do estado também
    } else {
      // Navega para a página DestinationPoint, passando os dados necessários
      navigation.navigate('DestinationPoint', {
        truck_id: truckId // Passa o ID do caminhão
      });
      setToken(token);
    }
  }
};

import { Alert } from 'react-native';
import { getDataID } from '../../database/truck_data';
import { deleteTruck } from '../../database/truck_data';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const destinationReader = async (
  truck_id: number, 
  descricao: string, 
  showPopup: (message: string) => void,
  navigation: any) => {
  try {
    // Recupera o destino associado ao truck_id
    const dataID = await getDataID(truck_id);

    // Compara o destino com a descrição
    if (dataID[0]?.destination_location_name === descricao) {
      // Se o destino for correto, exibe um alerta informando que a viagem foi finalizada
      Alert.alert("Éxito","¡El viaje ha sido finalizado con éxito!");
      deleteTruck(truck_id); // Chama a função para excluir o caminhão (se necessário)
      await AsyncStorage.removeItem("currentStep");
      await AsyncStorage.removeItem("truck_id");
      navigation.navigate('DestinationPoint', {
        truck_id: truck_id // Passa o ID do caminhão
      });
      await AsyncStorage.removeItem('currentStep');
    } else {
      // Finaliza o percurso
      showPopup("El destino informado no corresponde al destino real. Por favor, proporcione una justificación.");
    }
  } catch (error) {
    console.error("Erro ao conferir o destino:", error);
  }
};

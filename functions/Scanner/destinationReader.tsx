import { Alert } from 'react-native';
import { getDataID } from '../../database/sqliteDatabase';
import { deleteTruck } from '../../database/sqliteDatabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const destinationReader = async (truck_id: number, descricao: string, showPopup: (message: string) => void) => {
  try {
    console.log("Confere se o destino lê corretamente");

    // Recupera o destino associado ao truck_id
    const dataID = await getDataID(truck_id);
    console.log("Ver o destino: ", dataID[0]?.destination_location_name);
    console.log("Descrição sendo lida: ", descricao);

    // Compara o destino com a descrição
    if (dataID[0]?.destination_location_name === descricao) {
      // Se o destino for correto, exibe um alerta informando que a viagem foi finalizada
      Alert.alert("A viagem foi finalizada com sucesso!");
      deleteTruck(truck_id); // Chama a função para excluir o caminhão (se necessário)
      await AsyncStorage.removeItem("currentStep");
    } else {
      console.log("Os destinos não são iguais");

      // Finaliza o percurso
      showPopup("O destino não é igual ao informado, precisa dar uma justificativa");
    }
  } catch (error) {
    console.error("Erro ao conferir o destino:", error);
  }
};

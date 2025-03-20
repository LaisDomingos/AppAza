import { Alert } from "react-native";
import { getLocation } from "./getLocation";
import { fetchTruckByTag } from "../../services/get/tag";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { materialReader } from "./materialReader";
import { radioactiveReader } from "./radioactiveReader";
import { weighingReader } from "./weighingReader";
import { destinationReader } from "./destinationReader";

// Definindo as etapas possíveis
const ETAPAS = {
  MATERIAL: 'MATERIAL',
  PORTAL: 'PORTAL',
  PESAGEM: 'PESAGEM',
  P_DESCARGA: 'P_DESCARGA',
};

// Função para obter a etapa salva no AsyncStorage
const obterEtapaSalva = async (): Promise<string | null> => {
  try {
    const etapa = await AsyncStorage.getItem("currentStep");
    return etapa;
  } catch (error) {
    console.error("Erro ao obter etapa salva:", error);
    return null;
  }
};

// Função para validar se o NFC lido corresponde à etapa esperada
export const readNFC = async (truck_id: number, showPopup: (message: string) => void, navigation: any ): Promise<void> => {

   // Chama a função para obter a localização

  try {
    // SIMULAÇÃO MANUAL: Número do cartão (RFID) lido manualmente
    const cardNumber = "RFID123";

    // Busca os dados da tag no backend
    const truckData = await fetchTruckByTag(cardNumber);

    // Verifica qual é o processo retornado pela API, colocando tudo em maiúsculas
    const processoAtual = truckData?.processo?.toUpperCase();  // Transforma o processo em maiúsculas
    const descricao = truckData?.descricao
    
    getLocation(processoAtual, descricao);
    // Verifica qual etapa está salva no AsyncStorage
    const etapaSalva = await obterEtapaSalva();
    let etapaAtual = etapaSalva ? etapaSalva : ETAPAS.MATERIAL; // Se não houver etapa salva, começa com MATERIAL

    // Verifica se o processo atual corresponde à etapa esperada
    if (processoAtual === etapaAtual) {
      Alert.alert("Tarjeta Leída", `Número de tarjeta (RFID): ${cardNumber}`);
      // Aqui você pode salvar a próxima etapa no AsyncStorage
      if (etapaAtual === ETAPAS.MATERIAL) {
        await materialReader(truck_id, descricao, navigation);
      } else if (etapaAtual === ETAPAS.PORTAL) {
        await radioactiveReader(truck_id, navigation)
      } else if (etapaAtual === ETAPAS.PESAGEM) {
        await weighingReader(truck_id, navigation)
      } else {
        await destinationReader(truck_id, descricao, showPopup, navigation);
      }
    } else {
      Alert.alert("Error", `Por favor, lea el NFC para la etapa de ${etapaAtual} primero.`);
    }
    // navigation.navigate('Scanner');
  } catch (ex) {
    console.warn("Erro ao ler a tag:", ex);
    Alert.alert("Error", "Ocurrió un error al intentar leer la tarjeta.");
  }
};

/*export const readNFC = async (): Promise<void> => {
  getLocation(); // Chama a função para obter a localização

  try {
    console.log("Tentando ler tag...");

    console.log("Cancelando requisição antiga...");
    await NfcManager.cancelTechnologyRequest();

    await NfcManager.requestTechnology([NfcTech.Ndef, NfcTech.NfcA, NfcTech.NfcB]);

    const tag = await NfcManager.getTag();
    console.log("Tag completa:", tag);

    if (tag?.id) {
      const cardNumber = tag.id;
      Alert.alert("Cartão Lido", `Número do cartão (RFID): ${cardNumber}`);

      // Busca os dados da tag no backend
      const truckData = await fetchTruckByTag(cardNumber);
      
      console.log("Dados do caminhão:", truckData);
    } else {
      Alert.alert("Erro", "Não foi possível encontrar o número do cartão.");
    }
  } catch (ex) {
    console.warn("Erro ao ler a tag:", ex);
    Alert.alert("Erro", "Ocorreu um erro ao tentar ler a tag NFC.");
  } finally {
    console.log("Cancelando requisição ativa (final)");
    await NfcManager.cancelTechnologyRequest();
  }
};*/
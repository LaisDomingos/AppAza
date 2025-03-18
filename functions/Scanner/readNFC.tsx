import { Alert } from "react-native";
import { getLocation } from "./getLocation";
import { fetchTruckByTag } from "../../services/get/tag";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
export const readNFC = async (): Promise<void> => {
  getLocation(); // Chama a função para obter a localização

  try {
    console.log("Tentando ler tag...");

    // SIMULAÇÃO MANUAL: Número do cartão (RFID) lido manualmente
    const cardNumber = "RFID123";

    // Busca os dados da tag no backend
    const truckData = await fetchTruckByTag(cardNumber);
    
    // Verifica qual é o processo retornado pela API, colocando tudo em maiúsculas
    const processoAtual = truckData?.processo?.toUpperCase();  // Transforma o processo em maiúsculas
    const descricao = truckData?.descricao
    console.log("desc: ", descricao)
    console.log("Processo do caminhão:", processoAtual);

    // Verifica qual etapa está salva no AsyncStorage
    const etapaSalva = await obterEtapaSalva();
    let etapaAtual = etapaSalva ? etapaSalva : ETAPAS.MATERIAL; // Se não houver etapa salva, começa com MATERIAL
    
    // Verifica se o processo atual corresponde à etapa esperada
    if (processoAtual === etapaAtual) {
      Alert.alert("Cartão Lido", `Número do cartão (RFID): ${cardNumber}`);
      
      // Aqui você pode salvar a próxima etapa no AsyncStorage
      if (etapaAtual === ETAPAS.MATERIAL) {
        console.log("salva o material lido")
        await AsyncStorage.setItem("currentStep", ETAPAS.PORTAL);
      } else if (etapaAtual === ETAPAS.PORTAL) {
        console.log("passa o portal radioativo para true e tenta enviar os dados")
        await AsyncStorage.setItem("currentStep", ETAPAS.PESAGEM);
      } else if (etapaAtual === ETAPAS.PESAGEM) {
        console.log("tenta enviar os dados faltante, se não for deve avisar")
        await AsyncStorage.setItem("currentStep", ETAPAS.P_DESCARGA);
      } else {
        console.log("confere se o destino lê corretamente")
        await AsyncStorage.removeItem("currentStep");
      }

    } else {
      Alert.alert("Erro", `Por favor, leia o NFC para a etapa de ${etapaAtual} primeiro.`);
    }

    console.log("Dados do caminhão:", truckData);
    // navigation.navigate('Scanner');
  } catch (ex) {
    console.warn("Erro ao ler a tag:", ex);
    Alert.alert("Erro", "Ocorreu um erro ao tentar ler a tag NFC.");
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
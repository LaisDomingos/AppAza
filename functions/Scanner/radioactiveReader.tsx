import AsyncStorage from '@react-native-async-storage/async-storage';
import { markAsSent, getDataID, updateRadioactiveStatus} from '../../database/sqliteDatabase'
import { ETAPAS } from '../../models/etapas';
import sendTruckData from './sendTruckData';

export const radioactiveReader = async (truck_id: number) => {
  try {
    // Atualiza o status radioativo do caminhão
    updateRadioactiveStatus(truck_id, true);

    // Obtém os dados do caminhão
    const dataID = await getDataID(truck_id);
    if (!dataID || dataID.length === 0) {
      throw new Error(`Nenhum dado encontrado para o truck_id: ${truck_id}`);
    }

    // Pega o primeiro registro (ou itera se necessário)
    const truckData = dataID[0];

    // Converte o status radioativo para booleano e envia os dados
    const response = await sendTruckData({
      ...truckData,
      radioactive_status: truckData.radioactive_status === 1, // Se for 1, vira true; se for 0, vira false
    });

    console.log("✅ Dados do caminhão enviados com sucesso:", response);

    // Marca o caminhão como 'enviado' no banco
    await markAsSent(truck_id);
    console.log("✅ O campo 'sent' foi atualizado para 1 no banco.");
    
  } catch (error) {
    console.warn("❌ Falha ao enviar os dados para o caminhão:", error);
  }
  await AsyncStorage.setItem("currentStep", ETAPAS.PESAGEM);
};

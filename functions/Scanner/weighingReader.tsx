import AsyncStorage from '@react-native-async-storage/async-storage';
import { ETAPAS } from '../../models/etapas';

import { markAsSent, getPendingData } from '../../database/sqliteDatabase';
import sendTruckData from './sendTruckData';

export const weighingReader = async (truck_id: number) => {
  try {
    console.log("Tentando enviar dados faltantes, se não houver, deve avisar.");

    // 3️⃣ Verifica se há dados pendentes
    const pendingData = await getPendingData(); // Função que busca dados com sent = 0
    console.log("pend: ", pendingData);

    if (!pendingData || pendingData.length === 0) {
      console.log("❌ Não há dados pendentes para enviar.");
      await AsyncStorage.setItem("currentStep", ETAPAS.P_DESCARGA);
      console.log("Etapa alterada para P_DESCARGA (sem dados pendentes).");
      return; // Retorna caso não haja dados pendentes
    }

    console.log("tem pendencias");
    const truckData = pendingData[0]; // Pega o primeiro dado pendente

    try {
      // Tenta enviar os dados
      const response = await sendTruckData({
        ...truckData,
        radioactive_status: truckData.radioactive_status === 1, // Se for 1, vira true; se for 0, vira false
      });

      console.log("✅ Dados do caminhão enviados com sucesso:", response);

      // Marca os dados como enviados
      await markAsSent(truckData.id); // Atualiza o 'sent' para 1 no banco de dados
      console.log("✅ O campo 'sent' foi atualizado para 1 no banco.");

      // Altera a etapa para P_DESCARGA
      await AsyncStorage.setItem("currentStep", ETAPAS.P_DESCARGA);
      console.log("Etapa alterada para P_DESCARGA.");

    } catch (error) {
      console.error("Erro ao enviar os dados:", error);
    }
  } catch (error) {
    console.error("Erro ao verificar dados pendentes:", error);
  }
};

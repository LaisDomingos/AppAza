import AsyncStorage from '@react-native-async-storage/async-storage';
import { ETAPAS } from '../../models/etapas';

import { markAsSent, getPendingData } from '../../database/sqliteDatabase';
import sendTruckData from './sendTruckData';

export const weighingReader = async (truck_id: number, navigation: any) => {
  try {
    // 3️⃣ Verifica se há dados pendentes
    const pendingData = await getPendingData(); // Função que busca dados com sent = 0

    if (!pendingData || pendingData.length === 0) {
      await AsyncStorage.setItem("currentStep", ETAPAS.P_DESCARGA);
      navigation.navigate('StartRoute', {
        truck_id: truck_id // Passa o ID do caminhão
      });
      return; // Retorna caso não haja dados pendentes
    }

    const truckData = pendingData[0]; // Pega o primeiro dado pendente

    try {
      // Tenta enviar os dados
      const response = await sendTruckData({
        ...truckData,
        radioactive_status: truckData.radioactive_status === 1, // Se for 1, vira true; se for 0, vira false
      });

      // Marca os dados como enviados
      await markAsSent(truckData.id);

      // Altera a etapa para P_DESCARGA
      await AsyncStorage.setItem("currentStep", ETAPAS.P_DESCARGA);

      navigation.navigate('StartRoute', {
        truck_id: truck_id // Passa o ID do caminhão
      });

    } catch (error) {
      console.error("Erro ao enviar os dados:", error);
    }
  } catch (error) {
    console.error("Erro ao verificar dados pendentes:", error);
  }
};

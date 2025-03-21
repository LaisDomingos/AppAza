import AsyncStorage from "@react-native-async-storage/async-storage";
import { getData } from "../../database/truck_data";

// Buscar os dados da viagem não finalizada
export const pendingTrip = async (navigation: any, selectedTruckId: number) => {
    const missingRows = await getData();
    console.log("Faltantes:", missingRows);
    
    const selectedRow = missingRows.find(row => row.id === selectedTruckId);

    if (selectedRow) {
      // Filtra os campos que estão null
      const missingFields = Object.entries(selectedRow)
        .filter(([_, value]) => value === null)
        .map(([key]) => key);

      if (missingFields.length > 0) {
        console.log(`Os seguintes campos estão ausentes na viagem ${selectedTruckId}:`, missingFields.join(", "));
        
        // Verifica os casos específicos
        const isRadioactiveMissing = missingFields.includes("radioactive_status");
        const isMaterialNameMissing = missingFields.includes("material_destination_name");
        const isWeightMissing = missingFields.includes("weight");

        if (isRadioactiveMissing && isMaterialNameMissing && isWeightMissing) {
          console.log("ETAPA MATERIAL");
          await AsyncStorage.setItem("currentStep", "MATERIAL");
          navigation.navigate('StartRoute', {
            truck_id: selectedTruckId, // Passa o ID do caminhão
          });
        } else if (isRadioactiveMissing && isWeightMissing) {
          console.log("ETAPA PORTAL");
          await AsyncStorage.setItem("currentStep", "PORTAL");
          navigation.navigate('StartRoute', {
            truck_id: selectedTruckId, // Passa o ID do caminhão
          });
        } else if (isWeightMissing){
          console.log("ETAPA PESAGEM")
          await AsyncStorage.setItem("currentStep", "PESAGEM");
          navigation.navigate('StartRoute', {
            truck_id: selectedTruckId, // Passa o ID do caminhão
          });
        } 

      } else {
        console.log("ETAPA P_DESCARGA")
        console.log(`Nenhum campo ausente na viagem ${selectedTruckId}`);
        await AsyncStorage.setItem("currentStep", "P_DESCARGA");
          navigation.navigate('StartRoute', {
            truck_id: selectedTruckId, // Passa o ID do caminhão
          });
      }
    }
  };
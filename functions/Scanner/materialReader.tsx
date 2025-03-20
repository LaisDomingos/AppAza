import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchMaterialById } from "../../services/get/materialListId";
import { updateTruckDetails } from "../../database/sqliteDatabase";
import { ETAPAS } from "../../models/etapas";

export const materialReader = async (truck_id: number, descricao: string, navigation: any ) => {
  try {
    console.log(descricao)
    const material = await fetchMaterialById(descricao);
    console.log("VEJA O MATERIAL: ", material)
    updateTruckDetails(
      truck_id,
      material.label,
      material.code,
      material.process[0].description,
      material.process[0].code,
      "",
      ""
    );

    console.log("✅ Material salvo com sucesso!");

    await AsyncStorage.setItem("currentStep", ETAPAS.PORTAL);
    navigation.navigate('StartRoute', {
      truck_id: truck_id // Passa o ID do caminhão
    });
  } catch (error) {
    console.error("❌ Erro ao processar o material:", error);
  }
};
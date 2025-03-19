import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchMaterialById } from "../../services/get/materialList";
import { updateTruckDetails } from "../../database/sqliteDatabase";
import { ETAPAS } from "../../models/etapas";
export const materialReader = async (truck_id: number, descricao: string) => {
  try {
    const material = await fetchMaterialById(descricao);

    updateTruckDetails(
      truck_id,
      material.description,
      material.code,
      material.process[0].description,
      material.process[0].code,
      "",
      ""
    );

    console.log("✅ Material salvo com sucesso!");

    await AsyncStorage.setItem("currentStep", ETAPAS.PORTAL);
  } catch (error) {
    console.error("❌ Erro ao processar o material:", error);
  }
};

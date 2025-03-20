import { fetchMaterial } from "../../services/get/materialList";

export interface Material {
  code: string;
  description: string;
  id_mat_operation_type: string;
  label: string;
  process_id: string;
  id: string;
  process: { description: string; code: string; status?: string; id?: string }[];
}

export const loadMaterial = async (): Promise<Material[]> => {
  try {
    const data: Material[] = await fetchMaterial(); 
    return data; // Retorna todos os objetos, não apenas os labels
  } catch (error) {
    console.error("Erro ao carregar dados do JSON:", error);
    return [];
  }
};

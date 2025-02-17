import { fetchMovInternos } from "../../services/get/destinationPoint"; 

export const loadData = async () => {
  try {
    const data = await fetchMovInternos();
    const setoresData = data?.map((item: any) => item);
    return setoresData || [];
  } catch (error) {
    console.error('Erro ao carregar dados do JSON:', error);
    return [];
  }
};

import fetchDriver from "../../services/post/driver_truck";

// Definindo a interface para os dados do motorista/caminhão
interface TruckDriverData {
  unidad: string;
  supplier_name: string;
  supplier_rut: string;
  truck_brand: string;
  plate: string;
  radioactive_status?: boolean; // Opcional com valor padrão
  date_time: string;
  driver_rut: string;
  driver_name: string;
  material_destination_name: string;
  material_destination_code: string;
  version_name: string;
  version_code: string;
  material_origen_name?: string; // Opcional com valor padrão
  material_origen_code?: string; // Opcional com valor padrão
  destination_location_code: string;
  destination_location_name: string;
}

async function registerTruckData({
  unidad,
  supplier_name,
  supplier_rut,
  truck_brand,
  plate,
  radioactive_status = false, // Definindo um valor padrão
  date_time,
  driver_rut,
  driver_name,
  material_destination_name,
  material_destination_code,
  version_name,
  version_code,
  material_origen_name = "material_origen", // Definindo um valor padrão
  material_origen_code = "001", // Definindo um valor padrão
  destination_location_code,
  destination_location_name,
}: TruckDriverData): Promise<any> {
  try {
    const driverData = {
      unidad,
      supplier_name,
      supplier_rut,
      truck_brand,
      plate,
      radioactive_status,
      date_time,
      driver_rut,
      driver_name,
      material_destination_name,
      material_destination_code,
      version_name,
      version_code,
      material_origen_name,
      material_origen_code,
      destination_location_code,
      destination_location_name,
    };

    console.log("Enviando dados do motorista:", driverData);

    const response = await fetchDriver(driverData);

    console.log("Motorista registrado com sucesso:", response);
    return response;
  } catch (error: any) {
    console.error("Erro ao registrar motorista:", error.message);
    throw error;
  }
}

export default registerTruckData;

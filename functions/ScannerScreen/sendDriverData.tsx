import fetchDriver from '../../services/post/driver_truck'; // Importe o serviço de envio de dados
import { TruckData, markAsSent } from '../../database/sqliteDatabase'; // Importe a função para marcar como enviado

export async function sendDriverData(truck: TruckData): Promise<boolean> {
  const response = await fetchDriver({
    unidad: truck.unidad,
    supplier_name: truck.supplier_name,
    supplier_rut: truck.supplier_rut,
    truck_brand: truck.truck_brand,
    plate: truck.plate,
    radioactive_status: truck.radioactive_status,
    date_time: truck.date_time,
    driver_rut: truck.driver_rut,
    driver_name: truck.driver_name,
    material_destination_name: truck.material_destination_name,
    material_destination_code: truck.material_destination_code,
    version_name: truck.version_name,
    version_code: truck.version_code,
    material_origen_name: truck.material_origen_name,
    material_origen_code: truck.material_origen_code,
    destination_location_code: truck.destination_location_code,
    destination_location_name: truck.destination_location_name,
  });

  if (response) {
    markAsSent(truck.id); // Marca como enviado se a resposta for bem-sucedida
    return true;
  } else {
    console.error('Falha ao criar motorista, sem resposta.');
    return false;
  }
}

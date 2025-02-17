import { getPendingData } from '../../database/sqliteDatabase'; // Importe a função para pegar os dados pendentes
import { sendDriverData } from './sendDriverData';

export async function sendPendingData() {
  //console.log("Enviando dados pendentes...");
  const trucks = await getPendingData();
  if (trucks.length === 0) {
    console.log("Nenhum dado pendente para enviar.");
    return false;
  }

  let success = false;

  for (const truck of trucks) {
    const result = await sendDriverData(truck); // Tenta enviar os dados do motorista
    if (result) {
      success = true; // Marca sucesso se pelo menos um envio funcionar
      break; // Interrompe o loop ao encontrar sucesso
    }
  }

  return success; // Retorna o status final (true ou false)
}

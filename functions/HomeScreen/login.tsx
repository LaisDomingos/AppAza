// loginFunction.ts
import { insertData } from '../../database/sqliteDatabase';
import { fetchDrivers } from '../../services/get/driver'; // Importe a função que busca os motoristas
import { fetchTrucks } from '../../services/get/truck'; // Importando a função que busca os caminhões

export const handleLogin = async (
  nome: string,
  rut: string,
  patente: string,
  motoristas: any[],
  truckBrands: { [key: string]: string },
  setErro: React.Dispatch<React.SetStateAction<string>>,
  navigation: any
) => {
  if (!nome || !rut || !patente) {
    setErro('Por favor, complete todos os campos obrigatórios.');
    return;
  }

  const motoristaSelecionado = motoristas.find(driver => driver.name === nome);

  if (!motoristaSelecionado) {
    setErro('Conductor no encontrado.');
    return;
  }

  if (motoristaSelecionado.rutNumber !== rut) {
    setErro('RUT incorrecto para el conductor seleccionado.');
    return;
  }

  // Obter a marca diretamente de truckBrands
  const selectedTruckBrand = truckBrands[patente] || '';
  const id = await insertData(
    "1111 - AZA Colina", 
    "TRANSPORTES LMORA LTDA", 
    "8000032", 
    selectedTruckBrand, 
    patente, 
    rut, 
    nome
  );

  setErro('');
  console.log('Login bem-sucedido', nome, rut, patente);
  navigation.navigate('DestinationPoint', {
    nome_driver: nome,
    patente: patente,
    rut_driver: rut,
    truck_brand: selectedTruckBrand,
    truck_id: id // Passa o ID do caminhão
  });
};

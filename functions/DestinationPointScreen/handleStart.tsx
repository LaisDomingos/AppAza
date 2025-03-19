import AsyncStorage from '@react-native-async-storage/async-storage';
import { insertData, updateDestinationLocation } from '../../database/sqliteDatabase'; // ajuste o caminho se necessário

export const handleStart = async (
  selectedTruckBrand: string,
  patente: string,
  rut: string,
  nome: string,
  selectedSetor: string | null,
  setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>,
  navigation: any // Aqui você pode ajustar o tipo conforme a navegação
) => {
  if (!selectedSetor) {
    setErrorMessage('Por favor, seleccione un sector.');
    return;
  }

  setErrorMessage(null);
  const code = selectedSetor.slice(0, 3).toUpperCase(); // .toUpperCase() para garantir que as letras estejam maiúsculas
  const truck_id = await insertData(
    "1111 - AZA Colina",
    "TRANSPORTES LMORA LTDA",
    "8000032",
    selectedTruckBrand,
    patente,
    rut,
    nome,
    code,
    selectedSetor
  );
  await AsyncStorage.setItem('truck_id', truck_id.toString());
  navigation.navigate('StartRoute', {
    truck_id: truck_id, // Passa o ID do caminhão
  });
};

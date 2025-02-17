import { updateDestinationLocation } from '../../database/sqliteDatabase'; // ajuste o caminho se necessário

export const handleStart = (
  selectedSetor: string | null,
  truck_id: number,
  setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>,
  navigation: any // Aqui você pode ajustar o tipo conforme a navegação
) => {
  if (!selectedSetor) {
    setErrorMessage('Por favor, seleccione un sector.');
    return;
  }

  setErrorMessage(null);
  const code = selectedSetor.slice(0, 3).toUpperCase(); // .toUpperCase() para garantir que as letras estejam maiúsculas

  updateDestinationLocation(truck_id, code, selectedSetor);
  navigation.navigate('StartRoute', {
    truck_id: truck_id, // Passa o ID do caminhão
  });
};

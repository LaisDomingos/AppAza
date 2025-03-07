import { insertData } from '../../database/sqliteDatabase';
import { fetchLogin } from '../../services/post/login';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { saveDataAsync } from './saveDataAsync';

export const handleLogin = async (
  nome: string,
  driverId: string,
  rut: string,
  patente: string,
  motoristas: any[],
  truckBrands: { [key: string]: string },
  setErro: React.Dispatch<React.SetStateAction<string>>,
  navigation: any
) => {
  // Validação dos campos
  if (!nome || !rut || !patente || !driverId) {
    setErro('Por favor, complete todos os campos obrigatórios.');
    return;
  }

  // Verifica se o motorista existe
  const motoristaSelecionado = motoristas.find(driver => driver.name === nome);
  if (!motoristaSelecionado) {
    setErro('Conductor no encontrado.');
    return;
  }

  // Verifica se o RUT corresponde
  if (motoristaSelecionado.rutNumber !== rut) {
    setErro('RUT incorrecto para el conductor seleccionado.');
    return;
  }

  try {
    // Faz a requisição de login
    const loginResponse = await fetchLogin(driverId, rut);
    // Obter a marca diretamente de truckBrands
    const selectedTruckBrand = truckBrands[patente] || '';
    
    // Insere os dados no banco
    const id = await insertData(
      "1111 - AZA Colina", 
      "TRANSPORTES LMORA LTDA", 
      "8000032", 
      selectedTruckBrand, 
      patente, 
      rut, 
      nome
    );

    // Limpa o erro e navega para a próxima tela
    setErro(''); // Limpa os erros
     
    // Navega para a página DestinationPoint, passando os dados necessários
    navigation.navigate('DestinationPoint', {
      truck_id: id // Passa o ID do caminhão
    });
    saveDataAsync('post', loginResponse, id);
  } catch (error) {
    // Exibe a mensagem de erro se falhar no login
    if (error instanceof Error) {
      setErro(error.message);
      Alert.alert("Erro", error.message); // Exibe o erro como um alerta
    } else {
      setErro('An unknown error occurred.');
      Alert.alert("Erro", 'An unknown error occurred.'); // Exibe o erro como um alerta
    }
  }
};

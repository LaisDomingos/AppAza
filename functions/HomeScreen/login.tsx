import { fetchLogin } from '../../services/post/login';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    setErro('Por favor, complete todos los campos obligatorios.');
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
  
    // Limpa o erro e navega para a próxima tela
    setErro(''); // Limpa os erros
    const loginTime = new Date().toISOString(); // Pega o momento atual em formato ISO
    console.log( 'TOKEN LOGIN: ', loginResponse, ' E LOGINTIME LOGIN: ', loginTime)
    
    await AsyncStorage.setItem('truckBrand', selectedTruckBrand) // Armazena o rut
    await AsyncStorage.setItem('rut', rut); // Armazena o nome
    await AsyncStorage.setItem('name', nome); // Armazena o nome
    await AsyncStorage.setItem('patente', patente); // Armazena a patente
    await AsyncStorage.setItem('auth_token', loginResponse); // Armazenar o token
    await AsyncStorage.setItem('login_time', loginTime); // Armazenar o horário do login
    
    // Navega para a página DestinationPoint, passando os dados necessários
    navigation.replace('DestinationPoint'); 
  } catch (error) {
    // Exibe a mensagem de erro se falhar no login
    if (error instanceof Error) {
      if (error.message === "Network request failed") {
        setErro('Sin internet no es posible iniciar sesión');
      }
    } else {
      setErro('An unknown error occurred.');
      Alert.alert("Error", 'Ocurrió un error desconocido.'); // Exibe o erro como um alerta
    }
  }
};
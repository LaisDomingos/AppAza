import AsyncStorage from '@react-native-async-storage/async-storage';

export const changeScanCount = async () => {
  try {
    const newCount = 0;
    await AsyncStorage.setItem('scanCount', newCount.toString());
  } catch (error) {
    console.error('Erro ao buscar scanCount:', error);
  }
}
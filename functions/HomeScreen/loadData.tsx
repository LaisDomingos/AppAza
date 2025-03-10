// services/loadData.ts

import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchDriverFiles } from '../../services/get/driverFile';
import { fetchTruckFiles } from '../../services/get/truckFile';

export const loadData = async (setMotoristas: React.Dispatch<React.SetStateAction<any[]>>, setPatentesFetch: React.Dispatch<React.SetStateAction<string[]>>, setTruckBrands: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>, setBrands: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>, setErro: React.Dispatch<React.SetStateAction<string>>, setLoading: React.Dispatch<React.SetStateAction<boolean>>) => {
  setLoading(true);

  try {
    // Primeiro, tentar carregar os dados salvos no dispositivo
    const savedDrivers = await AsyncStorage.getItem('drivers');
    const savedTrucks = await AsyncStorage.getItem('trucks');

    if (savedDrivers && savedTrucks) {
      setMotoristas(JSON.parse(savedDrivers));
      setPatentesFetch(JSON.parse(savedTrucks));
    }

    // Depois, tentar buscar os dados mais atualizados da API
    const drivers = await fetchDriverFiles();
    const trucks = await fetchTruckFiles();

    const truckBrands = trucks.reduce((acc: { [key: string]: string }, truck: { plate: string | number; brand: string; }) => {
      acc[truck.plate] = truck.brand;
      return acc;
    }, {});

    // Atualizar estado truckBrands
    setTruckBrands(truckBrands);
    setBrands(truckBrands);
    setMotoristas(drivers);
    setPatentesFetch(trucks.map((truck: any) => truck.plate));

    // Salvar os novos dados localmente
    await AsyncStorage.setItem('drivers', JSON.stringify(drivers));
    await AsyncStorage.setItem('trucks', JSON.stringify(trucks.map((truck: any) => truck.plate)));
    await AsyncStorage.setItem('truck_brand', JSON.stringify(trucks.map((truck: any) => truck.brand)));
  } catch (error) {
    console.error('Erro ao buscar dados da API:', error);

    if (!setMotoristas.length || !setPatentesFetch.length) {
      setErro('Error al cargar los datos.');
    }
  } finally {
    setLoading(false);
  }
};

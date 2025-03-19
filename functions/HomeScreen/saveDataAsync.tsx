import AsyncStorage from "@react-native-async-storage/async-storage";

export async function saveDataAsync(
    request: string,
    truck_id: number,
    nome: string,
    patente: string) {
    const loginTime = new Date().toISOString(); // Pega o momento atual em formato ISO
    if (request === 'post') {
        // Armazenar o nome
        await AsyncStorage.setItem('name', nome);
        // Armazenar a patente
        await AsyncStorage.setItem('patente', patente);
        // Armazenar o horário do login
        await AsyncStorage.setItem('loginTime', loginTime);
        // Armazenar o truck_id como string
        await AsyncStorage.setItem('truck_id', truck_id.toString());
    } else if (request === 'remove') {
        // Remove o nome
        await AsyncStorage.removeItem('name');
        // Remove a patente
        await AsyncStorage.removeItem('patente');
        // Remove o token
        await AsyncStorage.removeItem('auth_token');
        // Remove o horário do login
        await AsyncStorage.removeItem('loginTime');
        // Remove o truck_id
        await AsyncStorage.setItem('truck_id', truck_id.toString());
        // Remove a etapa
        await AsyncStorage.removeItem('currentStep');
    }
}
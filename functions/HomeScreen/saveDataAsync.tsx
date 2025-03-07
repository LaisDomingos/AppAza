import AsyncStorage from "@react-native-async-storage/async-storage";

export async function saveDataAsync(
    request: string,
    token: string,
    truck_id: number) {
    const loginTime = new Date().toISOString(); // Pega o momento atual em formato ISO
    if (request === 'post') {
        // Armazenar o token
        await AsyncStorage.setItem('auth_token', token);
        // Armazenar o horário do login
        await AsyncStorage.setItem('loginTime', loginTime);
        // Armazenar o truck_id como string
        await AsyncStorage.setItem('truck_id', truck_id.toString());
    } else if (request === 'remove') {
        // Remove o token
        await AsyncStorage.removeItem('auth_token');
        // Remove o horário do login
        await AsyncStorage.removeItem('loginTime');
        // Remove o truck_id
        await AsyncStorage.setItem('truck_id', truck_id.toString());
    }
}
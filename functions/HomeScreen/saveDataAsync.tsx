import AsyncStorage from "@react-native-async-storage/async-storage";

export async function saveDataAsync() {
    // Remove o token
    await AsyncStorage.removeItem('auth_token');
    // Remove o horário do login
    await AsyncStorage.removeItem('login_time');
    // Remove o nome
    await AsyncStorage.removeItem('name');
    // Remove a patente
    await AsyncStorage.removeItem('patente');
    // Remove a etapa
    await AsyncStorage.removeItem('currentStep');
}
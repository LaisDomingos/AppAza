import RNFS from 'react-native-fs';

// Caminho correto para acessar arquivos dentro da pasta assets
export const fetchTruckFiles = async () => {
    try {
        const data = await RNFS.readFileAssets('truck.json', 'utf8');
        return JSON.parse(data).data; // Retorna os dados necessários
    } catch (error) {
        console.error("Erro ao carregar os dados do JSON:", error);
        throw new Error("Erro ao carregar os dados.");
    }
};
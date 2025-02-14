import jsonData from '../../models/tagMaterial.json';

export const fetchTagFiles = async () => {
    try {
        console.log(jsonData)
        return jsonData; // Retorna os dados necessários
    } catch (error) {
        console.error("Erro ao carregar os dados do JSON:", error);
        throw new Error("Erro ao carregar os dados.");
    }
};

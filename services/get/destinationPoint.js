import jsonData from '../../models/mov_internos.json';

export const fetchMovInternos = async () => {
    try {
        // Log detalhado do conteúdo de "puertosDescargaPorChatarra"
        console.log(JSON.stringify(jsonData.puertosDescargaPorChatarra, null, 2));
        //console.log(jsonData.puertosDescargaPorChatarra)
        return jsonData.puertosDescargaPorChatarra; // Retorna os dados necessários
    } catch (error) {
        console.error("Erro ao carregar os dados do JSON:", error);
        throw new Error("Erro ao carregar os dados.");
    }
};

import jsonData from '../../models/mov_internos.json';

export const fetchMovInternos = async () => {
    try {
        // Log detalhado do conteúdo de "puertosDescargaPorChatarra"
        console.log(JSON.stringify(jsonData.puertosDescargaPorChatarra, null, 2));

        // Se você quiser verificar apenas os materiais de cada setor
        jsonData.puertosDescargaPorChatarra.forEach((item) => {
            console.log(`Setor: ${item.setor}`);
            item.materiais.forEach((material, index) => {
                console.log(`Material ${index + 1}: ${JSON.stringify(material, null, 2)}`);
            });
        });

        return jsonData.puertosDescargaPorChatarra; // Retorna os dados necessários
    } catch (error) {
        console.error("Erro ao carregar os dados do JSON:", error);
        throw new Error("Erro ao carregar os dados.");
    }
};

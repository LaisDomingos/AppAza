export const fetchMaterialById = async (materialId) => {
    const apiUrl = `https://apim-aza-dev.azure-api.net/radioactive_portal/materialList/`;

    try {
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Falha ao buscar dados do material. Status: ${response.status}`);
        }

        const responseData = await response.json();

        // Filtra para encontrar o material com o ID correspondente
        const material = responseData.data.find(item => item.id === materialId);

        if (!material) {
            throw new Error(`Material com ID ${materialId} não encontrado.`);
        }

        return material;
    } catch (error) {
        console.error("Erro ao buscar dados do material:", error);
        throw new Error("Erro ao carregar dados do material.");
    }
};

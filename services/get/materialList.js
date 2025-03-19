export const fetchMaterialById = async (materialId) => {
    const apiUrl = `https://apim-aza-dev.azure-api.net/radioactive_portal/materialList/${materialId}`;

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

        // console.log(responseData.data);

        return responseData.data;
    } catch (error) {
        console.error("Erro ao buscar dados do material:", error);
        throw new Error("Erro ao carregar dados do material.");
    }
};

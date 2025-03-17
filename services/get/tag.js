export const fetchTruckByTag = async (tagId) => {
    const apiUrl = `http://172.20.10.2:4000/api/tags/${tagId}`; // URL atualizada para incluir a tag específica
    try {
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Falha ao buscar dados da tag. Status: ${response.status}`);
        }

        const responseData = await response.json();
        
        console.log(responseData);

        return responseData;
    } catch (error) {
        console.error("Erro ao buscar dados da tag:", error);
        throw new Error("Erro ao carregar dados da tag.");
    }
};

export const fetchDrivers = async () => {
    const apiUrl = 'https://apim-aza-dev.azure-api.net/radioactive_portal/driver/active';

    try {
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Ocp-Apim-Subscription-Key": process.env.NEXT_PUBLIC_API_KEY,
            },
        });

        if (!response.ok) {
            throw new Error(`Falha ao buscar dados dos condutores. Status: ${response.status}`);
        }

        const responseData = await response.json();
        //console.log(responseData.data)
        return responseData.data;
    } catch (error) {
        console.error("Erro ao buscar dados dos condutores:", error);
        throw new Error("Erro ao carregar os condutores.");
    }
};
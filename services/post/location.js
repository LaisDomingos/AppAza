import { saveLocations } from "../../database/location";

export const sendLocation = async (latitude, longitude, tag, descricao) => {
    const apiUrl = "http://172.20.10.2:4000/api/location"; // URL da sua API
    try {
        // Payload que será enviado para a API
        const payload = {
            latitude,
            longitude,
            tag,
            descricao
        };

        console.log("Payload enviado:", payload);

        // Enviar a requisição POST para a API
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const responseBody = await response.json();
            throw new Error(responseBody.error || 'Erro ao enviar a localização.');
        }

        // Receber e tratar a resposta da API
        const responseBody = await response.json();
        console.log("Resposta da API:", responseBody);

        // Se a resposta for bem-sucedida, retorna o que for necessário
        return responseBody;
    } catch (error) {
        // console.error("Erro ao enviar localização:", error.message);

        // Se o envio falhar, salvar localmente no SQLite
        // saveLocations([{ latitude, longitude, tag, descricao, sent: 0 }]);

        throw error;
    }
};
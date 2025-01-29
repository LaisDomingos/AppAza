const fetch = require("node-fetch");

const fetchDriver = async ({ driver_name, plate, destination_name }) => {
    console.log("back:", driver_name, plate, destination_name)
    if (!driver_name || !plate || !destination_name) {
        throw new Error("Todos os campos são obrigatórios");
    }

    const apiUrl = "http://172.20.10.2:3000/api/drivers"; // URL da API de criação de motorista

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                driver_name,
                plate,
                destination_name,
            }),
        });

        if (!response.ok) {
            throw new Error(`Falha ao criar motorista. Status: ${response.status}`);
        }

        const data = await response.json();
        return data; // Retorna os dados criados
    } catch (error) {
        console.error("Erro ao criar motorista:", error);
        throw new Error("Erro ao criar motorista.");
    }
};


module.exports = fetchDriver;

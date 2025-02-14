const fetch = require("node-fetch");

const fetchDriver = async ({
    unidad,
    supplier_name,
    supplier_rut,
    truck_brand,
    plate,
    radioactive_status,
    date_time,
    driver_rut,
    driver_name,
    material_destination_name,
    material_destination_code,
    version_name,
    version_code,
    material_origen_name = 'material_origen', // Valores padrão definidos aqui
    material_origen_code = '001',
    destination_location_code,
    destination_location_name,
}) => {
    if (
        [unidad, supplier_name, supplier_rut, truck_brand, plate, date_time, driver_rut, driver_name, 
        material_destination_name, material_destination_code, version_name, version_code, 
        destination_location_code, destination_location_name].some((field) => field == null)
    ) {
        throw new Error("Todos os campos são obrigatórios.");
    }

    const radioactive = !!radioactive_status; // Transforma valores como 1, true em `true` e 0, false em `false`

    // Validação de data (opcional, mas recomendada)
    if (isNaN(new Date(date_time).getTime())) {
        throw new Error("Formato de data inválido.");
    }

    const apiUrl = "https://apim-aza-dev.azure-api.net/middleware/api/truck_queue";

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                unidad,
                supplier_name,
                supplier_rut,
                truck_brand,
                plate,
                radioactive,
                date_time,
                driver_rut,
                driver_name,
                material_destination_name,
                material_destination_code,
                version_name,
                version_code,
                material_origen_name,
                material_origen_code,
                destination_location_code,
                destination_location_name,
            }),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Falha ao criar motorista. Status: ${response.status}. Detalhes: ${errorBody}`);
        }

        const data = await response.json();
        return data; // Retorna os dados criados
    } catch (error) {
        console.error("Erro ao criar motorista:", error.message);
        throw error; // Lança o erro novamente para ser tratado em outro lugar
    }
};

module.exports = fetchDriver;

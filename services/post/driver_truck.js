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
    material_origen_name,
    material_origen_code,
    destination_location_code,
    destination_location_name,
}) => {
    if (
        !unidad ||
        !supplier_name ||
        !supplier_rut ||
        !truck_brand ||
        !plate ||
        !radioactive_status ||
        !date_time ||
        !driver_rut ||
        !driver_name ||
        !material_destination_name ||
        !material_destination_code ||
        !version_name ||
        !version_code ||
        !destination_location_code ||
        !destination_location_name
    ) {
        throw new Error("Todos os campos são obrigatórios");
    }

    const apiUrl = "http://172.20.10.2:4000/api/drivers"; // URL da API de criação de motorista

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
                radioactive_status,
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
            throw new Error(`Falha ao criar motorista. Status: ${response.status}`);
        }

        const data = await response.json();
        return data; // Retorna os dados criados
    } catch (error) {
        //console.error("Erro ao criar motorista:", error);
        //throw new Error("Erro ao criar motorista.");
    }
};

module.exports = fetchDriver;

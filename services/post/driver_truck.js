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
    material_origen_name = 'material_origen',
    material_origen_code = '001',
    destination_location_code,
    destination_location_name,
}) => {
    //console.log("aqui:", unidad, supplier_name, supplier_rut, truck_brand, plate, radioactive_status, date_time, driver_rut, driver_name, material_destination_name, material_destination_code, version_name, version_code, material_origen_name, material_origen_code, destination_location_code, destination_location_name);

    if (
        [unidad, supplier_name, supplier_rut, truck_brand, plate, date_time, driver_rut, driver_name, 
        material_destination_name, material_destination_code, version_name, version_code, 
        destination_location_code, destination_location_name].some((field) => field == null)
    ) {
        throw new Error("Todos os campos são obrigatórios.");
    }

    const apiUrl = "http://192.168.0.107:4000/api/drivers";

    try {
        const payload = {
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
        };

        //console.log("Enviando payload:", JSON.stringify(payload, null, 2));

        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        console.log("Response status:", response.status);
        const responseBody = await response.text();
        //console.log("Response body:", responseBody);

        if (!response.ok) {
            throw new Error(`Falha ao criar motorista. Status: ${response.status}. Detalhes: ${responseBody}`);
        }

        return JSON.parse(responseBody); // Retorna os dados criados
    } catch (error) {
        console.error("Erro ao criar motorista:", error.message);
        throw error;
    }
};

module.exports = fetchDriver;

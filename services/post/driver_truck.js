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

    const apiUrl = "https://apim-aza-dev.azure-api.net/middleware/api/truck_queue/";

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
                "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzNGVmYjBlM2FiOTI4MDA1MGMzOTExZiIsIm5hbWUiOiJhZG1pbiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTczOTg3NzEwMywiZXhwIjoxNzM5OTA1OTAzfQ.FVOoe0JHzTHy_wuzbY8tPi-AdQUL-adAiqsKC29ciRI",
                "Ocp-Apim-Subscription-Key": "db16736cbf5149e7bcff9a86d27da1ac"
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

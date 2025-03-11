import { getLocationsZero } from "../../database/location";
import { sendLocation } from "../../services/post/location";
import { updateLocationSentStatus } from "../../database/location";

export const resendLocations = async () => {
    try {
        const locations = await getLocationsZero(); // Buscar locais com sent = 0

        console.log("Tentando reenviar locais não enviados:", locations);
        
        for (const location of locations) {
            try {
                const response = await sendLocation(
                    location.latitude,
                    location.longitude,
                    location.tag,
                    location.descricao
                );

                if (response) {
                    console.log(`Localização ID ${location.id} enviada com sucesso!`);

                    // Atualiza o status para 'sent = 1' apenas se a API confirmar o envio
                    await updateLocationSentStatus(location.id);
                }
            } catch (error) {
                console.error(`Erro ao reenviar localização ID ${location.id}:`);
            }
        }
    } catch (error) {
        console.error("Erro ao buscar localizações não enviadas:");
    }
};

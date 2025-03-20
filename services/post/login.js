import AsyncStorage from '@react-native-async-storage/async-storage';

export const fetchLogin = async (driver_id, rutNumber) => {
  const apiUrl = "https://apim-aza-dev.azure-api.net/radioactive_portal/driver/login";
  try {
    const payload = {
      driver_id,
      rutNumber
    };

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": process.env.NEXT_PUBLIC_API_KEY,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const responseBody = await response.json(); // Recebe a resposta em JSON para analisar detalhes
      if (response.status === 401) {
        throw new Error('RUT ou motorista incorreto.');
      } else {
        throw new Error('Encontrado um erro, tente novamente.');
      }
    }

    const responseBody = await response.json();

    // Verifica se o token existe antes de armazená-lo
    const token = responseBody.data.token;  // Presumindo que o token está no corpo da resposta

    return token;
  } catch (error) {
    console.error("Erro ao criar motorista:", error.message);
    throw error;
  }
};
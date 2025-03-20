import Geolocation from "@react-native-community/geolocation";
import { sendLocation } from "../../services/post/location";
import { saveLocations } from "../../database/location";
import { Alert } from "react-native";

export const getLocation = (tag: string, descricao: string): void => {
    Geolocation.getCurrentPosition(

      position => {
        const { latitude, longitude } = position.coords;
        sendLocation(latitude, longitude, tag, descricao).catch((error) => {
          console.warn('Erro ao enviar localização:', error);

          // Em caso de erro ao enviar a localização, salva localmente
          saveLocations([{ latitude, longitude, tag: "890190", descricao: "Tag Two", sent: 0 }]);
        });
      },
      error => {
        console.warn('Erro ao obter localização:', error);
        Alert.alert("Error", "No se pudo obtener la ubicación.");
      },
      {
        enableHighAccuracy: false,
        timeout: 15000,
        maximumAge: 10000,
      }
    );
  }
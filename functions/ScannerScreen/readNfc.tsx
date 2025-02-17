import { Alert } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { saveLocations } from '../../database/location';
import { updateTruckDetails, updateRadioactiveStatus, getPendingData, getData } from '../../database/sqliteDatabase';
import { sendPendingData } from './sendPendingData';
import { requestLocationPermission } from './requestLocationPermission';

const tags = [
  '2fnoou7igp2gh7h3',
  'xg8yuklldnx7ez6f',
  'fyau3gdxxsos9h3m',
  '2gyvmjgbb4g1u5nl',
  'wxkzfyq5blznmkcn',
  'nekqafsjasvq5r0s'
];

export async function readNfc(scanCount: number, setScanCount: React.Dispatch<React.SetStateAction<number>>, truck_id: number, navigation: any) {
  try {
    // Verificação de permissão de localização
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      Alert.alert('Erro', 'Permissão de localização não concedida.');
      return;
    }

    Geolocation.getCurrentPosition(
      async position => {
        const { latitude, longitude } = position.coords;

        const newCount = scanCount + 1;
        console.log('newCount:', newCount)
        setScanCount(newCount);
        await AsyncStorage.setItem('scanCount', newCount.toString());

        if (newCount === 1) {
          const randomTag = tags[Math.floor(Math.random() * tags.length)];
          saveLocations([
            {
              latitude: latitude.toString(),
              longitude: longitude.toString(),
              tag: randomTag,
              material: 'Material especificado',
            },
          ]);

          updateTruckDetails(
            truck_id,
            'CONSUMO-CHATARRA BOLAS',
            '56000523',
            '',
            '',
            'CLASIFICACION',
            'V001'
          );

          Alert.alert('Material', `Material: CONSUMO-CHATARRA BOLAS`, [
            {
              text: 'OK',
              onPress: () => {
                setTimeout(() => {
                  navigation.navigate('StartRoute', { truck_id });
                }, 500);
              },
            },
          ]);
        } else if (newCount === 2) {
          saveLocations([
            {
              latitude: latitude.toString(),
              longitude: longitude.toString(),
              tag: 'Tag radioativa',
              material: 'radioativo',
            },
          ]);

          updateRadioactiveStatus(truck_id, true);
          sendPendingData();

          Alert.alert('Portal radioativo', `El conductor pasó por el portal radiactivo.`, [
            {
              text: 'OK',
              onPress: () => {
                setTimeout(() => {
                  navigation.navigate('StartRoute', { truck_id });
                }, 500);
              },
            },
          ]);
        } else if (newCount >= 3) {
          /*saveLocations([
            {
              latitude: latitude.toString(),
              longitude: longitude.toString(),
              tag: 'Tag pesagem',
              material: 'pesagem',
            },
          ]);*/
          const trucks = await getData();

          // Filtra os dados com 'sent' igual a 0
          const sentEqualZero = trucks.filter(truck => truck.sent === 0);
          console.log('Trucks com sent igual a 0:', sentEqualZero);
          // Verifica se não há trucks com 'sent' igual a 0
          if (sentEqualZero.length === 0) {
            Alert.alert('Éxito', 'No hay datos pendientes para ser enviados.');
            return;
          } else {

            const state = await NetInfo.fetch();
            if (state.isConnected) {
              const success = await sendPendingData();
              if (success) {
                Alert.alert('Éxito', 'Datos enviados con éxito!', [
                  {
                    text: 'OK',
                    onPress: () => {
                      setTimeout(() => {
                        navigation.navigate('StartRoute', { truck_id });
                      }, 500);
                    },
                  },
                ]);
              } else {
                Alert.alert('Error', 'No se pudo enviar los datos. Inténtalo de nuevo.');
              }
            } else {
              Alert.alert('Error', 'Sin conexión a internet.');
            }
          }
        }
      },
      error => {
        console.warn('Erro ao obter localização:', error);
        Alert.alert('Erro', 'Não foi possível obter a localização.');
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      }
    );
  } catch (ex) {
    console.error('Erro no readNfc:', ex);
    Alert.alert('Erro', 'Erro ao ler o RFID');
  }
}

/*/ Faz a leitura "falsa" do NFC
 async function readNdef() {
   try {
     const newCount = scanCount + 1;
     setScanCount(newCount);
     await AsyncStorage.setItem('scanCount', newCount.toString());

     if (newCount === 1) {
       /*const randomTag = tags[Math.floor(Math.random() * tags.length)];
       const tagData = await fetchTruckByTag(randomTag);
       updateTruckDetails(
         truck_id,
         tagData.description,
         tagData.code,
         "",
         "",
         tagData.process[0].description,
         tagData.process[0].code
       );

       if (tagData?.description) {
         Alert.alert('Material', `Material: ${tagData.description}`, [
           {
             text: 'OK',
             onPress: () => {
               setTimeout(() => {
                 navigation.navigate('StartRoute', { truck_id });
               }, 500);
             },
           },
         ]);
       } else {
         Alert.alert('Erro', 'Não foi possível encontrar o material para essa tag.');
       }*/
/*updateTruckDetails(
truck_id,
"CONSUMO-CHATARRA BOLAS",
"56000523",
"",
"",
"CLASIFICACION",
"V001"
);
Alert.alert('Material', `Material: CONSUMO-CHATARRA BOLAS`, [
{
  text: 'OK',
  onPress: () => {
    setTimeout(() => {
      navigation.navigate('StartRoute', { truck_id });
    }, 500);
  },
},
]);

} else if (newCount === 2) {
updateRadioactiveStatus(truck_id, true);
sendPendingData();
Alert.alert('Portal radioativo', `El conductor pasó por el portal radiactivo.`, [
{
  text: 'OK',
  onPress: () => {
    setTimeout(() => {
      navigation.navigate('StartRoute', { truck_id });
    }, 500);
  },
},
]);
} else if (newCount === 3) {
const state = await NetInfo.fetch();
if (state.isConnected) {
const pendingDataExists = await getPendingData();
if (pendingDataExists.length === 0) {
  console.log("Nenhum dado pendente para enviar.");
  Alert.alert('Erro', 'Nenhum dado pendente para envio.');
  return; // Interrompe o fluxo
} else {
  const success = await sendPendingData(); // Tenta enviar dados pendentes
  if (success) {
    Alert.alert('Sucesso', 'Dados enviados com sucesso!', [
      {
        text: 'OK',
        onPress: () => {
          setTimeout(() => {
            navigation.navigate('StartRoute', { truck_id });
          }, 500);
        },
      },
    ]);
  } else {
    Alert.alert('Erro', 'Não foi possível enviar os dados. Tente novamente.');
  }
}
} else {
Alert.alert('Erro', 'Sem conexão com a internet.');
}
}
} catch (ex) {
console.error("Erro no readNdef:", ex);
Alert.alert('Erro', 'Erro ao ler o RFID');
}
}*/
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import NfcManager from 'react-native-nfc-manager';
import { resendLocations } from '../functions/Scanner/resendLocation';
import { setupDatabase } from '../database/location';
import { styles } from '../styles/Scanner.styles';
import { readNFC } from '../functions/Scanner/readNFC';
import { StackNavigationProp } from '@react-navigation/stack';
import PopupJustify from '../components/popUpJustify';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loadMaterial, Material } from '../functions/Scanner/loadMaterial';
import { materialReader } from '../functions/Scanner/materialReader';

export type RootStackParamList = {
  StartRoute: undefined;
  Scanner: {
    truck_id: number;
  };
};

type ScannerScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Scanner'>;

type Props = {
  navigation: ScannerScreenNavigationProp;
  route: any;
};

NfcManager.start();

function ScannerScreen({ navigation, route }: Props) {
  const { truck_id } = route.params;
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [etapa, setEtapa] = useState<string | null>(null);
  const [sensor, setSensor] = useState(false);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const showPopup = (message: string) => {
    setPopupMessage(message);
    setPopupVisible(true);
  };

  const closePopup = () => {
    setPopupVisible(false);
  };

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const loadedMaterials = await loadMaterial();
        setMaterials(loadedMaterials);
      } catch (error) {
        console.error('Erro ao carregar materiais:', error);
      }
    };

    fetchMaterials();

    const searchStage = async () => {
      try {
        const etapaAt = await AsyncStorage.getItem('currentStep');
        if (etapaAt) {
          setEtapa(etapaAt.toUpperCase());
        }
      } catch (error) {
        console.error('Erro ao buscar a etapa atual:', error);
      }
    };

    searchStage();
    setupDatabase();
    resendLocations();
  }, []);

  const handleContinue = () => {
    if (selectedMaterial) {
      // Mostrar informações no console
      selectedMaterial.process.forEach(async (process) => {
        await materialReader(truck_id, selectedMaterial.id, navigation);
      });
    } else {
      console.log('Nenhum material selecionado');
    }
  };

  return (
    <>
      <View style={styles.wrapper}>
        <View style={styles.iconContainer}>
          <Image source={require('../assets/nfc-phone.png')} style={styles.phoneImage} />
        </View>
  
        <Text style={styles.title}>NFC Scanner</Text>
  
        {!sensor && (
          <TouchableOpacity style={styles.button} onPress={() => readNFC(truck_id, showPopup, navigation)}>
            <Text style={styles.buttonText}>Scan a Tag</Text>
          </TouchableOpacity>
        )}
  
        {/* Condicional para mostrar o botão "Sem Sensor" apenas quando a etapa for "MATERIAL" */}
        {etapa === 'MATERIAL' && !showDropdown && (
          <TouchableOpacity
            style={styles.noSensorButton}
            onPress={() => {
              setSensor(true);
              setShowDropdown(true);
            }}
          >
            <Text style={styles.noSensorButtonText}>Sem Sensor</Text>
          </TouchableOpacity>
        )}
  
        {/* Exibe o dropdown e o botão Continuar se a etapa for "MATERIAL" e o dropdown estiver visível */}
        {showDropdown && (
          <SelectDropdown
            data={materials} // Passando a lista de objetos materiais
            onSelect={(item) => setSelectedMaterial(item)} // Guarda o objeto completo
            renderButton={(selectedItem) => (
              <View style={styles.dropdownButtonStyle}>
                <Text style={styles.dropdownButtonTxtStyle}>
                  {selectedItem ? selectedItem.label : 'Selecione um material'}
                </Text>
              </View>
            )}
            renderItem={(item, _, isSelected) => (
              <View
                style={{
                  ...styles.dropdownItemStyle,
                  ...(isSelected && { backgroundColor: '#D2D9DF' }),
                }}
              >
                <Text style={styles.dropdownItemTxtStyle}>{item.label}</Text>
              </View>
            )}
            showsVerticalScrollIndicator={false}
            dropdownStyle={styles.dropdownMenuStyle}
          />
        )}
  
        {/* Botão Continuar */}
        {showDropdown && (
          <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
            <Text style={styles.continueButtonText}>Continuar</Text>
          </TouchableOpacity>
        )}
      </View>
  
      <PopupJustify
        visible={isPopupVisible}
        message={popupMessage}
        buttonMessage1="OK"
        buttonMessage2="Cancelar"
        onButton1Press={() => {
          closePopup();
        }}
        onButton2Press={closePopup}
        onClose={closePopup}
        truck_id={truck_id}
        navigation={navigation}
      />
    </>
  );
  
}

export default ScannerScreen;

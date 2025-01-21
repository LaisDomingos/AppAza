import React, { useState } from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown'; // Importando o SelectDropdown
import { StackNavigationProp } from '@react-navigation/stack';
export type RootStackParamList = {
  Scanner: undefined; // Home não recebe parâmetros
  DestinationPoint: undefined; // Scanner não recebe parâmetros
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Scanner'>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

export default function DestinationPoint({ navigation }: Props) {
  const [selectedSetor, setSelectedSetor] = useState<string | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);

  const setores = ['Setor A', 'Setor B', 'Setor C'];
  const materiaisPorSetor: Record<string, string[]> = {
    'Setor A': ['Material A1', 'Material A2', 'Material A3'],
    'Setor B': ['Material B1', 'Material B2', 'Material B3'],
    'Setor C': ['Material C1', 'Material C2', 'Material C3'],
  };

  const handleStart = () => {
    console.log('Setor selecionado:', selectedSetor);
    console.log('Material selecionado:', selectedMaterial);
    navigation.navigate('Scanner'); 
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Exibindo a imagem da logo */}
      <Image source={require('../assets/logo.png')} style={styles.logo} />

      {/* Nome - Seletor de opções (SelectDropdown) */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Puesto de Descarga:</Text>
        <SelectDropdown
          data={setores} // Usando a lista de nomes
          onSelect={(setor) => {
            setSelectedSetor(setor);
            setSelectedMaterial(null); // Resetar material ao mudar o setor
          }}
          renderButton={(selectedItem) => {
            return (
              <View style={styles.dropdownButtonStyle}>
                <Text style={styles.dropdownButtonTxtStyle}>
                  {selectedItem || 'Selecione um setor'} {/* Condicional para exibir texto */}
                </Text>
              </View>
            );
          }}
          renderItem={(item, _, isSelected) => {
            return (
              <View style={{ ...styles.dropdownItemStyle, ...(isSelected && { backgroundColor: '#D2D9DF' }) }}>
                <Text style={styles.dropdownItemTxtStyle}>{item}</Text>
              </View>
            );
          }}
          showsVerticalScrollIndicator={false}
          dropdownStyle={styles.dropdownMenuStyle}
        />
      </View>


      {/* Dropdown para selecionar o Material */}
      {selectedSetor && (
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Material:</Text>
        <SelectDropdown
          data={materiaisPorSetor[selectedSetor]} // Usando a lista de patentes
          onSelect={(material) => setSelectedMaterial(material)} // Atualiza o estado com a patente selecionada
          renderButton={(selectedItem) => {
            return (
              <View style={styles.dropdownButtonStyle}>
                <Text style={styles.dropdownButtonTxtStyle}>
                  {selectedItem || 'Selecione um material'} {/* Condicional para exibir texto */}
                </Text>
              </View>
            );
          }}
          renderItem={(item, index, isSelected) => {
            return (
              <View style={{ ...styles.dropdownItemStyle, ...(isSelected && { backgroundColor: '#D2D9DF' }) }}>
                <Text style={styles.dropdownItemTxtStyle}>{item}</Text>
              </View>
            );
          }}
          showsVerticalScrollIndicator={false}
          dropdownStyle={styles.dropdownMenuStyle}
        />
      </View>
      )}
      

      {/* Botão de login com fundo azul */}
      <TouchableOpacity style={styles.button} onPress={handleStart}>
        <Text style={styles.buttonText}>Iniciar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F1F1F1',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
  },
  logo: {
    width: 150, // Largura da logo
    height: 150, // Altura da logo
    marginBottom: 20,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  input: {
    height: 40,
    backgroundColor: '#E9ECEF',
    borderRadius: 12,
    borderColor: 'black',
    width: '100%',
    paddingLeft: 10,
    color: 'black',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: 'black',
  },
  button: {
    backgroundColor: '#0066cc',
    paddingVertical: 10,
    paddingHorizontal: 50,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  error: {
    marginTop: 20,
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  dropdownButtonStyle: {
    width: '100%',
    height: 50,
    backgroundColor: '#E9ECEF',
    borderRadius: 12,
    borderColor: 'black',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: '#151E26',
  },
  dropdownMenuStyle: {
    backgroundColor: '#E9ECEF',
    borderRadius: 8,
  },
  dropdownItemStyle: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: '#151E26',
  },
});
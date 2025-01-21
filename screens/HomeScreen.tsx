import React, { useState } from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown'; // Importando o SelectDropdown
import { StackNavigationProp } from '@react-navigation/stack';
export type RootStackParamList = {
  Home: undefined; // Home não recebe parâmetros
  DestinationPoint: undefined; // Scanner não recebe parâmetros
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

export default function HomeScreen({ navigation }: Props) {
  const [nome, setNome] = useState<string>(''); // Estado para o nome
  const [rut, setRut] = useState<string>(''); 
  const [patente, setPatente] = useState<string>(''); 
  const [erro, setErro] = useState<string>(''); // Estado para mensagem de erro

  const nomes = [
    'João', 'Maria', 'Carlos', 'Ana', 'Pedro', 'Fernanda', 'Rafael', 'Luciana', 'Roberta', 'Gustavo'
  ]; // Lista de nomes para o select

  const patentes = [
    'ABC1234', 'DEF5678', 'GHI9012', 'JKL3456', 'MNO7890', 
    'PQR1122', 'STU3344', 'VWX5566', 'YZA7788', 'BCD9900'
  ];// Lista de patentes para o select

  const handleLogin = () => {
    // Verificar se os campos estão vazios
    if (!nome || !rut || !patente) {
      setErro('Por favor, preencha todos os campos obrigatórios.');
      return; // Não prossegue se algum campo estiver vazio
    }

    // Limpar mensagem de erro caso todos os campos estejam preenchidos
    setErro('');
    console.log('Login', nome, rut, patente);
    navigation.navigate('DestinationPoint'); 
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Exibindo a imagem da logo */}
      <Image source={require('../assets/logo.png')} style={styles.logo} />

      {/* Nome - Seletor de opções (SelectDropdown) */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nombre:</Text>
        <SelectDropdown
          data={nomes} // Usando a lista de nomes
          onSelect={(selectedItem) => setNome(selectedItem)} // Atualiza o estado com o nome selecionado
          renderButton={(selectedItem, isOpened) => {
            return (
              <View style={styles.dropdownButtonStyle}>
                <Text style={styles.dropdownButtonTxtStyle}>
                  {selectedItem || 'Selecione seu nome'} {/* Condicional para exibir texto */}
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

      {/* RUT */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>RUT:</Text>
        <TextInput
          style={styles.input}
          onChangeText={setRut}
          value={rut}
          placeholder="Digite seu RUT"
          keyboardType="numeric"
        />
      </View>

      {/* Patente - Novo Dropdown */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Patente:</Text>
        <SelectDropdown
          data={patentes} // Usando a lista de patentes
          onSelect={(selectedItem) => setPatente(selectedItem)} // Atualiza o estado com a patente selecionada
          renderButton={(selectedItem, isOpened) => {
            return (
              <View style={styles.dropdownButtonStyle}>
                <Text style={styles.dropdownButtonTxtStyle}>
                  {selectedItem || 'Selecione sua patente'} {/* Condicional para exibir texto */}
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

      {/* Exibindo a mensagem de erro, se houver */}
      {erro ? <Text style={styles.error}>{erro}</Text> : null}

      {/* Botão de login com fundo azul */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F1F1F1',
    alignItems: 'center',  // Centraliza horizontalmente
    justifyContent: 'center',  // Centraliza verticalmente
    padding: 20,
  },
  logo: {
    width: 200, // Largura da logo
    height: 200, // Altura da logo
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
    paddingHorizontal: 160,
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

import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    wrapper: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f8f9fa',
    },
    iconContainer: {
      marginBottom: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
    phoneImage: {
      width: 200,
      height: 200,
      resizeMode: 'contain',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 20,
    },
    button: {
      backgroundColor: '#0066cc',
      paddingVertical: 12,
      paddingHorizontal: 30,
      borderRadius: 25,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
      elevation: 5,
    },
    buttonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: '600',
    },
    noSensorButton: {
      position: 'absolute',
      bottom: 20,
      left: 20,
      backgroundColor: '#d9534f',
      padding: 10,
      borderRadius: 5,
    },
    noSensorButtonText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    dropdownButtonStyle: {
      width: '80%',
      backgroundColor: '#ddd',
      padding: 10,
      borderRadius: 8,
      alignSelf: 'center',
    },
    dropdownButtonTxtStyle: {
      color: '#333',
      textAlign: 'center',
      fontSize: 16,
    },
    dropdownItemStyle: {
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
    },
    dropdownItemTxtStyle: {
      fontSize: 16,
      color: '#333',
    },
    dropdownMenuStyle: {
      backgroundColor: '#fff',
      borderRadius: 8,
    },
    continueButton: {
      backgroundColor: '#0066cc',
      padding: 12,
      borderRadius: 8,
      marginTop: 20,
      alignSelf: 'center',
      width: '80%',  // Aumenta a largura do botão (pode ajustar conforme necessário)
    },
    
    continueButtonText: {
      color: '#fff',
      fontWeight: 'bold',
      textAlign: 'center',
    },
  });
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
  });
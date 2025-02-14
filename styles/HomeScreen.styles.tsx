import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      backgroundColor: '#F1F1F1',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    },
    logo: {
      width: 200,
      height: 200,
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
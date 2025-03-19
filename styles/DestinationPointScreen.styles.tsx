import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f4f8',
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 10, // Move tudo um pouco para cima
    },
    logo: {
        width: 200,
        height: 200,
        marginBottom: 5, 
        marginTop: -100// Reduz o espaço abaixo da logo
    },
    inputContainer: {
        width: '90%',
        marginBottom: 15, // Reduzi um pouco a margem inferior
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        color: 'black',
    },
    dropdownButtonStyle: {
        width: '100%',
        height: 50,
        backgroundColor: '#E9ECEF',
        borderRadius: 12,
        borderColor: 'black',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
    },
    dropdownButtonTxtStyle: {
        fontSize: 16,
        color: '#151E26',
        textAlign: 'left',
        flex: 1,
    },
    dropdownMenuStyle: {
        backgroundColor: '#E9ECEF',
        borderRadius: 8,
    },
    dropdownItemStyle: {
        paddingHorizontal: 12,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 8,
    },
    dropdownItemTxtStyle: {
        fontSize: 16,
        color: '#151E26',
    },
    errorText: {
        color: 'red',
        fontSize: 14,
        marginBottom: 10,
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#0066cc',
        paddingVertical: 10,
        paddingHorizontal: 120,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        textAlign: 'center',
    },
});

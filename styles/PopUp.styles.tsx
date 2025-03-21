import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    popup: {
        backgroundColor: '#D9D9D9',
        padding: 10,
        borderRadius: 10,
        width: '90%',
        alignItems: 'center',
    },
    message: {
        fontSize: 18,
        marginBottom: 20,
        textAlign: 'center',
    },
    errorMessage: {
        fontSize: 14,
        color: 'red', // Pode ser vermelho para indicar erro
        textAlign: 'center',
        marginTop: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
    },
    buttonText: {
        fontSize: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        fontWeight: 'bold',
    },
    yesText: {
        color: 'green',
    },
    noText: {
        color: 'red',
    },
    buttonBorderYes: {
        marginRight: 10
    },
    buttonBorderNo: {
        marginLeft: 10
    },
    input: {
        width: '100%',
        height: 100,
        borderWidth: 0.5,
        borderRadius: 5,
        paddingHorizontal: 5,
        backgroundColor: '#D9D9D9',
    },
});
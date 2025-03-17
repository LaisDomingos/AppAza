import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    containerTop: {
        flexDirection: 'row', // Mantém os elementos lado a lado
        alignItems: 'center', // Alinha os itens verticalmente
        marginLeft: 55,
        marginTop: 30,
    },
    nameContainer: {
        flexDirection: 'column', // Nome e patente ficam empilhados
        marginRight: 20, // Espaço entre os textos e o botão
    },
    labelData: {
        fontSize: 16,
        marginBottom: 5,
        color: 'gray',
        fontWeight: 'bold', // Deixa o texto em negrito
        marginRight: 10, // Adiciona um espaço entre o texto e o botão
    },
    buttonTurn: {
        backgroundColor: '#EC3F40',
        paddingVertical: 15,
        paddingHorizontal: 12,
        borderRadius: 5,
    },
    buttonTextTurn: {
        color: 'white',
        fontWeight: 'bold',
    },
});
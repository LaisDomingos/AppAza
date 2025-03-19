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
        padding: 20,
        borderRadius: 20,
        width: '80%',
        alignItems: 'center',
    },
    message: {
        fontSize: 18,
        marginBottom: 20,
        textAlign: 'center',
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
        borderColor: '#17519A',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 5,
        backgroundColor: '#D9D9D9',
    },
});
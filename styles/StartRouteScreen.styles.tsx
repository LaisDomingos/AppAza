import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f4f8',
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 200,
        height: 200,
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 30,
    },
    progressContainer: {
        width: '90%',
        height: 10,
        backgroundColor: '#dcdcdc',
        borderRadius: 5,
        overflow: 'hidden',
        marginVertical: 30,
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#4caf50',
        borderRadius: 5,
    },
    pointsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '80%',
    },
    point: {
        alignItems: 'center',
    },
    locationIcon: {
        width: 50,
        height: 50,
        marginBottom: 10,
    },
    truckImage: {
        width: 150,
        height: 50,
    },
    pointText: {
        fontSize: 16,
        color: '#555',
    },
    button: {
        marginTop: 30,
        backgroundColor: '#0066cc',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 30,
        elevation: 3,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
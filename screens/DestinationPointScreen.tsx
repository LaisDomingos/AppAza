import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import SelectDropdown from 'react-native-select-dropdown';
import { StackNavigationProp } from '@react-navigation/stack';
import { fetchMovInternos } from '../services/get/destinationPoint';
import fetchDriver from '../services/post/driver_truck';

export type RootStackParamList = {
    StartRoute: undefined;
    DestinationPoint: undefined;
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'DestinationPoint'>;

type Props = {
    navigation: HomeScreenNavigationProp;
    route: any;
};

export default function DestinationPoint({ navigation, route }: Props) {
    const { nome_driver, patente } = route.params;
    const [selectedSetor, setSelectedSetor] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [setores, setSetores] = useState<string[]>([]);

    useEffect(() => {
        const loadJsonData = async () => {
            try {
                const data = await fetchMovInternos();
                const setoresData = data?.map((item: any) => item);
                setSetores(setoresData || []);
            } catch (error) {
                console.error('Erro ao carregar dados do JSON:', error);
            }
        };

        // Tenta enviar os dados armazenados localmente quando o componente é montado
        sendSavedData();
        loadJsonData();
    }, []);

    const saveDataLocally = async (data: object) => {
        try {
            const savedData = await AsyncStorage.getItem('@pending_data');
            const parsedData = savedData ? JSON.parse(savedData) : [];
            parsedData.push(data);
            await AsyncStorage.setItem('@pending_data', JSON.stringify(parsedData));
            console.log('Dados salvos localmente:', parsedData);
        } catch (error) {
            console.error('Erro ao salvar dados localmente:', error);
        }
    };

    const sendSavedData = async () => {
        try {
            const savedData = await AsyncStorage.getItem('@pending_data');
            if (!savedData) return;

            const parsedData = JSON.parse(savedData);
            for (const item of parsedData) {
                try {
                    await fetchDriver(item);
                    console.log('Dados enviados com sucesso:', item);
                } catch (error) {
                    console.error('Erro ao enviar dados:', error);
                    return; // Para tentar novamente no próximo ciclo
                }
            }
            await AsyncStorage.removeItem('@pending_data');
        } catch (error) {
            console.error('Erro ao enviar dados salvos:', error);
        }
    };

    const handleStart = async () => {
        if (!selectedSetor) {
            setErrorMessage('Por favor, selecione um setor.');
            return;
        }

        setErrorMessage(null);
        console.log('Setor selecionado:', selectedSetor);

        const driverData = {
            driver_name: nome_driver,
            plate: patente,
            destination_name: selectedSetor,
        };

        try {
            const networkState = await NetInfo.fetch();
            if (networkState.isConnected) {
                console.log("connect")
                // Envia os dados diretamente ao servidor
                await fetchDriver(driverData);
                console.log('Dados enviados ao servidor:', driverData);
            } else {
                // Salva localmente se não houver conexão
                console.log("not connect")
                await saveDataLocally(driverData);
                console.log('Dados salvos localmente (sem internet).');
            }
            navigation.navigate('StartRoute');
        } catch (error) {
            console.error('Erro ao processar motorista:', error);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Image source={require('../assets/logo.png')} style={styles.logo} />

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Puesto de Descarga:</Text>
                <SelectDropdown
                    data={setores}
                    onSelect={(setor) => {
                        setSelectedSetor(setor);
                        setErrorMessage(null);
                    }}
                    renderButton={(selectedItem) => (
                        <View style={styles.dropdownButtonStyle}>
                            <Text style={styles.dropdownButtonTxtStyle}>
                                {selectedItem || 'Selecione um setor'}
                            </Text>
                        </View>
                    )}
                    renderItem={(item, _, isSelected) => (
                        <View
                            style={{
                                ...styles.dropdownItemStyle,
                                ...(isSelected && { backgroundColor: '#D2D9DF' }),
                            }}
                        >
                            <Text style={styles.dropdownItemTxtStyle}>{item}</Text>
                        </View>
                    )}
                    showsVerticalScrollIndicator={false}
                    dropdownStyle={styles.dropdownMenuStyle}
                />
            </View>

            {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

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
        justifyContent: 'center',
        padding: 20,
    },
    logo: {
        width: 150,
        height: 150,
        marginBottom: 20,
    },
    inputContainer: {
        width: '90%',
        marginBottom: 20,
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
        paddingHorizontal: 160,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        textAlign: 'center',
    },
});

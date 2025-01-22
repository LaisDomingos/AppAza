import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import { StackNavigationProp } from '@react-navigation/stack';
import { fetchMovInternos } from '../services/get/destinationPoint'; // Atualize o caminho

export type RootStackParamList = {
    Scanner: undefined;
    DestinationPoint: undefined;
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Scanner'>;

type Props = {
    navigation: HomeScreenNavigationProp;
};

export default function DestinationPoint({ navigation }: Props) {
    const [selectedSetor, setSelectedSetor] = useState<string | null>(null);
    const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [jsonData, setJsonData] = useState<any>(null); // Estado para armazenar dados do JSON
    const [setores, setSetores] = useState<string[]>([]); // Corrigido para um array de strings
    const [materiaisPorSetor, setMateriaisPorSetor] = useState<Record<string, string[]>>({}); // Estado para armazenar materiais por setor

    useEffect(() => {
        // Busca os dados do JSON ao montar o componente
        const loadJsonData = async () => {
            try {
                const data = await fetchMovInternos();
                setJsonData(data);
                console.log('Dados do JSON:', data); // Exibe os dados no console

                // Exibe todos os setores no console
                const setoresData = data?.map((item: any) => item.setor);
                console.log('Setores:', setoresData); // Mostra todos os setores no console
                setSetores(setoresData || []); // Atualiza o estado com os setores

                // Acessando os materiais e associando a seus setores
                const materiaisPorSetor = data?.reduce((acc: any, item: any) => {
                    acc[item.setor] = item.materiais.map((material: any) => material.nombreApp);
                    return acc;
                }, {});

                console.log('Materiais por Setor:', materiaisPorSetor); // Exibe os materiais por setor
                setMateriaisPorSetor(materiaisPorSetor); // Atualiza o estado com os materiais por setor
            } catch (error) {
                console.error('Erro ao carregar dados do JSON:', error);
            }
        };

        loadJsonData();
    }, []);

    const handleStart = () => {
        if (!selectedSetor) {
            setErrorMessage('Por favor, selecione um setor.');
            return;
        }

        if (!selectedMaterial) {
            setErrorMessage('Por favor, selecione um material.');
            return;
        }

        setErrorMessage(null); // Remove a mensagem de erro ao prosseguir
        console.log('Setor selecionado:', selectedSetor);
        console.log('Material selecionado:', selectedMaterial);
        navigation.navigate('Scanner');
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
                        setSelectedMaterial(null);
                        setErrorMessage(null); // Remove erro ao selecionar
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

            {selectedSetor && materiaisPorSetor[selectedSetor] && (
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Material:</Text>
                    <SelectDropdown
                        data={materiaisPorSetor[selectedSetor] || []}
                        onSelect={(material) => {
                            setSelectedMaterial(material);
                            setErrorMessage(null); // Remove erro ao selecionar
                        }}
                        renderButton={(selectedItem) => (
                            <View style={styles.dropdownButtonStyle}>
                                <Text style={styles.dropdownButtonTxtStyle}>
                                    {selectedItem || 'Selecione um material'}
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
            )}

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

import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
    { name: 'transport.db', location: 'default' },
    () => console.log('Banco de dados Location aberto'),
    error => console.error('Erro ao abrir o banco:', error)
);

export const setupDatabase = () => {
    db.transaction(tx => {
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS location (id INTEGER PRIMARY KEY AUTOINCREMENT, latitude INTEGER, longitude INTEGER, tag TEXT, descricao TEXT, sent INTEGER);',
            [], 
            () => console.log('Tabela "location" criada com sucesso ou já existe.'),
            (_, error) => {
                console.error('Erro ao criar a tabela "location":', error);
                return false;
            }
        );
    });
}

// Salvar localizações no banco de dados
export const saveLocations = (locations: { latitude: number; longitude: number; tag: string; descricao: string; sent: number }[]) => {
    console.log("Salvando as localizações:", locations);  // Console log para ver o que está sendo enviado
    db.transaction(tx => {
        locations.forEach(location => {
            console.log("Enviando para o banco:", location); // Console log para cada local individual
            tx.executeSql(
                'INSERT INTO location (latitude, longitude, tag, descricao, sent) VALUES (?, ?, ?, ?, ?);',
                [location.latitude, location.longitude, location.tag, location.descricao, location.sent]
            );
        });
    });
};

// Buscar localizações no banco de dados
export const getLocations = (): Promise<any[]> => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM location;',
                [],
                (_, { rows }) => {
                    console.log('Localizações armazenados no SQLite:', rows.raw());
                    resolve(rows.raw()); // Retorna os motoristas quando a consulta terminar
                },
                (_, error) => {
                    console.error('Erro ao buscar localização:', error);
                    reject(error); // Retorna um erro, caso ocorra
                    return false;
                }
            );
        });
    });
};

// Busca os com sent 0
export const getLocationsZero = (): Promise<any[]> => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM location WHERE sent = 0;',
                [],
                (_, { rows }) => {
                    const results = [];

                    for (let i = 0; i < rows.length; i++) {
                        results.push(rows.item(i)); // Pega cada item corretamente
                    }

                    if (results.length === 0) {
                        console.log("📭 Não há localizações pendentes para envio.");
                    } else {
                        console.log('📍 Localizações com sent = 0:', results);
                    }

                    resolve(results);
                },
                (_, error) => {
                    console.error('⚠️ Erro ao buscar localizações com sent = 0:', error);
                    resolve([]); // Retorna um array vazio em caso de erro
                    return false;
                }
            );
        });
    });
};

// Update de envio
export const updateLocationSentStatus = (id: number) => {
    db.transaction(tx => {
        tx.executeSql(
            'UPDATE location SET sent = 1 WHERE id = ?;',
            [id],
            () => {
                console.log('Localização marcada como enviada');
            },
            (_, error) => {
                console.error('Erro ao atualizar status "sent":', error);
                return false;
            }
        );
    });
};

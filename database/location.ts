import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
    { name: 'transport.db', location: 'default' },
    () => console.log('Banco de dados aberto'),
    error => console.error('Erro ao abrir o banco:', error)
);

export const setupDatabase = () => {
    db.transaction(tx => {
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS location (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                latitude TEXT,
                longitude TEXT,
                tag TEXT,
                descricao TEXT,
                sent INTEGER DEFAULT 0
            );`,
            [],
            () => console.log('Tabela "location" criada com sucesso ou já existe.'),
            (_, error) => {
                console.error('Erro ao criar a tabela "location":', error);
                return false;
            }
        );
    });
};

// Salvar localizações no banco de dados
export const saveLocations = (locations: { latitude: string; longitude: string; tag: string; material: string; senta: number }[]) => {
    db.transaction(tx => {
        locations.forEach(location => {
            tx.executeSql(
                'INSERT INTO location (latitude, longitude, tag, descricao, sent) VALUES (?, ?, ?, ?, ?);',
                [location.latitude, location.longitude, location.tag, location.material, location.senta]
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
                    console.log('Localizações armazenadas no SQLite:', rows.raw());
                    resolve(rows.raw()); // Retorna as localizações quando a consulta terminar
                },
                (_, error) => {
                    console.error('Erro ao buscar localizações:', error);
                    reject(error); // Retorna um erro, caso ocorra
                    return false;
                }
            );
        });
    });
};

export const getLocationsZero = (): Promise<any[]> => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM location WHERE senta = 0;',
                [],
                (_, { rows }) => {
                    console.log('Localizações com senta = 0:', rows.raw());
                    resolve(rows.raw()); // Retorna os dados filtrados
                },
                (_, error) => {
                    console.error('Erro ao buscar localizações com senta = 0:', error);
                    reject(error);
                    return false;
                }
            );
        });
    });
};

// Atualiza o campo 'senta' para 1 com base no id
export const updateSentStatus = (id: number) => {
    db.transaction(tx => {
        tx.executeSql(
            'UPDATE location SET sent = 1 WHERE id = ?;',
            [id],
            (_, result) => {
                console.log(`Localização com id ${id} atualizada com sucesso.`);
            },
            (_, error) => {
                console.error('Erro ao atualizar localização:', error);
                return false;
            }
        );
    });
};

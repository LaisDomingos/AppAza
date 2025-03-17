import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
    { name: 'transport.db', location: 'default' },
    () => console.log('Banco de dados Location aberto'),
    error => console.error('Erro ao abrir o banco:', error)
);

export const setupDatabase = () => {
    db.transaction(tx => {
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS location (latitude TEXT, longitude TEXT, tag TEXT, descricao TEXT);',
            [],
            // () => console.log('Tabela "location" criada com sucesso ou já existe.'),
            () => {},
            (_, error) => {
                console.error('Erro ao criar a tabela "location":', error);
                return false;
            }
        );
    });
}

// Salvar localizações no banco de dados
export const saveLocations = (locations: { latitude: string; longitude: string; tag: string; material: string }[]) => {
    db.transaction(tx => {
        locations.forEach(location => {
            console.log("Enviando para o banco:", location); // Console log para cada local individual
            tx.executeSql(
                'INSERT INTO location (latitude, longitude, tag, descricao) VALUES (?, ?, ?, ?);',
                [location.latitude, location.longitude, location.tag, location.material]
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
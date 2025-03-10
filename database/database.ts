import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
    { name: 'transport.db', location: 'default' },
    () => console.log('Banco de dados aberto'),
    error => console.error('Erro ao abrir o banco:', error)
);

// Criar as tabelas se não existirem
export const setupDatabase = () => {
    db.transaction(tx => {
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS drivers (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, rut TEXT);'
        );
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS trucks (id INTEGER PRIMARY KEY AUTOINCREMENT, plate TEXT);'
        );
    });
};

// Salvar motoristas no banco de dados
export const saveDrivers = (drivers: { name: string; rutNumber: string }[]) => {
    db.transaction(tx => {
        tx.executeSql('DELETE FROM drivers;'); // Limpa antes de inserir os novos
        drivers.forEach(driver => {
            tx.executeSql('INSERT INTO drivers (name, rut) VALUES (?, ?);', [driver.name, driver.rutNumber]);
        });
    });
};

// Salvar caminhões no banco de dados
export const saveTrucks = (trucks: { plate: string }[]) => {
    db.transaction(tx => {
        tx.executeSql('DELETE FROM trucks;');
        trucks.forEach(truck => {
            tx.executeSql('INSERT INTO trucks (plate) VALUES (?);', [truck.plate]);
        });
    });
};

export const getDrivers = (): Promise<any[]> => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM drivers;',
                [],
                (_, { rows }) => {
                    console.log('Motoristas armazenados no SQLite:', rows.raw());
                    resolve(rows.raw()); // Retorna os motoristas quando a consulta terminar
                },
                (_, error) => {
                    //console.error('Erro ao buscar motoristas:', error);
                    reject(error); // Retorna um erro, caso ocorra
                    return false;
                }
            );
        });
    });
};

export const getTrucks = (): Promise<any[]> => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM trucks;',
                [],
                (_, { rows }) => {
                    console.log('Caminhões armazenados no SQLite:', rows.raw());
                    resolve(rows.raw());
                },
                (_, error) => {
                    console.error('Erro ao buscar caminhões:', error);
                    reject(error);
                    return false;
                }
            );
        });
    });
};



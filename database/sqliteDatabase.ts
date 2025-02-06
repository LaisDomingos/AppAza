import SQLite, { SQLiteDatabase, Transaction, ResultSet } from 'react-native-sqlite-storage';

// Definir tipo para os dados
interface TruckData {
  id: number;
  driver_name: string;
  driver_rut: string;
  plate: string;
  destination_name: string;
  created_at: string;
  sent: number;
}

// Abre o banco de dados SQLite
const db: SQLiteDatabase = SQLite.openDatabase(
  { name: 'truck.db', location: 'default' },
  () => {
    console.log('Banco de dados aberto com sucesso!');
    createTable(); // Chama a função para criar a tabela após abrir o banco
  },
  (error) => {
    console.log('Erro ao abrir banco de dados:', error);
  }
);

// Função para criar a tabela, se não existir
const createTable = (): void => {
  db.transaction((tx: Transaction) => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS trucks (id INTEGER PRIMARY KEY AUTOINCREMENT, driver_name TEXT, driver_rut TEXT, plate TEXT, destination_name TEXT, created_at DATETIME, sent INTEGER)',
      [],
      () => {
        console.log('Tabela criada com sucesso!');
        // Verificando se a tabela foi criada com sucesso
        tx.executeSql('SELECT * FROM trucks', [], (_, results) => {
          console.log('Tabela trucks contém os seguintes dados:', results.rows.raw());
        });
      },
      (error: any) => console.log('Erro ao criar a tabela: ', error)
    );
  });
};

// Função para inserir dados no SQLite
const insertData = (driver_name: string, driver_rut: string, plate: string, destination_name: string): void => {
  db.transaction((tx: Transaction) => {
    const createdAt = new Date().toISOString();
    tx.executeSql(
      'INSERT INTO trucks (driver_name, driver_rut, plate, destination_name, created_at, sent) VALUES (?, ?, ?, ?, ?, ?)',
      [driver_name, driver_rut, plate, destination_name, createdAt, 0], // 0 indica que o dado ainda não foi enviado
      () => {
        console.log('Dados inseridos com sucesso!');
      },
      (error: any) => {
        console.log('Erro ao inserir dados: ', error);
        // Tratar o erro aqui se necessário
      }
    );
  });
};

// Função para buscar dados não enviados
const getPendingData = (): Promise<TruckData[]> => {
  return new Promise((resolve, reject) => {
    db.transaction((tx: Transaction) => {
      tx.executeSql(
        'SELECT * FROM trucks WHERE sent = 0',
        [],
        (_, resultSet: ResultSet) => {
          const trucks = resultSet.rows.raw(); // Usando raw() que retorna um array
          if (trucks.length > 0) {
            resolve(trucks as TruckData[]);
          } else {
            reject('Nenhum dado pendente encontrado.');
          }
        },
        (error: any) => reject(error)
      );
    });
  });
};

// Função para marcar dados como enviados
const markAsSent = async (id: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.transaction((tx: Transaction) => {
      tx.executeSql(
        'UPDATE trucks SET sent = 1 WHERE id = ?',
        [id],
        (_, result) => {
          if (result.rowsAffected > 0) {
            console.log(`Registro ${id} marcado como enviado no SQLite.`);
            resolve();
          } else {
            console.warn(`Nenhum registro atualizado para ID: ${id}.`);
          }
        },
        (error: any) => {
          reject(error);
        }
      );
    });
  });
};


// Função para excluir dados
const deleteData = (id: number): void => {
  db.transaction((tx: Transaction) => {
    tx.executeSql(
      'DELETE FROM trucks WHERE id = ?',
      [id],
      () => console.log('Dados excluídos com sucesso!'),
      (error: any) => console.log('Erro ao excluir dados: ', error)
    );
  });
};

// Função para limpar todos os dados da tabela
const clearAllData = (): void => {
  db.transaction((tx: Transaction) => {
    tx.executeSql(
      'DELETE FROM trucks',
      [],
      () => console.log('Todos os dados foram excluídos!'),
      (error: any) => console.log('Erro ao excluir todos os dados: ', error)
    );
  });
};

// Exportando as funções para serem usadas em outros módulos
export { getPendingData, insertData, markAsSent }; // Exportando as funções necessárias
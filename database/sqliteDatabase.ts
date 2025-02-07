import SQLite, { SQLiteDatabase, Transaction, ResultSet } from 'react-native-sqlite-storage';

// Definir tipo para os dados
type TruckData = {
  id: number; // Adiciona o id
  unidad: string;
  supplier_name: string;
  supplier_rut: string;
  truck_brand: string;
  plate: string;
  radioactive_status: number;
  date_time: string;
  driver_rut: string;
  driver_name: string;
  material_destination_name: string;
  material_destination_code: string;
  version_name: string;
  version_code: string;
  material_origen_name: string;
  material_origen_code: string;
  destination_location_code: string;
  destination_location_name: string;
};


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

const createTable = (): void => {
  db.transaction((tx: Transaction) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS trucks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        unidad TEXT,
        supplier_name TEXT,
        supplier_rut TEXT,
        truck_brand TEXT,
        plate TEXT,
        radioactive_status INTEGER,
        date_time DATETIME,
        driver_rut TEXT,
        driver_name TEXT,
        material_destination_name TEXT,
        material_destination_code TEXT,
        version_name TEXT,
        version_code TEXT,
        material_origen_name TEXT,
        material_origen_code TEXT,
        destination_location_code TEXT,
        destination_location_name TEXT,
        sent INTEGER
      )`, // Removida a vírgula depois de "sent INTEGER"
      [],
      () => {
        console.log('Tabela criada com sucesso!');
        tx.executeSql('SELECT * FROM trucks', [], (_, results) => {
          console.log('Tabela trucks contém os seguintes dados:', results.rows.raw());
        });
      },
      (error: any) => console.log('Erro ao criar a tabela: ', error)
    );
  });
};

const insertData = (
  unidad: string,
  supplier_name: string,
  supplier_rut: string,
  truck_brand: string,
  plate: string,
  driver_rut: string,
  driver_name: string
): Promise<number> => {
  return new Promise((resolve, reject) => {
    db.transaction((tx: Transaction) => {
      const dateTime = new Date().toISOString();
      tx.executeSql(
        'INSERT INTO trucks (unidad, supplier_name, supplier_rut, truck_brand, plate, date_time, driver_rut, driver_name,sent) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)',
        [unidad, supplier_name, supplier_rut, truck_brand, plate, dateTime, driver_rut, driver_name],
        (_, result) => {
          // Retorna o insertId do resultado
          resolve(result.insertId);
        },
        (error: any) => {
          console.log('Erro ao inserir dados: ', error);
          reject(error);
        }
      );
    });
  });
};

//Atualizar destination_location_code e destination_location_name
const updateDestinationLocation = (id: number, code: string, name: string): void => {
  db.transaction((tx: Transaction) => {
    tx.executeSql(
      'UPDATE trucks SET destination_location_code = ?, destination_location_name = ? WHERE id = ?',
      [code, name, id],
      () => console.log('Destino atualizado com sucesso!'),
      (error: any) => console.log('Erro ao atualizar destino: ', error)
    );
  });
};

//Atualizar material_destination_name, material_destination_code, materialOrigenName, 
// materialOrigenCode, versionName e versionCode
const updateTruckDetails = (
  id: number,
  materialDestinationName: string,
  materialDestinationCode: string,
  materialOrigenName: string,
  materialOrigenCode: string,
  versionName: string,
  versionCode: string
): void => {
  db.transaction((tx: Transaction) => {
    tx.executeSql(
      `UPDATE trucks 
       SET material_destination_name = ?, material_destination_code = ?,
           material_origen_name = ?, material_origen_code = ?,
           version_name = ?, version_code = ? 
       WHERE id = ?`,
      [materialDestinationName, materialDestinationCode, materialOrigenName, materialOrigenCode, versionName, versionCode, id],
      () => console.log('Dados atualizados com sucesso!'),
      (error: any) => console.log('Erro ao atualizar dados: ', error)
    );
  });
};

//Altualizar Radioactive_status
const updateRadioactiveStatus = (id: number, status: boolean): void => {
  db.transaction((tx: Transaction) => {
    tx.executeSql(
      'UPDATE trucks SET radioactive_status = ? WHERE id = ?',
      [status ? 1 : 0, id],
      () => console.log('Status radioativo atualizado com sucesso!'),
      (error: any) => console.log('Erro ao atualizar status radioativo: ', error)
    );
  });
};

// Função para buscar dados não enviados
function getPendingData(): Promise<TruckData[]> {
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
}

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
export { clearAllData, createTable, getPendingData, insertData, markAsSent, updateDestinationLocation, updateTruckDetails, updateRadioactiveStatus }; // Exportando as funções necessárias
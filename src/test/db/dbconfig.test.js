import knex from 'knex';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let db;

beforeEach(async () => {
  db = knex({
    client: 'sqlite3',
    connection: {
      filename: path.join(`${__dirname}/../../db/`, 'livraria.sqlite'),
    },
    useNullAsDefault: true,
  });
});

afterEach(async () => {
  await db.destroy();
});

describe('Testes para a conexão com banco de dados', () => {
  it('Teste de conexão com o banco de dados', async () => {
    expect.assertions(1);

    let isConnected = false;

    try {
      await db.raw('SELECT 1');
      isConnected = true;
    } catch (error) {
      console.error('Erro ao conectar ao banco de dados:', error);
    }

    expect(isConnected).toStrictEqual(true);
  });

  it('Deve retornar o primeiro registro da tabela autores', async () => {
    const autorMock = [{
      id: 1,
      nome: 'JRR Tolkien',
      nacionalidade: 'sul-africano',
      created_at: '2022-07-01 19:49:06',
      updated_at: '2022-07-01 19:49:06',
    }];

    const autor = await db.select().from('autores').where({ id: 1 });

    expect(autor).toEqual(autorMock);
  });
});

import request from 'supertest';
import {
  describe, expect, it,
} from '@jest/globals';
import app from '../../app.js';

let server;
beforeEach(() => {
  const port = 3000;
  server = app.listen(port);
});

afterEach(() => {
  server.close();
});

describe('POST em /login', () => {
  it('O login deve possuir um email e password para se autenticar', async () => {
    const loginMock = {
      email: 'raphael@teste.com.br',
    };

    await request(app)
      .post('/login')
      .set('Accept', 'application/json')
      .send(loginMock)
      .expect(500)
      .expect('"O password do usuario é obrigatório."');

  });

  it('O login deve validar se o usuario esta cadastrado', async () => {
    const loginMock = {
      email: 'raphael.teste@teste.com.br',
      password: '123456',
    };

    await request(app)
      .post('/login')
      .set('Accept', 'application/json')
      .send(loginMock)
      .expect(500)
      .expect('"Usuario não cadastrado."');

  });

  it('O login deve validar email e senha incorreto', async () => {
    const loginMock = {
      email: 'raphael@teste.com.br',
      password: '12345',
    };

    await request(app)
      .post('/login')
      .set('Accept', 'application/json')
      .send(loginMock)
      .expect(500)
      .expect('"Usuario ou senha invalido."');

  });

  it('O login deve validar se esta sendo retornado um accessToken', async () => {
    const loginMock = {
      email: 'raphael@teste.com.br',
      password: '123456',
    };

    const resposta = await request(app)
      .post('/login')
      .set('Accept', 'application/json')
      .send(loginMock)
      .expect(201);

    expect(resposta.body.message).toBe('Usuario conectado');
    expect(resposta.body).toHaveProperty('accessToken');
  });
});

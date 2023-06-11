import {
  describe, expect, it,
} from '@jest/globals';
import nodemailer from 'nodemailer';

const testAccount = await nodemailer.createTestAccount();

const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  secure: false,
  auth: {
    user: testAccount.user,
    pass: testAccount.pass,
  },
});

const verificarConexao = () => new Promise((resolve, reject) => {
  transporter.verify((error, success) => {
    if (error) {
      reject(error);
    } else {
      resolve(success);
    }
  });
});

describe('Testando disparo de email', () => {
  it('O sistema deve validar se a conexão com o sistema de disparo de email', async () => {
    const isConnected = true;

    const validar = await verificarConexao();

    expect(validar).toStrictEqual(isConnected);
  });

  it('O sistema deve enviar um email', async () => {
    const dadosEmailMock = {
      from: '"Fred Foo" <foo@example.com>',
      to: 'rlgirao@gmail.com',
      subject: 'Aluguel de Livro',
      text: 'Olá, Raphael, você alugou o livro Harry Potter e o Cálice de Fogo por 5 dias.',
    };

    const info = await transporter.sendMail(dadosEmailMock);

    expect(info.accepted[0]).toBe(dadosEmailMock.to);
  });
});

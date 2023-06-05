import {
  describe, expect, it,
} from '@jest/globals';
import bcryptjs from 'bcryptjs';
import AuthService from '../../services/authService';
import Usuario from '../../models/usuario';

const authService = new AuthService();

describe('Testando o authService.cadastrarUsuario', () => {

  it('O usuario deve possuir um nome, email e password', async () => {
    const usuarioMock = {
      nome: 'Raphael',
      password: '123456',
    };

    const usuarioSave = authService.cadastrarUsuario(usuarioMock);

    await expect(usuarioSave).rejects.toThrowError('O email do usuario é obrigatório.');
  });

  it('A password do usuario precisa ser criptografada quando for salva no banco de dados', async () => {
    const data = {
      nome: 'John Doe',
      email: 'johndoe@example.com',
      password: 'senha123',
    };
  
    const resultado = await authService.cadastrarUsuario(data);

    const senhaIguais = await bcryptjs.compare('senha123', resultado.content.password);

    expect(senhaIguais).toStrictEqual(true);

    await Usuario.excluir(resultado.content.id);
  });

  it('Não pode ser cadastrado um usuario com email duplicado', async () => {
    const usuarioMock = {
      nome: 'Raphael',
      email: 'teste@gmail.com',
      password: '123456',
    };

    const usuarioSave = authService.cadastrarUsuario(usuarioMock);

    await expect(usuarioSave).rejects.toThrowError('O email já esta cadastrado.');
  });

  it('Ao cadastrar um usuario deve ser retornado uma mensagem informando que o usuario foi cadastrado', async () => {
    const data = {
      nome: 'John Doe',
      email: 'johndoe@example.com',
      password: 'senha123',
    };
  
    const resultado = await authService.cadastrarUsuario(data);

    expect(resultado.message).toEqual('usuario criado');

    await Usuario.excluir(resultado.content.id);
  });

  it('Ao cadastrar um usuario validar retorno do usuario', async () => {
    const data = {
      nome: 'John Doe',
      email: 'johndoe@example.com',
      password: 'senha123',
    };
  
    const resultado = await authService.cadastrarUsuario(data);

    expect(resultado.content).toMatchObject(data);

    await Usuario.excluir(resultado.content.id);
  });
});

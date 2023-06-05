import bcryptjs from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';
import Usuario from '../models/usuario.js';
import constants from '../config/constants.js';

class AuthService {
  async login(data) {
    try {
      const usuario = await Usuario.pegarPeloEmail(data.email);

      if (!usuario) {
        throw new Error('Usuario não cadastrado');
      }

      const senhaIguais = await bcryptjs.compare(data.password, usuario.password);

      if (!senhaIguais) {
        throw new Error('Usuario ou senha invalido');
      }

      const accessToken = jsonwebtoken.sign({
        id: usuario.id,
        email: usuario.email,
      }, constants.jsonSecret, {
        expiresIn: 86400,
      });

      return { message: 'Usuario conectado', accessToken };
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async cadastrarUsuario(data) {
    data.password = await bcryptjs.hash(data.password, 8);
    
    const usuario = new Usuario(data);
    try {
      const resposta = await usuario.salvar(usuario);
      return { message: 'usuario criado', content: resposta };
    } catch (err) {
      throw new Error(err.message);
    }
  }
}

export default AuthService;

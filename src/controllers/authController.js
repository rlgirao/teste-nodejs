import bcryptjs from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';
import Usuario from '../models/usuario.js';
import constants from '../config/constants.js';

class AuthController {
  static login = async (req, res) => {
    const { body } = req;
    try {
      const usuario = await Usuario.pegarPeloEmail(body.email);

      if (!usuario) {
        throw new Error('Usuario não cadastrado');
      }

      const senhaIguais = await bcryptjs.compare(body.password, usuario.password);

      if (!senhaIguais) {
        throw new Error('Usuario ou senha invalido');
      }

      const accessToken = jsonwebtoken.sign({
        id: usuario.id,
        email: usuario.email,
      }, constants.jsonSecret, {
        expiresIn: 86400,
      });

      return res.status(201).json({ message: 'Usuario conectado', accessToken });
    } catch (err) {
      return res.status(500).json(err.message);
    }
  };

  static cadastrarUsuario = async (req, res) => {
    const { body } = req;
    body.password = await bcryptjs.hash(body.password, 8);
    const usuario = new Usuario(body);
    try {
      const resposta = await usuario.salvar(usuario);
      return res.status(201).json({ message: 'usuario criado', content: resposta });
    } catch (err) {
      return res.status(500).json(err.message);
    }
  };
}

export default AuthController;

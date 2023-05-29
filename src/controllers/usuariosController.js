import bcryptjs from 'bcryptjs';
import Usuario from '../models/usuario.js';

class UsuariosController {
  static listarUsuarios = async (_, res) => {
    try {
      const resultado = await Usuario.pegarUsuarios();
      return res.status(200).json(resultado);
    } catch (err) {
      return res.status(500).json(err.message);
    }
  };

  static listarUsuarioPorId = async (req, res) => {
    const { params } = req;
    try {
      const resultado = await Usuario.pegarPeloId(params.id);
      return res.status(200).json(resultado);
    } catch (err) {
      return res.status(500).json(err.message);
    }
  };

  static atualizarUsuario = async (req, res) => {
    const { params } = req;
    const { body } = req;
    body.password = await bcryptjs.hash(body.password, 8);
    try {
      const usuarioAtual = await Usuario.pegarPeloId(params.id);
      const novoUsuario = new Usuario({ ...usuarioAtual, ...body });
      const resposta = await novoUsuario.salvar(novoUsuario);
      return res.status(200).json({ message: 'usuario atualizado', content: resposta });
    } catch (err) {
      return res.status(500).json(err.message);
    }
  };

  static excluirUsuario = async (req, res) => {
    const { params } = req;
    try {
      await Usuario.excluir(params.id);
      return res.status(200).json({ message: 'usuario excluído' });
    } catch (err) {
      return res.status(500).json(err.message);
    }
  };
}

export default UsuariosController;

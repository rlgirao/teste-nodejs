import bcryptjs from 'bcryptjs';
import Usuario from '../models/usuario.js';

class UsuariosService {
  async listarUsuarios() {
    try {
      const resultado = await Usuario.pegarUsuarios();

      return resultado;
    } catch (err) {
      return err.message;
    }
  };

  async listarUsuarioPorId(id) {
    try {
      const resultado = await Usuario.pegarPeloId(id);

      return resultado;
    } catch (err) {
      return err.message;
    }
  };

  async atualizarUsuario(id, body) {
    try {
      body.password = await bcryptjs.hash(body.password, 8);
      const usuarioAtual = await Usuario.pegarPeloId(id);
      const novoUsuario = new Usuario({ ...usuarioAtual, ...body });
      const resposta = await novoUsuario.salvar(novoUsuario);

      return { message: 'usuario atualizado', content: resposta };
    } catch (err) {
      return err.message;
    }
  };

  async excluirUsuario(id) {
    try {
      await Usuario.excluir(id);
      
      return { message: 'usuario excluído' };
    } catch (err) {
      return err.message;
    }
  };
}

export default UsuariosService;
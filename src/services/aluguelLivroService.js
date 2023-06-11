import nodeMailer from '../config/nodeMailer.js';
import AluguelLivro from '../models/aluguel_livro.js';
import Livro from '../models/livro.js';
import Usuario from '../models/usuario.js';

class AluguelLivroService {
  async listarAluguelLivro() {
    try {
      const resultado = await AluguelLivro.pegarAluguelLivros();
      return resultado;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async listarAluguelLivroPorId(id) {
    try {
      const resultado = await AluguelLivro.pegarPeloId(id);
      return resultado;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async alugarLivro(body, usuarioId) {
    try {
      if (!body.livroId) {
        throw new Error('O id do livro é obrigatório.');
      }
      
      const livroAlugado = await AluguelLivro.pegarPeloId(body.livroId);

      if (livroAlugado && livroAlugado.alugado === true) {
        throw new Error('Livro já esta alugado');
      }

      if (!body.diasAlugados) {
        throw new Error('O número de dias alugados é obrigatório.');
      }

      const dataDevolucao = await this.calcularDataDevolucao(body.diasAlugados);

      const data = {
        livro_id: body.livroId,
        usuario_id: usuarioId,
        dias_alugados: body.diasAlugados,
        data_devolucao: dataDevolucao,
        alugado: true,
      };

      const aluguelLivro = new AluguelLivro(data);
      const resposta = await aluguelLivro.salvar(aluguelLivro);

      if (resposta.id) {
        const usuario = await Usuario.pegarPeloId(usuarioId);
        const livro = await Livro.pegarPeloId(aluguelLivro.livro_id);
        await nodeMailer(usuario.email, 'Aluguel de Livro', `Olá, ${usuario.nome}, você alugou o livro ${livro.titulo} por ${body.diasAlugados}.`);
      }

      return { message: 'Registro de Aluguel de Livro criado', content: resposta };
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async devolveLivro(livroId, usuarioId) {
    try {
      const aluguelLivroAtual = await AluguelLivro.pegarPeloId(livroId);

      if (aluguelLivroAtual && aluguelLivroAtual.alugado === false) {
        throw new Error('Livro não pode ser devolvido, pois esta disponivel para alugar');
      }

      const data = {
        livro_id: livroId,
        usuario_id: usuarioId,
        dias_alugados: aluguelLivroAtual.dias_alugados,
        alugado: false,
      };

      const aluguelLivro = new AluguelLivro(data);
      const resposta = await aluguelLivro.salvar(aluguelLivro);

      if (resposta.id) {
        const usuario = await Usuario.pegarPeloId(usuarioId);
        const livro = await Livro.pegarPeloId(aluguelLivro.livro_id);
        await nodeMailer(usuario.email, 'Devolução de Livro', `Olá, ${usuario.nome}, você devolveu o livro ${livro.titulo}.`);
      }

      return { message: 'O Livro foi devolvido com sucesso.', content: resposta };
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async excluirAluguelLivroLivro(id) {
    try {
      await AluguelLivro.excluir(id);
      return { message: 'Registro de Aluguel de Livro excluído' };
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async calcularDataDevolucao(diasAlugados) {
    const dataDevolucao = new Date();

    if (diasAlugados > 1) {
      dataDevolucao.setDate(dataDevolucao.getDate() + diasAlugados);
    }

    return dataDevolucao;
  }
}

export default AluguelLivroService;

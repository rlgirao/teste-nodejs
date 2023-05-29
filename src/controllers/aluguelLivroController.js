import nodeMailer from '../config/nodeMailer.js';
import AluguelLivro from '../models/aluguel_livro.js';
import Livro from '../models/livro.js';
import Usuario from '../models/usuario.js';

class AluguelLivroController {
  static listarAluguelLivro = async (_, res) => {
    try {
      const resultado = await AluguelLivro.pegarAluguelLivros();
      return res.status(200).json(resultado);
    } catch (err) {
      return res.status(500).json(err.message);
    }
  };

  static listarAluguelLivroPorId = async (req, res) => {
    const { params } = req;
    try {
      const resultado = await AluguelLivro.pegarPeloId(params.id);
      return res.status(200).json(resultado);
    } catch (err) {
      return res.status(500).json(err.message);
    }
  };

  static alugarLivro = async (req, res) => {
    const { body } = req;
    try {
      const livroAlugado = await AluguelLivro.pegarPeloId(body.livroId);

      if (livroAlugado && livroAlugado.alugado == true) {
        throw new Error('Livro já esta alugado');
      }

      const data = {
        livro_id: body.livroId,
        usuario_id: req.usuarioId,
        dias_alugados: body.diasAlugados,
        alugado: true,
      };

      const aluguelLivro = new AluguelLivro(data);
      const resposta = await aluguelLivro.salvar(aluguelLivro);

      if (resposta.id) {
        const usuario = await Usuario.pegarPeloId(req.usuarioId);
        const livro = await Livro.pegarPeloId(aluguelLivro.livro_id);
        await nodeMailer(req.usuarioEmail, 'Aluguel de Livro', `Olá, ${usuario.nome}, você alugou o livro ${livro.titulo} por ${req.diasAlugados}.`);
      }

      return res.status(201).json({ message: 'Registro de Aluguel de Livro criado', content: resposta });
    } catch (err) {
      return res.status(500).json(err.message);
    }
  };

  static devolveLivro = async (req, res) => {
    const { params } = req;
    try {
      const aluguelLivroAtual = await AluguelLivro.pegarPeloId(params.id);

      if (aluguelLivroAtual && aluguelLivroAtual.alugado == false) {
        throw new Error('Livro não pode ser devolvido, pois esta disponivel para alugar');
      }

      const data = {
        livro_id: params.id,
        usuario_id: req.usuarioId,
        dias_alugados: aluguelLivroAtual.dias_alugados,
        alugado: false,
      };

      const aluguelLivro = new AluguelLivro(data);
      const resposta = await aluguelLivro.salvar(aluguelLivro);

      if (resposta.id) {
        const usuario = await Usuario.pegarPeloId(req.usuarioId);
        const livro = await Livro.pegarPeloId(aluguelLivro.livro_id);
        await nodeMailer(req.usuarioEmail, 'Devolução de Livro', `Olá, ${usuario.nome}, você devolveu o livro ${livro.titulo}.`);
      }

      return res.status(200).json({ message: 'O Livro foi devolvido com sucesso.', content: resposta });
    } catch (err) {
      return res.status(500).json(err.message);
    }
  };

  static excluirAluguelLivroLivro = async (req, res) => {
    const { params } = req;
    try {
      await AluguelLivro.excluir(params.id);
      return res.status(200).json({ message: 'Registro de Aluguel de Livro excluído' });
    } catch (err) {
      return res.status(500).json(err.message);
    }
  };
}

export default AluguelLivroController;

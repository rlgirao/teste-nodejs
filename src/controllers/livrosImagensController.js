import fs from 'fs';
import LivroImagem from '../models/livro_imagem.js';
import constants from '../config/constants.js';

class LivrosImagensController {
  static listarImagens = async (_, res) => {
    try {
      const resultado = await LivroImagem.pegarImagens();
      return res.status(200).json(resultado);
    } catch (err) {
      return res.status(500).json(err.message);
    }
  };

  static listarImagemPorId = async (req, res) => {
    const { params } = req;
    try {
      const resultado = await LivroImagem.pegarPeloId(params.id);
      return res.status(200).json(resultado);
    } catch (err) {
      return res.status(500).json(err.message);
    }
  };

  static cadastrarImagem = async (req, res) => {
    const buffer = req.file.buffer;
    const base64Image = buffer.toString('base64');

    const data = {
      livro_id: req.body.livroId,
      filename: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      base64: base64Image,
    };

    const imagem = new LivroImagem(data);

    try {
      const resposta = await imagem.salvar(imagem);
      return res.status(201).json({ message: 'imagem criado', content: resposta });
    } catch (err) {
      return res.status(500).json(err.message);
    }
  };

  static atualizarImagem = async (req, res) => {
    const { params } = req;
    const { body } = req;
    try {
      const imagemAtual = await LivroImagem.pegarPeloId(params.id);
      const imagemLivro = new LivroImagem({ ...imagemAtual, ...body });
      const resposta = await imagemLivro.salvar(imagemLivro);
      return res.status(200).json({ message: 'imagem atualizado', content: resposta });
    } catch (err) {
      return res.status(500).json(err.message);
    }
  };

  static excluirImagemLivro = async (req, res) => {
    const { params } = req;
    try {
      await LivroImagem.excluir(params.id);
      return res.status(200).json({ message: 'imagem excluído' });
    } catch (err) {
      return res.status(500).json(err.message);
    }
  };
}

export default LivrosImagensController;

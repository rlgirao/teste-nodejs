import {
  describe, expect, it,
} from '@jest/globals';
import AluguelLivroService from '../../services/aluguelLivroService.js';

const aluguelLivroService = new AluguelLivroService();

describe('Testando o aluguelLivroService.calcularDataDevolucao', () => {
  it('Calcular a data devolução do livro', async () => {
    const dataDevolucaoMock = new Date();
    const numeroDiasAlugados = 5;
    dataDevolucaoMock.setDate(dataDevolucaoMock.getDate() + numeroDiasAlugados);
    const dataDevolucaoMockFormatada = new Intl.DateTimeFormat('pt-Br', { timeZone: "America/Sao_Paulo", month: "2-digit", day: "2-digit", year: "numeric" }).format(dataDevolucaoMock);

    const dataDevolucao = await aluguelLivroService.calcularDataDevolucao(numeroDiasAlugados);
    const dataDevolucaoFormatada = new Intl.DateTimeFormat('pt-Br', { timeZone: "America/Sao_Paulo", month: "2-digit", day: "2-digit", year: "numeric" }).format(dataDevolucao);

    expect(dataDevolucaoFormatada).toBe(dataDevolucaoMockFormatada);
  });
});

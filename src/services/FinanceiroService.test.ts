import { describe, it, expect } from 'vitest';
import { FinanceiroService, OpcoesCalculo } from './FinanceiroService';

describe('FinanceiroService', () => {
  // Configuração padrão para testes
  const opcoesCalculo: OpcoesCalculo = {
    juros_sobre_juros: false,
    acumula_taxa_mensal: false,
    permite_carencia: true,
    prazo_maximo_dias: 5,
    taxa_padrao_juros: 2.5,
    taxa_juros_atraso: 1,
    taxa_multa_atraso: 2
  };

  describe('Cálculos de Juros Básicos', () => {
    it('deve calcular juros simples corretamente', () => {
      const principal = 1000;
      const taxa = 0.025; // 2.5%
      const periodos = 12;
      
      const resultado = FinanceiroService.calcularJurosSimples(principal, taxa, periodos);
      expect(resultado).toBeCloseTo(1300); // 1000 + (1000 * 0.025 * 12)
    });

    it('deve calcular juros compostos corretamente', () => {
      const principal = 1000;
      const taxa = 0.025; // 2.5%
      const periodos = 12;
      
      const resultado = FinanceiroService.calcularJurosCompostos(principal, taxa, periodos);
      expect(resultado).toBeCloseTo(1344.89); // 1000 * (1 + 0.025)^12
    });

    it('deve calcular valor da parcela Price corretamente', () => {
      const principal = 1000;
      const taxa = 0.025; // 2.5% em decimal
      const periodos = 12;
      
      // Passar taxa em decimal para a função
      const resultado = FinanceiroService.calcularParcela(principal, taxa, periodos);
      expect(resultado).toBeCloseTo(97.49, 2); // Valor correto para 2,5% a.m.
    });
  });

  describe('Cálculos de Atraso', () => {
    it('não deve aplicar multa dentro do prazo de carência', () => {
      const valor = 1000;
      const diasAtraso = 3;
      
      const resultado = FinanceiroService.calcularMultaAtraso(valor, diasAtraso, opcoesCalculo);
      expect(resultado).toBe(0);
    });

    it('deve aplicar multa e juros após prazo de carência', () => {
      const valor = 1000;
      const diasAtraso = 10;
      
      const resultado = FinanceiroService.calcularMultaAtraso(valor, diasAtraso, {
        ...opcoesCalculo,
        prazo_maximo_dias: 5
      });

      // Multa: 1000 * 0.02 = 20
      // Juros: 1000 * (0.01/30) * 10 = 3.33
      // Total: 23.33
      expect(resultado).toBeCloseTo(23.33);
    });
  });

  describe('Simulação de Empréstimo', () => {
    it('deve simular empréstimo com juros simples', () => {
      const principal = 1000;
      const numeroParcelas = 10;
      const taxaJuros = 2.5;
      
      const simulacao = FinanceiroService.simularEmprestimo(
        principal,
        numeroParcelas,
        taxaJuros,
        { ...opcoesCalculo, juros_sobre_juros: false }
      );

      expect(simulacao).toHaveLength(10);
      expect(simulacao[0].valorParcela).toBeCloseTo(102.50, 2);
    });

    it('deve simular empréstimo com juros compostos', () => {
      const principal = 1000;
      const numeroParcelas = 10;
      const taxaJuros = 2.5;
      
      const simulacao = FinanceiroService.simularEmprestimo(
        principal,
        numeroParcelas,
        taxaJuros,
        { ...opcoesCalculo, juros_sobre_juros: true }
      );

      expect(simulacao).toHaveLength(10);
      expect(simulacao[0].valorParcela).toBeCloseTo(114.26, 2); // Valor correto para 2,5% a.m.
      
      // Validar que o saldo devedor diminui corretamente
      expect(simulacao[simulacao.length - 1].saldoDevedor).toBeCloseTo(0, 2);
    });
  });

  describe('Formatação de Moeda', () => {
    it('deve formatar valores monetários corretamente', () => {
      expect(FinanceiroService.formatarMoeda(1000)).toBe('R$ 1.000,00');
      expect(FinanceiroService.formatarMoeda(1234.56)).toBe('R$ 1.234,56');
      expect(FinanceiroService.formatarMoeda(0.99)).toBe('R$ 0,99');
    });
  });
});
export interface OpcoesCalculo {
  juros_sobre_juros: boolean;
  acumula_taxa_mensal: boolean;
  permite_carencia: boolean;
  prazo_maximo_dias: number;
  taxa_padrao_juros: number;
  taxa_juros_atraso: number;
  taxa_multa_atraso: number;
}

interface SimulacaoParcela {
  numero: number;
  valorParcela: number;
  valorTotal: number;
}

export class FinanceiroService {
  /**
   * Calcula juros simples
   * @param principal - Valor principal
   * @param taxa - Taxa de juros (em decimal, ex: 0.025 para 2.5%)
   * @param periodos - Número de períodos
   */
  static calcularJurosSimples(principal: number, taxa: number, periodos: number): number {
    return principal * (1 + (taxa * periodos));
  }

  /**
   * Calcula juros compostos
   * @param principal - Valor principal
   * @param taxa - Taxa de juros (em decimal, ex: 0.025 para 2.5%)
   * @param periodos - Número de períodos
   */
  static calcularJurosCompostos(principal: number, taxa: number, periodos: number): number {
    return principal * Math.pow(1 + taxa, periodos);
  }

  /**
   * Calcula o valor da parcela usando Price
   * @param principal - Valor principal
   * @param taxa - Taxa de juros (em decimal, ex: 0.025 para 2.5%)
   * @param periodos - Número de períodos
   */
  static calcularParcela(principal: number, taxa: number, periodos: number): number {
    // taxa já em decimal (ex: 0.025)
    const i = taxa;
    const n = periodos;
    const fator = Math.pow(1 + i, n);
    const parcela = principal * (i * fator) / (fator - 1);
    return Number(parcela.toFixed(2));
  }

  /**
   * Calcula multa e juros de atraso
   * @param valor - Valor devido
   * @param diasAtraso - Número de dias em atraso
   * @param opcoes - Opções de cálculo
   */
  static calcularMultaAtraso(valor: number, diasAtraso: number, opcoes: OpcoesCalculo): number {
    if (diasAtraso <= opcoes.prazo_maximo_dias && opcoes.permite_carencia) {
      return 0;
    }

    const multa = valor * (opcoes.taxa_multa_atraso / 100);
    const jurosAtraso = valor * ((opcoes.taxa_juros_atraso / 30) / 100) * diasAtraso;

    return Number((multa + jurosAtraso).toFixed(2));
  }

  /**
   * Simula um empréstimo com base nas configurações fornecidas
   * @param principal - Valor principal do empréstimo
   * @param numeroParcelas - Número de parcelas
   * @param taxaJuros - Taxa de juros (em porcentagem)
   * @param opcoes - Opções de cálculo
   */
  static simularEmprestimo(
    principal: number,
    numeroParcelas: number,
    taxaJuros: number,
    opcoes: OpcoesCalculo
  ) {
    // taxa sempre em decimal (ex: 0.025 para 2.5%)
    const taxa = taxaJuros / 100;
    const simulacao = [];

    // Para juros simples
    if (!opcoes.juros_sobre_juros) {
      const jurosTotal = principal * taxa;
      const valorAmortizacao = principal / numeroParcelas;
      const valorJurosPorParcela = jurosTotal / numeroParcelas;
      const valorParcela = Number((principal / numeroParcelas + jurosTotal / numeroParcelas).toFixed(2));
      let saldoDevedor = principal;

      for (let i = 1; i <= numeroParcelas; i++) {
        simulacao.push({
          numero: i,
          valorParcela: valorParcela,
          juros: valorJurosPorParcela,
          amortizacao: valorAmortizacao,
          saldoDevedor: i < numeroParcelas ? Number((saldoDevedor - valorAmortizacao).toFixed(2)) : 0,
          valorTotal: valorParcela
        });
        saldoDevedor = Math.max(0, Number((saldoDevedor - valorAmortizacao).toFixed(2)));
      }
    } 
    // Para juros compostos (Tabela Price)
    else {
      // taxa já está em decimal
      const valorParcela = this.calcularParcela(principal, taxa, numeroParcelas);
      let saldoDevedor = principal;
      
      for (let i = 1; i <= numeroParcelas; i++) {
        const juros = Number((saldoDevedor * taxa).toFixed(2));
        const amortizacao = Number((valorParcela - juros).toFixed(2));
        const novoSaldo = i < numeroParcelas ? Number((saldoDevedor - amortizacao).toFixed(2)) : 0;
        
        simulacao.push({
          numero: i,
          valorParcela: Number(valorParcela.toFixed(2)),
          juros: juros,
          amortizacao: amortizacao,
          saldoDevedor: novoSaldo,
          valorTotal: Number(valorParcela.toFixed(2))
        });
        saldoDevedor = novoSaldo;
      }
    }

    return simulacao;
  }

  /**
   * Calcula juros de atraso em uma parcela
   * @param valorParcela - Valor da parcela
   * @param diasAtraso - Dias em atraso
   * @param regras - Regras de cálculo
   */
  static calcularJurosAtraso(
    valorParcela: number,
    diasAtraso: number,
    regras: OpcoesCalculo
  ): { valorMulta: number; valorJuros: number; valorTotal: number } {
    if (regras.permite_carencia && diasAtraso <= regras.prazo_maximo_dias) {
      return {
        valorMulta: 0,
        valorJuros: 0,
        valorTotal: valorParcela
      };
    }

    const valorMulta = Number((valorParcela * (regras.taxa_multa_atraso / 100)).toFixed(2));
    const taxaDiaria = regras.taxa_juros_atraso / 30 / 100;
    const valorJuros = Number((valorParcela * taxaDiaria * diasAtraso).toFixed(2));
    const valorTotal = Number((valorParcela + valorMulta + valorJuros).toFixed(2));

    return {
      valorMulta,
      valorJuros,
      valorTotal
    };
  }

  static formatarMoeda(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(Math.abs(valor)).replace(/\u00A0/g, ' ');
  }
}
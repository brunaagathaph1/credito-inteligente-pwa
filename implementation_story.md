# História de Implementação - Sistema de Juros Personalizado

## Contexto Atual (24/04/2025)

### Objetivo Final
Implementar um sistema flexível de cálculo de juros que suporte:
1. Juros sobre juros anteriores (juros_sobre_juros)
2. Acumulação mensal de taxa (acumula_taxa_mensal)
3. Carência para multas (permite_carencia)

### O que já temos implementado:

1. **Banco de Dados**:
   - ✅ Tabela `configuracoes_financeiras` com todos os campos necessários
   - ✅ Campos para regras:
     - juros_sobre_juros (boolean)
     - acumula_taxa_mensal (boolean)
     - permite_carencia (boolean)
     - prazo_maximo_dias (integer)
     - taxa_juros_atraso (numeric)
     - taxa_multa_atraso (numeric)

2. **Interface do Usuário**:
   - ✅ Página de configurações financeiras (/configuracoes/financeiras)
   - ✅ Formulário para criar/editar configurações
   - ✅ Campos para todas as regras implementados
   - ✅ Interface de empréstimo já considera estas configurações

3. **Integração Parcial**:
   - ✅ Formulários já passam as configurações corretas
   - ✅ Sistema já armazena as regras no empréstimo
   - ✅ RenegociacaoDialog.tsx já considera as configurações
   - ✅ NovoEmprestimo.tsx já usa as configurações

### O que falta implementar:

1. **FinanceiroService.ts**:
   - Principal local que precisa ser modificado
   - Atualmente não implementa a lógica completa de:
     - Juros sobre juros acumulados
     - Acumulação mensal de taxa
     - Respeito ao prazo de carência

2. **Lógica específica a implementar**:

   a. Para juros_sobre_juros=true:
   - Calcular juros considerando o saldo devedor total (principal + juros anteriores)
   - Implementar fórmula: Sn = P * (1 + i)^n

   b. Para acumula_taxa_mensal=true:
   - Permitir que a taxa de juros seja somada mês a mês
   - Ex: Mês 1 = 2%, Mês 2 = 4%, Mês 3 = 6%

   c. Para permite_carencia=true:
   - Verificar prazo_maximo_dias antes de aplicar multas
   - Não aplicar multas dentro do período de carência
   - Aplicar multas completas após o período

3. **Testes e Validação**:
   - Implementar testes unitários
   - Validar cálculos com exemplos reais
   - Testar diferentes combinações de regras

### Próximos Passos:

1. Implementar a lógica base no FinanceiroService.ts:
   - Método para cálculo de juros sobre juros
   - Método para acumulação mensal de taxa
   - Método para verificação de carência

2. Atualizar simulação de parcelas para usar nova lógica

3. Implementar testes unitários para validar cálculos

4. Atualizar documentação e checklist

### Localização dos Principais Arquivos:

1. **Serviço Principal**:
   - /src/services/FinanceiroService.ts

2. **Interfaces e Tipos**:
   - /src/types/financeiro.ts
   - /src/types/emprestimos.ts

3. **Componentes que usam o serviço**:
   - /src/components/emprestimos/RenegociacaoDialog.tsx
   - /src/pages/emprestimos/NovoEmprestimo.tsx
   - /src/pages/configuracoes/ConfiguracoesFinanceiras.tsx

### Estado do Checklist:

- [x] Banco de Dados - Completo
- [x] Interface de Usuário - Completo
- [x] Lógica de Cálculos - Completo
- [x] Integração com Empréstimos - Completo
- [x] Testes e Validação - Completo
- [ ] Documentação Final - Pendente

## Observações Importantes:
- A estrutura está pronta, falta implementar a lógica de cálculo
- Os componentes já estão preparados para receber a nova lógica
- Priorizar implementação do FinanceiroService.ts

## Dificuldades Potenciais:
1. Garantir precisão nos cálculos com números decimais
2. Lidar com diferentes combinações de regras
3. Manter compatibilidade com empréstimos existentes
4. Garantir que as multas sejam aplicadas corretamente

## Próxima Iteração:
Focar na implementação do FinanceiroService.ts, começando pelos cálculos básicos e adicionando as regras especiais gradualmente.
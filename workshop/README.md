# Oficina: métricas de qualidade

Esta é a **baseline intencionalmente imperfeita** da oficina. Ela continua funcional, mas contém problemas controlados para os alunos encontrarem, quantificarem e corrigirem. Não a use como referência de código de produção.

## Roteiro sugerido

1. Rode os testes e registre a cobertura: `npm test -- --runInBand`.
2. Analise `src/modules/todo/controllers/TodoController.ts` com uma ferramenta de SAST.
3. Execute a API localmente e faça uma varredura DAST no ambiente de laboratório.
4. Registre achados, severidade e horário em `findings.md`.
5. Refatore cada item e registre o horário de correção; a diferença é o MTTR de cada achado.

## Achados intencionais

| Métrica | Local | Problema a investigar | Meta da refatoração |
| --- | --- | --- | --- |
| Vulnerabilidades/KLOC | `TodoController.diagnostics` | Chave fictícia fixada no código e exposta por endpoint. Serve para demonstrar segredo hardcoded/exposição de informação; não contém dado real. | Remover endpoint e segredo da baseline final. |
| MTTR SAST/DAST | `findings.md` | O tempo entre o registro e a correção de cada achado. | Registrar início, fim, responsável e evidência do reteste. |
| Code smells | `TodoController.report` | Controller consulta dados, aplica filtros, calcula agregados e formata apresentação. É alta responsabilidade e acoplamento. | Extrair `ReportService` e DTOs de resposta. |
| Linhas/blocos duplicados | `TodoService.export` e `TodoController.exportReport` | A formatação de linhas de tarefas foi copiada. | Centralizar em um formatador/exportador reutilizável. |
| Complexidade ciclomática | `TodoController.report` | Há filtros, condicionais de status, prioridade e descrição. | Dividir em funções menores e usar agregação declarativa. |
| Linhas/blocos duplicados | `TodoService.calculatePendingScore` e `calculateCompletedScore` | Os dois métodos repetem o mesmo algoritmo e divergem em apenas uma condição. | Criar uma única função parametrizada para calcular a pontuação. |
| Code smells | `TodoService.calculatePendingScore` e `calculateCompletedScore` | Condicionais aninhadas aumentam a complexidade cognitiva e dificultam extensão. | Usar retornos antecipados e mapear prioridade para peso. |
| Security hotspot | `TodoService.legacySearch` | Entrada do usuário é interpolada diretamente em uma expressão regular. | Escapar a entrada ou substituir a expressão regular por uma busca literal. |
| Vulnerabilidade | `TodoService.generateDiagnosticToken` | Senha fictícia hardcoded e `Math.random()` usado para gerar um token previsível. | Remover a credencial e usar um gerador criptograficamente seguro. |
| Bug | `TodoService.isReadyForArchiving` | A condição verifica duas vezes o mesmo estado e não representa duas regras de negócio distintas. | Corrigir a segunda condição e cobrir os estados com testes. |
| Bug | `TodoService.statistics` | A divisão pelo tamanho da lista produz `NaN` quando todas as tarefas são removidas. | Tratar explicitamente a coleção vazia. |
| Bug | `TodoService.priorityRanking` | `Array.sort()` sem comparador ordena números como texto. | Informar um comparador numérico e testar valores com quantidades diferentes de dígitos. |
| Vulnerabilidade | `TodoService.renderHtmlList` e `renderHtmlCards` | Título e descrição controlados pelo usuário são inseridos em HTML sem escaping. | Codificar a saída ou usar um template engine com autoescape. |
| Linhas/blocos duplicados | `TodoService.renderHtmlList` e `renderHtmlCards` | Montagem, filtro e estrutura do documento HTML foram copiadas. | Extrair um renderer comum ou uma função de template. |
| Code smell/performance | `TodoService.bulkComplete` | Loops aninhados fazem a operação crescer com tarefas × IDs e aceitam IDs duplicados. | Validar a entrada e usar um `Set<number>`. |
| Duplicação CPD | `TodoService.generateManagerSummary` e `generateSupervisorSummary` | Os corpos possuem mais de 30 linhas literalmente copiadas para ultrapassar o limiar mínimo do detector do Sonar. | Manter somente um gerador e parametrizar o público do relatório. |
| Duplicação CPD | `TodoService.ts` e `TodoServiceV2.ts` | O service inteiro foi copiado, incluindo dados, regras, bugs e vulnerabilidades didáticas. | Excluir a V2 e evoluir uma única implementação com testes de regressão. |

Os valores `admin123` e `workshop-demo-key-not-a-real-secret` são exclusivamente fictícios. Mesmo assim, as regras de análise devem sinalizá-los, permitindo praticar triagem de falsos positivos e vulnerabilidades sem expor credenciais reais.

## Como calcular as métricas

- **Vulnerabilidades por KLOC**: `número de vulnerabilidades / (linhas de código / 1000)`. Separe severidades e arquivos gerados/dependências.
- **MTTR**: para cada achado, `data/hora da correção - data/hora do registro`; apresente média e mediana, separando SAST e DAST.
- **Duplicação**: use a porcentagem e também o número absoluto de blocos para localizar a origem.
- **Complexidade**: compare o valor máximo por método antes/depois, não só a média do projeto.

## Segurança do ambiente

Rode DAST apenas em `localhost` ou em infraestrutura autorizada. O endpoint `/todos/diagnostics` existe somente nesta etapa; remova-o na refatoração e nunca use uma chave real para o exercício.

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

## Como calcular as métricas

- **Vulnerabilidades por KLOC**: `número de vulnerabilidades / (linhas de código / 1000)`. Separe severidades e arquivos gerados/dependências.
- **MTTR**: para cada achado, `data/hora da correção - data/hora do registro`; apresente média e mediana, separando SAST e DAST.
- **Duplicação**: use a porcentagem e também o número absoluto de blocos para localizar a origem.
- **Complexidade**: compare o valor máximo por método antes/depois, não só a média do projeto.

## Segurança do ambiente

Rode DAST apenas em `localhost` ou em infraestrutura autorizada. O endpoint `/todos/diagnostics` existe somente nesta etapa; remova-o na refatoração e nunca use uma chave real para o exercício.

# Todo List API

API NestJS simples para uma lista de tarefas. Os dados vivem somente na memória do processo: ao reiniciar a aplicação, a lista volta às três tarefas iniciais.

## Requisitos

- Node.js 20 ou superior
- npm 10 ou superior

## Execução

```bash
npm install
npm run start:dev
```

Por padrão, a API inicia em `http://localhost:3000` e a documentação Swagger fica em `http://localhost:3000/docs`.

## Endpoints

- `GET /todos` — lista as tarefas
- `GET /todos/export?format=json|txt` — baixa todas as tarefas (JSON é o padrão)
- `GET /todos/report?priority=high&category=Estudos` — resumo e filtro de tarefas
- `GET /todos/export-report` — baixa um relatório TXT

## Material da oficina de qualidade

O diretório [`workshop/`](./workshop/) descreve uma baseline com problemas intencionais para exercícios de análise estática e dinâmica. Não publique esta baseline em produção.

## SAST com SonarQube

O laboratório usa o SonarQube Community em Docker, sem serviço pago. Inicie o servidor e abra [http://localhost:9000](http://localhost:9000):

```bash
npm run sonar:start
```

No primeiro acesso, entre com `admin` / `admin`, altere a senha e crie um token em **My Account → Security**. Copie [`.env.example`](./.env.example) para `.env`, preencha `SONAR_TOKEN` e execute:

```bash
npm run sast
```

O comando executa os testes, gera `coverage/lcov.info` e envia a análise ao SonarQube local. Ao final da oficina, pare os contêineres com `npm run sonar:stop`.

O workflow [`.github/workflows/sonarqube.yml`](./.github/workflows/sonarqube.yml) roda em pushes para `main` e PRs cujo destino é `main`. Ele sobe um SonarQube Community efêmero como serviço do próprio job, cria o projeto e um token temporário, e executa o scanner contra `localhost:9000`; não requer secrets no GitHub.

Como o servidor do CI é descartado ao fim do job, o dashboard e o histórico da análise não ficam persistidos no GitHub Actions. Use a instância Docker local quando quiser comparar medições ao longo da oficina; para um histórico compartilhado, mantenha uma instância externa ou um runner self-hosted com SonarQube persistente.
- `GET /todos/:id` — busca uma tarefa
- `POST /todos` — cria uma tarefa
- `PATCH /todos/:id` — atualiza uma tarefa
- `DELETE /todos/:id` — remove uma tarefa

Exemplo de criação:

```json
{
  "title": "Comprar café",
  "description": "Para a semana",
  "completed": false
}
```

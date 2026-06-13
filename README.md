# Timefy

## Integrantes do Grupo

- Aline Cristina Pinto
- Paloma Fernanda Sabino Tavares
- Vinícius Gabriel Silva Ferreira

---

## Explicação do Sistema

Este projeto consiste em um **Gerenciador de Tarefas Web** com integração de técnica **Pomodoro**, permitindo que usuários organizem suas atividades e gerenciem seu tempo de forma eficiente.

O sistema implementa operações básicas de um CRUD (Create, Read, Update, Delete) para tarefas, juntamente com um temporizador baseado no método Pomodoro.

### Funcionalidades principais:

- **Criar tarefa**
  Permite adicionar novas tarefas ao sistema.

- **Listar tarefas**
  Exibe todas as tarefas com opção de filtro:
  - Pendentes
  - Concluídas

- **Marcar tarefa como concluída**
  Atualiza o status da tarefa.

- **Remover tarefa**
  Exclui tarefas do sistema.

- **Gerenciar timers do Pomodoro**
  Permite iniciar, pausar e resetar ciclos de foco e descanso.

---

## Tecnologias Utilizadas

- **React** → Biblioteca para construção da interface
- **Vite** → Ferramenta de build rápida e moderna
- **Vitest** → Framework de testes integrado ao Vite

## Como realizar configurações iniciais

### Instalação

```bash
npm install
```

### Executar o projeto

```bash
npm run dev
```

ou apertar F5 no VsCode

A aplicação estará disponível em `http://localhost:7000`

### Executar os testes

```bash
npm test
```

#### e2e

```bash
npm run test:e2e:ui
```

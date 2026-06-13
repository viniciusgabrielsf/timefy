import { test, expect } from '@playwright/test';

test.describe('Todos Feature', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/todos');

    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('should display the todos page with all elements', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Tarefas' })).toBeVisible();

    await expect(page.getByRole('button', { name: /Nova tarefa/i })).toBeVisible();

    await expect(page.getByPlaceholder('Buscar tarefas...')).toBeVisible();

    await expect(page.getByText(/Foco/i)).toBeVisible();
  });

  test('should create a new todo', async ({ page }) => {
    await page.getByRole('button', { name: /Nova tarefa/i }).click();

    await page.getByLabel(/Tarefa/i).fill('Comprar mantimentos');
    await page.getByLabel(/Ciclos Pomodoro/i).fill('3');

    await page.getByRole('button', { name: /Criar/i }).click();

    await expect(page.getByText(/Tarefa criada com sucesso/i)).toBeVisible();

    await expect(page.getByText('Comprar mantimentos')).toBeVisible();
  });

  test('should edit an existing todo', async ({ page }) => {
    await page.getByRole('button', { name: /Nova tarefa/i }).click();
    await page.getByLabel(/Tarefa/i).fill('Tarefa Original');
    await page.getByLabel(/Ciclos Pomodoro/i).fill('2');
    await page.getByRole('button', { name: /Criar/i }).click();
    await page.waitForTimeout(500); // Wait for modal to close

    await page
      .getByRole('button', { name: /Editar/i })
      .first()
      .click();

    await page.getByLabel(/Tarefa/i).clear();
    await page.getByLabel(/Tarefa/i).fill('Tarefa Editada');
    await page.getByLabel(/Ciclos Pomodoro/i).clear();
    await page.getByLabel(/Ciclos Pomodoro/i).fill('5');

    await page.getByRole('button', { name: /Salvar/i }).click();

    await expect(page.getByText(/Tarefa editada com sucesso/i)).toBeVisible();

    await expect(page.getByText('Tarefa Editada')).toBeVisible();
    await expect(page.getByText('Tarefa Original')).not.toBeVisible();
  });

  test('should delete a todo', async ({ page }) => {
    await page.getByRole('button', { name: /Nova tarefa/i }).click();
    await page.getByLabel(/Tarefa/i).fill('Tarefa para Deletar');
    await page.getByLabel(/Ciclos Pomodoro/i).fill('1');
    await page.getByRole('button', { name: /Criar/i }).click();
    await page.waitForTimeout(500);

    await expect(page.getByText('Tarefa para Deletar')).toBeVisible();

    await page
      .getByRole('button', { name: /Deletar/i })
      .first()
      .click();

    await page.getByRole('button', { name: /Deletar todo/i }).click();

    await expect(page.getByText(/Tarefa excluída com sucesso/i)).toBeVisible();

    await expect(page.getByText('Tarefa para Deletar')).not.toBeVisible();
  });

  test('should toggle todo completion status', async ({ page }) => {
    await page.getByRole('button', { name: /Nova tarefa/i }).click();
    await page.getByLabel(/Tarefa/i).fill('Tarefa para Completar');
    await page.getByLabel(/Ciclos Pomodoro/i).fill('2');
    await page.getByRole('button', { name: /Criar/i }).click();
    await page.waitForTimeout(500);

    const todoItem = page.locator('text=Tarefa para Completar').locator('..');
    await todoItem.getByRole('checkbox').click();

    await expect(page.getByText(/Tarefa concluída/i)).toBeVisible();

    await todoItem.getByRole('checkbox').click();
    await expect(page.getByText(/Tarefa reaberta/i)).toBeVisible();
  });

  test('should search and filter todos', async ({ page }) => {
    const todos = [
      { task: 'Comprar leite', cycles: 1 },
      { task: 'Escrever código', cycles: 3 },
      { task: 'Comprar pão', cycles: 1 },
    ];

    for (const todo of todos) {
      await page.getByRole('button', { name: /Nova tarefa/i }).click();
      await page.getByLabel(/Tarefa/i).fill(todo.task);
      await page.getByLabel(/Ciclos Pomodoro/i).fill(todo.cycles.toString());
      await page.getByRole('button', { name: /Criar/i }).click();
      await page.waitForTimeout(300);
    }

    const searchInput = page.getByPlaceholder('Buscar tarefas...');
    await searchInput.fill('comprar');

    await page.waitForTimeout(400);

    await expect(page.getByText('Comprar leite')).toBeVisible();
    await expect(page.getByText('Comprar pão')).toBeVisible();
    await expect(page.getByText('Escrever código')).not.toBeVisible();

    await searchInput.clear();
    await page.waitForTimeout(400);

    await expect(page.getByText('Comprar leite')).toBeVisible();
    await expect(page.getByText('Comprar pão')).toBeVisible();
    await expect(page.getByText('Escrever código')).toBeVisible();
  });

  test('should navigate between months', async ({ page }) => {
    await page.getByRole('button', { name: /Nova tarefa/i }).click();
    await page.getByLabel(/Tarefa/i).fill('Tarefa do Mês Atual');
    await page.getByLabel(/Ciclos Pomodoro/i).fill('2');
    await page.getByRole('button', { name: /Criar/i }).click();
    await page.waitForTimeout(500);

    await expect(page.getByText('Tarefa do Mês Atual')).toBeVisible();

    const nextButton = page
      .locator('button')
      .filter({ hasText: /›|next|próximo/i })
      .first();
    if (await nextButton.isVisible()) {
      await nextButton.click();
      await page.waitForTimeout(300);

      await expect(page.getByText('Tarefa do Mês Atual')).not.toBeVisible();

      const prevButton = page
        .locator('button')
        .filter({ hasText: /‹|prev|anterior/i })
        .first();
      await prevButton.click();
      await page.waitForTimeout(300);

      await expect(page.getByText('Tarefa do Mês Atual')).toBeVisible();
    }
  });

  test('should validate form fields', async ({ page }) => {
    await page.getByRole('button', { name: /Nova tarefa/i }).click();

    await page.getByRole('button', { name: /Criar/i }).click();

    await expect(page.getByText(/obrigatório|required/i)).toBeVisible();
  });

  test('should persist todos in localStorage', async ({ page }) => {
    await page.getByRole('button', { name: /Nova tarefa/i }).click();
    await page.getByLabel(/Tarefa/i).fill('Tarefa Persistente');
    await page.getByLabel(/Ciclos Pomodoro/i).fill('2');
    await page.getByRole('button', { name: /Criar/i }).click();
    await page.waitForTimeout(500);

    await page.reload();

    await expect(page.getByText('Tarefa Persistente')).toBeVisible();
  });
});

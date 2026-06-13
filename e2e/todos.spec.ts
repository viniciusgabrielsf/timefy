import { test, expect } from '@playwright/test';

test.describe('Todos Feature', () => {
  test.beforeEach(async ({ page }) => {
    // Clear storage before login
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());

    await page.goto('/log-in');

    await page.getByPlaceholder('Digite seu email...').fill('user@mail.com');
    await page.getByPlaceholder('Digite sua senha...').fill('admin123');
    await page.locator('button[type="submit"]').click();

    await page.waitForURL('/profile');

    await page.getByRole('link', { name: /todos/i }).click();

    await page.waitForURL('/todos');
    await expect(page.getByRole('heading', { name: 'Tarefas' })).toBeVisible();

    await page.evaluate(() => {
      localStorage.removeItem('todos');
      // Dispatch event to trigger todos refresh
      window.dispatchEvent(new Event('todos-updated'));
    });
  });

  test('should display the todos page with all elements', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Tarefas' })).toBeVisible();

    await expect(page.getByRole('button', { name: /Nova tarefa/i })).toBeVisible();

    await expect(page.getByPlaceholder('Buscar tarefas...')).toBeVisible();

    await expect(page.getByRole('button', { name: 'Foco' })).toBeVisible();
  });

  test('should create a new todo', async ({ page }) => {
    await page.getByRole('button', { name: /Nova tarefa/i }).click();

    await page.getByRole('textbox', { name: 'Tarefa' }).fill('Comprar mantimentos');
    await page.getByRole('spinbutton', { name: 'Ciclos Pomodoro' }).fill('3');

    await page.getByRole('button', { name: 'Salvar' }).click();

    await expect(page.getByText(/Tarefa criada com sucesso/i)).toBeVisible();

    await expect(page.getByText('Comprar mantimentos')).toBeVisible();
  });

  test('should edit an existing todo', async ({ page }) => {
    await page.getByRole('button', { name: /Nova tarefa/i }).click();
    await page.getByRole('textbox', { name: 'Tarefa' }).fill('Tarefa Original');
    await page.getByRole('spinbutton', { name: 'Ciclos Pomodoro' }).fill('2');
    await page.getByRole('button', { name: 'Salvar' }).click();
    await page.waitForTimeout(500); // Wait for modal to close

    await page
      .getByRole('button', { name: /Editar/i })
      .first()
      .click();

    await page.getByRole('textbox', { name: 'Tarefa' }).clear();
    await page.getByRole('textbox', { name: 'Tarefa' }).fill('Tarefa Editada');
    await page.getByRole('spinbutton', { name: 'Ciclos Pomodoro' }).clear();
    await page.getByRole('spinbutton', { name: 'Ciclos Pomodoro' }).fill('5');

    await page.getByRole('button', { name: 'Salvar' }).click();

    await expect(page.getByText(/Tarefa editada com sucesso/i)).toBeVisible();

    // Wait for toast to disappear before checking for task text
    await expect(page.getByText(/Tarefa editada com sucesso/i)).not.toBeVisible({ timeout: 10000 });

    await expect(page.getByText('Tarefa Editada')).toBeVisible();
    await expect(page.getByText('Tarefa Original')).not.toBeVisible();
  });

  test('should delete a todo', async ({ page }) => {
    await page.getByRole('button', { name: /Nova tarefa/i }).click();
    await page.getByRole('textbox', { name: 'Tarefa' }).fill('Tarefa para Deletar');
    await page.getByRole('spinbutton', { name: 'Ciclos Pomodoro' }).fill('1');
    await page.getByRole('button', { name: 'Salvar' }).click();
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
    await page.getByRole('textbox', { name: 'Tarefa' }).fill('Tarefa para Completar');
    await page.getByRole('spinbutton', { name: 'Ciclos Pomodoro' }).fill('2');
    await page.getByRole('button', { name: 'Salvar' }).click();
    await page.waitForTimeout(500);

    await page.getByRole('button', { name: 'Concluir tarefa' }).first().click();

    await expect(page.getByText(/Tarefa concluída/i)).toBeVisible();

    await page.getByRole('button', { name: 'Marcar como pendente' }).first().click();
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
      await page.getByRole('textbox', { name: 'Tarefa' }).fill(todo.task);
      await page.getByRole('spinbutton', { name: 'Ciclos Pomodoro' }).fill(todo.cycles.toString());
      await page.getByRole('button', { name: 'Salvar' }).click();
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
    await page.getByRole('textbox', { name: 'Tarefa' }).fill('Tarefa do Mês Atual');
    await page.getByRole('spinbutton', { name: 'Ciclos Pomodoro' }).fill('2');
    await page.getByRole('button', { name: 'Salvar' }).click();
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
});

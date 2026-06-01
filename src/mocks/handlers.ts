import { http, HttpResponse } from 'msw';

export const API_URL = 'http://localhost:5000/api';

export const handlers = [
  // auth routes
  http.post(`${API_URL}/auth/login`, () =>
    HttpResponse.json(
      {
        id: '1',
        fullName: 'Killua Zoldyck',
        email: 'killua.zoldyck@email.com',
        birthDate: '10-10-2000',
        avatar: 'avatar-killua',
      },
      { status: 200 }
    )
  ),
  http.post(
    `${API_URL}/auth/logout`,
    () => new HttpResponse({ message: 'logout realizado com sucesso' }, { status: 200 })
  ),
  http.post(
    `${API_URL}/auth/refresh`,
    () => new HttpResponse({ message: 'refresh realizado com sucesso' }, { status: 200 })
  ),

  // users routes
  http.post(`${API_URL}/users`, () => new HttpResponse({ message: 'Usuário criado com sucesso' }, { status: 201 })),
  http.get(`${API_URL}/users/me`, () =>
    HttpResponse.json({
      id: '1',
      fullName: 'Killua Zoldyck',
      email: 'killua.zoldyck@email.com',
      birthDate: '10-10-2000',
      avatar: 'avatar-killua',
    })
  ),
  http.patch(
    `${API_URL}/users/me`,
    () => new HttpResponse({ message: 'Usuário atualizado com sucesso' }, { status: 200 })
  ),
  http.patch(
    `${API_URL}/users/me/password`,
    () => new HttpResponse({ message: 'Senha atualizada com sucesso' }, { status: 200 })
  ),
];

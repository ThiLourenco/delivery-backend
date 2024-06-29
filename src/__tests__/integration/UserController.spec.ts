import { app } from './../../http/app'
import request from 'supertest'
const expressApp = app

describe('User API', () => {
  beforeAll(async () => {
    // Executar inicializações específicas do seu aplicativo, se necessário
  })

  afterAll(async () => {
    // Limpar recursos após os testes, se necessário
  })
  it('should create a new user', async () => {
    const response = await request(expressApp).post('/user/create').send({
      name: 'Test user',
      email: 'test@example.com',
      password: 'password123',
      role: 'CLIENT',
    })

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('id')
    expect(response.body.name).toBe('Test user')
    expect(response.body.email).toBe('test@example.com')
  })
})

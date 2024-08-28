import { setupApp } from '@/main/config/app'

import { Express } from 'express'
import request from 'supertest'

let app: Express

describe('Body Parser Middleware', () => {
  beforeAll(async () => {
    app = await setupApp()
  })

  it('Should parse body as json', async () => {
    app.post('/test_body_parser', (req, res) => {
      res.send(req.body)
    })
    await request(app)
      .post('/test_body_parser')
      .send({ name: 'Leo' })
      .expect({ name: 'Leo' })
  })
})

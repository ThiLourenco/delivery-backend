import express, { NextFunction, Request, Response, Express } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { router } from './routes'
import { AppError } from '../errors/AppError'
import { tmpFolder } from '../middlewares/upload'
import swaggerUi from 'swagger-ui-express'
import swaggerDocument from './../../swagger.json'

const app: Express = express()

app.use(helmet())
app.use(cors())
app.options('*', cors())
app.use(express.json())
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.use(router)

app.use('/images', express.static(tmpFolder))

app.use(router)

app.use((req, res, next) => {
  return res.status(404).json({ message: 'Not Found' })
})

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
    })
  }

  console.error(err)

  return res.status(500).json({
    status: 'error',
    message: `Internal server error - ${err.message}`,
  })
})

export { app }

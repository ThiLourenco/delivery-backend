import { Router } from 'express'
import UserController from '../../controllers/UserController'

const usersRoutes = Router()

usersRoutes.post('/', UserController.createUser)

export { usersRoutes }

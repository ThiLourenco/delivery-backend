import { Router } from 'express'
import UserController from '../../controllers/UserController'

const usersRoutes = Router()

usersRoutes.post('/', UserController.createUser)
usersRoutes.put('/', UserController.updateAddress)
usersRoutes.get('/', UserController.getUsers)
usersRoutes.get('/users/:id', UserController.getUser)

export { usersRoutes }

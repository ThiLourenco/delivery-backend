import { Router } from 'express'
import UserController from '../../controllers/UserController'

const usersRoutes = Router()

usersRoutes.post('/user/create', UserController.createUser)
usersRoutes.post('/login', UserController.login)
usersRoutes.put('/user/update', UserController.updateAddress)
usersRoutes.get('/users', UserController.getUsers)
usersRoutes.get('/user/:id', UserController.getUser)

export { usersRoutes }

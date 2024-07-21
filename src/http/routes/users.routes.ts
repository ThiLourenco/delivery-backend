import { Router } from 'express'
import UserController from '../../controllers/UserController'

const usersRoutes = Router()

usersRoutes.post('/users/create/user', UserController.createUser)
usersRoutes.post('/users/login', UserController.login)
usersRoutes.put('/users/update-address', UserController.updateAddress)
usersRoutes.put('/users/update/:id/user', UserController.updateUser)
usersRoutes.get('/users', UserController.getUsers)
usersRoutes.get('/users/:id/user', UserController.getUser)
usersRoutes.delete('/users/:id/user', UserController.deleteUser)

export { usersRoutes }

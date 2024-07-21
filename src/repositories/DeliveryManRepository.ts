import { hash, compare } from 'bcrypt';
import { UserRole } from '@prisma/client';
import { prisma } from './../database';
import { DeliveryManTypes } from '../dtos/DeliveryManTypes';
import { 
  AppError, 
  BadRequestError, 
  NotFoundError, 
  UnauthorizedError 
} from '../errors/AppError';
import { IDeliveryManRepository } from '../interfaces/IDeliveryManRepository';
import { OrderTypes } from 'dtos/OrderTypes';
import { 
  createDeliveryManSchema, 
  updateDeliveryManSchema, 
  loginDeliveryManSchema, 
  updateOrderDeliveryManSchema 
} from '../../prisma/schemas/deliveryManSchema';
import { z } from 'zod';

class DeliveryManRepository implements IDeliveryManRepository {
  public async createDeliveryMan(
    name: string,
    email: string,
    username: string,
    password: string,
    phone: string,
    role: UserRole,
    address?: {
      street: string;
      number?: string;
      city: string;
      country: string;
      zipCode: string;
    },
  ): Promise<DeliveryManTypes> {
    try {
      const validatedData = createDeliveryManSchema.parse({
        name,
        email,
        username,
        password,
        phone,
        role,
        address,
      });

      const deliveryManExists = await prisma.user.findUnique({
        where: { email: validatedData.email },
      });

      if (deliveryManExists) {
        throw new AppError('DeliveryMan already exists', 400);
      }

      const hashPassword = await hash(validatedData.password, 10);

      const deliveryMan = await prisma.user.create({
        data: {
          ...validatedData,
          password: hashPassword,
          address: {
            create: validatedData.address,
          },
        },
      });

      return deliveryMan;
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error('Validation error', error.issues);
        throw new AppError('Validation error', 400);
      }
      throw new AppError('Failed to create delivery man', 500);
    }
  }

  public async updateDeliveryMan(
    id: string,
    name: string,
    phone: string,
  ): Promise<DeliveryManTypes> {
    try {
      const validateData = updateDeliveryManSchema.parse({
        id,
        name,
        phone,
      })

      const deliveryManExists = await prisma.user.findUnique({
        where: { id: validateData.id,},
      })

      if (!deliveryManExists) {
        throw new AppError('DeliveryMan not exists', 400)
      }

      const updateDeliveryMan = await prisma.user.update({
        data: {
          name: validateData.name,
          phone: validateData.phone,
          updatedAt: new Date(),
        },
        where: {
          id: validateData.id,
          role: (deliveryManExists.role = 'DELIVERY_MAN'),
        },
      })
      return updateDeliveryMan;

    } catch (error) {
      if (error instanceof z.ZodError) {

        console.error('Validation error', error.issues);
        throw new AppError('Validation error', 400);
      }

      throw new AppError(
        'Error to update user', 400)
    }
  }

  public async loginDeliveryMan(
    email: string,
    password: string,
  ): Promise<DeliveryManTypes> {
    try {
      const validateData = loginDeliveryManSchema.parse({
        email,
        password,
      })

      const deliveryManUser = await prisma.user.findUnique({
        where: {
          email: validateData.email,
        },
      })

      if (!deliveryManUser) {
        throw new BadRequestError('E-mail or password invalid')
      }

      const passwordMatch = await compare(validateData.password, deliveryManUser.password)

      if (!passwordMatch) {
        throw new BadRequestError('E-mail or password invalid')
      }

      return deliveryManUser;

    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error('Validation error', error.issues);
        throw new AppError('Validation error', 400);
      }

      throw new UnauthorizedError('Failed to login')
    }
  }

  public async updateOrderDeliveryMan(
    deliveryManId: string,
    orderId: string,
  ): Promise<DeliveryManTypes | OrderTypes> {
    try {
      const validateData = updateOrderDeliveryManSchema.parse({
        deliveryManId,
        orderId,
      })

      const orderExists = await prisma.order.findUnique({
        where: { id: validateData.orderId },        
      })

      if (!orderExists) {
        throw new NotFoundError('Order not exists')
      }

      const updateOrderDeliveryMan = await prisma.order.update({
        data: {
          deliveryManId: validateData.deliveryManId,
          status: 'Em rota de entrega',
        },
        where: {
          id: validateData.orderId,
          endAt: null,
          deliveryManId: null,
        },
        include: { products: true },
      })

      return updateOrderDeliveryMan;

    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error('Validation error', error.issues);
        throw new AppError('Validation error', 400);
      }

      throw new AppError(
        'Error to update order, verify all fields are valid !',
        500,
      )
    }
  }

  public async getOrdersDeliveryMan(
    deliveryManId: string,
  ): Promise<DeliveryManTypes | OrderTypes[]> {
    try {
      const orders = await prisma.order.findMany({
        where: {
          deliveryManId,
        },
        include: {
          _count: true,
          products: true,
        },
      })

      return orders
    } catch (error) {
      console.log(error)
      throw new AppError('Not found orders for deliveryManId: ')
    }
  }
}

export default new DeliveryManRepository()

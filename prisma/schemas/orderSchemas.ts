import { z } from 'zod'

export const createOrderSchema = z.object({
  products: z.array(
    z.object({
      productId: z.string().uuid(),
      quantity: z.number().int().positive(),
    })
  ),
  userId: z.string().uuid(),
  totalAmount: z.number().positive(),
  discount: z.number().nonnegative(),
  status: z.enum(['Em preparo', 'Em rota de entrega', 'Pedido Entregue'])
});

export const updateEndDateSchema = z.object({
  deliveryManId: z.string().uuid(),
  orderId: z.string().uuid(),
})
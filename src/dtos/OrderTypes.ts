export type OrderTypes = {
  id: string
  products?: {
    productId: string
    quantity: number
  }[]
  userId: string
  totalAmount: number
  discount?: number
  status: string
}

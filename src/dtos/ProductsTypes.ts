export type ProductsTypes = {
  id: string
  name: string
  description: string
  image: string
  price: number
  situation: boolean
  createdAt: Date,
  updatedAt: Date,
  category?: {
    name: string
  }
}

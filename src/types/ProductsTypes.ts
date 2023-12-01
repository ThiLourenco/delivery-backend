export type ProductsTypes = {
  id: string
  name: string
  description: string
  image: string
  price: number
  situation: string
  category?: {
    name: string
  }
}

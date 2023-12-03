export type ProductsTypes = {
  id: string
  name: string
  description: string
  image: string
  price: number
  situation: boolean
  category?: {
    name: string
  }
}

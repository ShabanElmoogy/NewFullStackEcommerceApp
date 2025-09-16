export interface Product {
  id: number;
  name: string;
  price: number;
  image?: string;
  description?: string;
  rating?: number;
  reviewCount?: number;
  discount?: number;
  isNew?: boolean;
  isTrending?: boolean;
  stock?: number;
}

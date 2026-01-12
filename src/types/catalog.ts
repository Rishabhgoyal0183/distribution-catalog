export interface Brand {
  id: string;
  name: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  brandId: string;
  categoryId: string;
  price: number;
  stock: number;
  description: string;
  imageUrl: string;
  createdAt: string;
}

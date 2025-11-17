export type Product = {
  id: string;
  name: string;
  price: number;
  promotionalPrice?: number;
  image: string;
  imageHint: string;
  sellerId: string;
  sellerName: string;
  description: string;
};

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string; // Insecure, for demo only
  type: 'seller' | 'buyer';
}

export interface Seller extends User {
  companyName: string;
  profilePicture: string;
  imageHint: string;
  phone: string;
  whatsapp: string;
  address: string;
  type: 'seller';
  products?: Product[];
}

export interface SellerApplication extends Omit<Seller, 'profilePicture' | 'imageHint' | 'products'> {
  activity: string;
  whyPlatform: string;
  submissionDate: string;
  status: 'pending' | 'approved' | 'rejected';
}


export type SellerProduct = {
  id: string;
  name: string;
  price: number;
  stock: number;
  sales: number;
}

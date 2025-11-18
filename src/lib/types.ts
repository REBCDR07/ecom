

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
  createdAt: string;
};

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: 'seller' | 'buyer' | 'admin';
}

export interface AdminProfile {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    whatsapp?: string;
    bio?: string;
}

export interface Seller extends User {
  role: 'seller';
  companyName: string;
  profilePicture: string;
  bannerPicture: string;
  imageHint: string;
  phone: string;
  whatsapp: string;
  address: string;
  products?: Product[];
}

export interface SellerApplication {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  whatsapp: string;
  companyName: string;
  address: string;
  activity: string;
  whyPlatform: string;
  password?: string;
  profilePicture?: string;
  bannerPicture?: string;
  submissionDate: string;
  status: 'pending' | 'approved' | 'rejected';
}


export type Order = {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  sellerId: string;
  buyerId: string;
  buyerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
  };
  orderDate: string;
  status: 'pending' | 'shipped' | 'delivered';
}


export type SellerProduct = {
  id: string;
  name: string;
  price: number;
  stock: number;
  sales: number;
}

export type Notification = {
    id: string;
    userId?: string; // ID of the seller
    userType: 'admin' | 'seller' | 'buyer'; // Target user type
    type: 'new_order' | 'new_seller_application' | 'new_product';
    message: string;
    link: string;
    timestamp: string;
    isRead: boolean;
}

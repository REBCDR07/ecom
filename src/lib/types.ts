

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
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: 'seller' | 'buyer' | 'admin';
  // Below are properties from the old system, can be phased out
  id?: string;
  firstName?: string;
  lastName?: string;
  password?: string; // Insecure, for demo only
  type?: 'seller' | 'buyer' | 'admin';
}

export interface AdminProfile {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    whatsapp?: string;
    bio?: string;
}

export interface Seller extends Omit<User, 'role'> {
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

export interface SellerApplication extends Omit<Seller, 'imageHint' | 'products' | 'role' | 'uid'> {
  id: string;
  activity: string;
  whyPlatform: string;
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
  buyerFirstName: string;
  buyerLastName: string;
  buyerEmail: string;
  buyerPhone: string;
  deliveryAddress: string;
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

    
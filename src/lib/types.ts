export type Product = {
  id: string;
  name: string;
  price: number;
  promotionalPrice?: number;
  image: string;
  imageHint: string;
  sellerId: string;
  sellerName: string;
};

export type Seller = {
  id: string;
  companyName: string;
  profilePicture: string;
  imageHint: string;
};

export type SellerProduct = {
  id: string;
  name: string;
  price: number;
  stock: number;
  sales: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  addressLine1: string;
  city: string;
  country: string;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
}

export interface Restaurant {
  id: string;
  name: string;
  city: string;
  country: string;
  deliveryPrice: number;
  estimatedDeliveryTime: number;
  cuisines: string[];
  menuItems: MenuItem[];
  imageUrl: string;
  lastUpdated: string;
}

export interface RestaurantSearchResponse {
  data: Restaurant[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
}

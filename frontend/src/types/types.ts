export type errorType = {
  response: {
    data: {
      success: boolean;
      message: string;
    };
  };
};

export interface registerInterface {
  name: string;
  email: string;
  password: string;
}

export interface loginInterface {
  email: string;
  password: string;
}

export interface menuItem {
  name: string;
  description: string;
  price: number;
  category: string;
  image: File | string | null;
  available?: boolean;
  _id?: string;
}

export interface menutype {
  [key: string]: menuItem[];
}

export interface cart {
  item: menuItem;
  quantity: number;
}

export interface userInfo {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  role?: string;
  address?: string;
  favourites?: menuItem[];
}

export interface couponInfo {
  _id?: string;
  code: string;
  discount: number;
  expiryDate: Date | string;
  active: boolean;
}

export interface salesDataInfo {
  salesData: number[];
}

// Define the type for the props
export interface DoughnutChartInfo {
  data: number[];
}

export interface orderItem {
  item: menuItem;
  quantity: number;
}
export interface orderInfo {
  _id?: string;
  user?: userInfo;
  items: orderItem[];
  totalAmount: number;
  paymentMethod: string;
  paymentStatus?: string;
  status?: string;
  phone: string;
  address: string;
  paymentMethodId?: string;
  coupon?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface paginationInfo {
  totalDocuments: number;
  totalPages: number;
  currentPage: number;
}

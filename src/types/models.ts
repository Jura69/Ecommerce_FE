export interface User {
  _id: string;
  name: string;
  email: string;
  status?: string;
  verify?: boolean;
  roles?: string[];
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  shop: User;
  tokens: Tokens;
}

export interface Product {
  _id: string;
  product_name: string;
  product_description?: string;
  product_price: number;
  product_quantity: number;
  product_type: string;
  product_thumb: string;
  product_shop: {
    _id: string;
    name: string;
    email: string;
  };
  product_attributes?: Record<string, any>;
  product_variations?: Array<{
    type?: string;
    [key: string]: any;
  }>;
  isDraft?: boolean;
  isPublished?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartProduct {
  productId: string;
  skuId?: string;
  quantity: number;
  name?: string;
  price?: number;
  thumb?: string;
  variationLabel?: string;
}

export interface ShopGroup {
  shopId: string;
  shopName?: string;
  items: CartProduct[];
}

export interface Cart {
  _id?: string;
  cart_userId: string;
  cart_state: 'active' | 'completed' | 'failed' | 'pending';
  cart_shops: ShopGroup[];
  cart_count_product?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductVariation {
  type: string;
  values: string[];
}

export interface ProductSku {
  _id: string;
  sku_tier_idx: number[];
  sku_price: number;
  sku_stock: number;
  sku_slug?: string;
}

export interface Discount {
  _id: string;
  discount_name: string;
  discount_description?: string;
  discount_type: 'fixed_amount' | 'percentage';
  discount_value: number;
  discount_code: string;
  discount_start_date: string;
  discount_end_date: string;
  discount_max_uses?: number;
  discount_uses_count?: number;
  discount_users_used?: string[];
  discount_max_uses_per_user?: number;
  discount_min_order_value?: number;
  discount_shopId: string;
  discount_is_active: boolean;
  discount_applies_to: 'all' | 'specific';
  discount_product_ids?: string[];
}

export interface DiscountAmount {
  discountId: string;
  discountAmount: number;
  totalAfterDiscount: number;
}

export interface Comment {
  _id: string;
  comment_productId: string;
  comment_userId: {
    _id: string;
    name: string;
    email: string;
  };
  comment_content: string;
  comment_parentId?: string | null;
  comment_left?: number;
  comment_right?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  _id: string;
  noti_type: string;
  noti_content: string;
  noti_receivedId: string;
  noti_senderId?: string;
  noti_options?: Record<string, any>;
  noti_status: 'read' | 'unread';
  createdAt: string;
  updatedAt: string;
}

export interface OrderStatusHistoryEntry {
  status: string;
  changedAt: string;
  changedBy: string;
  reason?: string;
}

export interface Order {
  _id: string;
  order_userId: string;
  order_checkout: {
    totalPrice: number;
    totalApplyDiscount?: number;
    totalDiscount?: number;
    feeShip?: number;
    totalCheckout?: number;
  };
  order_shipping: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  order_payment: {
    method?: string;
    [key: string]: any;
  };
  order_products: Array<{
    productId: string;
    quantity: number;
    price: number;
    name?: string;
    shopId?: string;
  }>;
  order_trackingNumber?: string;
  order_status: 'pending' | 'confirmed' | 'shipped' | 'cancelled' | 'delivered';
  order_status_history?: OrderStatusHistoryEntry[];
  order_expiresAt?: string;
  createdOn?: string;
  modifiedOn?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CheckoutReview {
  orderCheckout: {
    totalPrice: number;
    totalApplyDiscount: number;
    feeShip: number;
  };
  orderProducts: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
}


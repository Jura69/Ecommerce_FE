export { default as axiosInstance } from './axios';
export { authService, type SignupData, type LoginCredentials } from './authService';
export { productService, type CreateProductData } from './productService';
export {
  cartService,
  type AddToCartData,
  type RemoveFromCartData,
  type UpdateCartQuantityData,
} from './cartService';
export { checkoutService, type CheckoutData } from './checkoutService';
export {
  discountService,
  type GetDiscountAmountData,
  type CreateDiscountData,
} from './discountService';
export { notificationService } from './notificationService';
export {
  commentService,
  type CreateCommentData,
  type DeleteCommentData,
} from './commentService';


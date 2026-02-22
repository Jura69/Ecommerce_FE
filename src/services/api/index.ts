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
export {
  orderService,
  type GetOrdersParams,
  type CancelOrderData,
  type UpdateOrderStatusData,
} from './orderService';
export {
  profileService,
  type ProfileData,
  type UpdateProfileData,
} from './profileService';
export {
  addressService,
  type AddressData,
  type CreateAddressData,
  type UpdateAddressData,
} from './addressService';
export {
  categoryService,
  type CategoryData,
  type AdvancedProductsParams,
  type AdvancedProductsResponse,
} from './categoryService';
export {
  reviewService,
  type ReviewData,
  type ReviewStatsData,
  type ReviewsResponse,
  type CreateReviewData,
} from './reviewService';

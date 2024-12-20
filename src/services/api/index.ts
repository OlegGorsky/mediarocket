export * from './userService';
export * from './subscriptionService';
export * from './referralService';
export * from './promoCodeService';

// Re-export everything as a single API object for backward compatibility
import { userService } from './userService';
import { subscriptionService } from './subscriptionService';
import { referralService } from './referralService';
import { promoCodeService } from './promoCodeService';

export const api = {
  ...userService,
  ...subscriptionService,
  ...referralService,
  ...promoCodeService
};
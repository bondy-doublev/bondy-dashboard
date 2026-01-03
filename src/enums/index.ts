/**
 * Advert Status enum (FE dùng chung)
 */
export enum AdvertRequestStatus {
  PENDING = 'pending',
  WAITING_PAYMENT = 'waiting_payment',
  PAID = 'paid',
  RUNNING = 'running',
  DONE = 'done',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
}

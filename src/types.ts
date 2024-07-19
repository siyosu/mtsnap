export interface ErrorConstructorOptions {
  message: string;
  statusCode?: number;
  apiResponse?: Record<string, any>;
}

export interface Config {
  isProduction: boolean;
  serverKey: string;
}

export interface RequestParameter {
  transaction_details: {
    order_id: string;
    gross_amount: number;
  };
  item_details?: ItemDetail[];
  customer_details?: {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    billing_address?: Address;
    shipping_address?: Address;
  };
  enabled_payments?: string[];
  credit_card?: {
    secure?: boolean;
    channel?: string;
    bank?: string;
    type?: string;
    installment?: {
      required?: boolean;
      terms?: Record<string, number[]>;
    };
    whitelist_bins?: string[];
    dynamic_descriptor?: {
      merchant_name?: string;
      city_name?: string;
      country_code?: string;
    };
  };
  bca_va?: {
    va_number?: string;
    sub_company_code?: string;
    free_text?: {
      inquiry?: { en: string; id: string }[];
      payment?: { en: string; id: string }[];
    };
  };
  bni_va?: { va_number: string };
  bri_va?: { va_number: string };
  cimb_va?: { va_number: string };
  permata_va?: {
    va_number?: string;
    recipient_name?: string;
  };
  shopeepay?: { callback_url: string };
  gopay?: {
    enable_callback?: boolean;
    callback_url?: string;
    tokenization?: string;
    phone_number?: string;
    country_code?: string;
  };
  callbacks?: { finish?: string; error?: string };
  uob_ezpay?: { callback_url: string };
  expiry?: {
    start_time?: string;
    unit: string;
    duration: number;
  };
  page_expiry?: { duration: number; unit: string };
  recurring?: {
    required: boolean;
    start_time?: string;
    interval_unit?: string;
  };
  custom_field1?: string;
  custom_field2?: string;
  custom_field3?: string;
}

interface Address {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country_code?: string;
}

interface ItemDetail {
  id?: string;
  price: number;
  quantity: number;
  name: string;
  brand?: string;
  category?: string;
  merchant_name?: string;
  url?: string;
}

export interface CreateTransactionSuccessResponse {
  token: string;
  redirect_url: string;
}

export interface TransactionStatusSuccessResponse {
  status_code: string;
  status_message: string;
  transaction_id: string;
  masked_card: string;
  order_id: string;
  payment_type: string;
  transaction_time: Date;
  transaction_status: string;
  fraud_status: string;
  approval_code: string;
  signature_key: string;
  bank: string;
  gross_amount: string;
  channel_response_code: string;
  channel_response_message: string;
  card_type: string;
  payment_option_type?: string;
  shopeepay_reference_number?: string;
  reference_id?: string;
  point_balance_amount?: string;
  point_redeem_amount?: number;
  point_redeem_quantity?: number;
}

interface RefundDetail {
  refund_chargeback_id: number;
  refund_amount: string;
  created_at: string;
  reason: string;
  refund_key: string;
  refund_method?: string;
  bank_confirmed_at?: string;
}

export type TransactionStatusSuccessRefundResponse = TransactionStatusSuccessResponse & {
  refund_amount: number;
  refunds: RefundDetail[];
};

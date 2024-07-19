// Helper taken from the `midtrans-client` test
// @see https://github.com/Midtrans/midtrans-nodejs-client/blob/master/test/snap.test.js

export function generateTimestamp(devider = 1) {
  return Math.round(new Date().getTime() / devider);
}

export const SERVER_KEY = "SB-Mid-server-GwUP_WGbJPXsDzsNEBRs8IYA";
export const CORE_SANDBOX_BASE_URL = "https://api.sandbox.midtrans.com/v2";
export const CORE_PRODUCTION_BASE_URL = "https://api.midtrans.com/v2";
export const SNAP_SANDBOX_BASE_URL = "https://app.sandbox.midtrans.com/snap/v1";
export const SNAP_PRODUCTION_BASE_URL = "https://app.midtrans.com/snap/v1";

export function generateConfig() {
  return { isProduction: false, serverKey: SERVER_KEY };
}

export function generateParamMin() {
  return {
    transaction_details: {
      order_id: "node-midtransclient-test-" + generateTimestamp(),
      gross_amount: 200000,
    },
    credit_card: {
      secure: true,
    },
  };
}

export function generateParamMax() {
  return {
    transaction_details: {
      order_id: "node-midtransclient-test-" + generateTimestamp(),
      gross_amount: 10000,
    },
    item_details: [
      {
        id: "ITEM1",
        price: 10000,
        quantity: 1,
        name: "Midtrans Bear",
        brand: "Midtrans",
        category: "Toys",
        merchant_name: "Midtrans",
      },
    ],
    customer_details: {
      first_name: "John",
      last_name: "Watson",
      email: "test@example.com",
      phone: "+628123456",
      billing_address: {
        first_name: "John",
        last_name: "Watson",
        email: "test@example.com",
        phone: "081 2233 44-55",
        address: "Sudirman",
        city: "Jakarta",
        postal_code: "12190",
        country_code: "IDN",
      },
      shipping_address: {
        first_name: "John",
        last_name: "Watson",
        email: "test@example.com",
        phone: "0 8128-75 7-9338",
        address: "Sudirman",
        city: "Jakarta",
        postal_code: "12190",
        country_code: "IDN",
      },
    },
    enabled_payments: [
      "credit_card",
      "mandiri_clickpay",
      "cimb_clicks",
      "bca_klikbca",
      "bca_klikpay",
      "bri_epay",
      "echannel",
      "indosat_dompetku",
      "mandiri_ecash",
      "permata_va",
      "bca_va",
      "bni_va",
      "other_va",
      "gopay",
      "kioson",
      "indomaret",
      "gci",
      "danamon_online",
    ],
    credit_card: {
      secure: true,
      channel: "migs",
      bank: "bca",
      installment: {
        required: false,
        terms: {
          bni: [3, 6, 12],
          mandiri: [3, 6, 12],
          cimb: [3],
          bca: [3, 6, 12],
          offline: [6, 12],
        },
      },
      whitelist_bins: ["48111111", "41111111"],
    },
    bca_va: {
      va_number: "12345678911",
      free_text: {
        inquiry: [
          {
            en: "text in English",
            id: "text in Bahasa Indonesia",
          },
        ],
        payment: [
          {
            en: "text in English",
            id: "text in Bahasa Indonesia",
          },
        ],
      },
    },
    bni_va: {
      va_number: "12345678",
    },
    permata_va: {
      va_number: "1234567890",
      recipient_name: "SUDARSONO",
    },
    callbacks: {
      finish: "https://demo.midtrans.com",
    },
    expiry: {
      start_time: getFormattedTime(1000 * 60 * 60 * 24), // current time +24hrs
      unit: "minutes",
      duration: 1,
    },
    custom_field1: "custom field 1 content",
    custom_field2: "custom field 2 content",
    custom_field3: "custom field 3 content",
  };
}

export function getFormattedTime(offsetInMilisecond = 0) {
  let targetDate = new Date(Date.now() + offsetInMilisecond);
  // formatted according to API param spec
  let formattedDateString = targetDate.toISOString().split("T").join(" ").split(".")[0] + " +0000";
  return formattedDateString;
}

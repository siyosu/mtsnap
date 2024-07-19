import axios, { AxiosError, AxiosRequestConfig } from "axios";
import crypto from "node:crypto";
import { MidtransError } from "./error";
import type {
  Config,
  TransactionStatusSuccessResponse,
  TransactionStatusSuccessRefundResponse,
  RequestParameter,
  CreateTransactionSuccessResponse,
} from "./types";

export class Snap {
  private static CORE_SANDBOX_BASE_URL = "https://api.sandbox.midtrans.com/v2";
  private static CORE_PRODUCTION_BASE_URL = "https://api.midtrans.com/v2";
  private static SNAP_SANDBOX_BASE_URL = "https://app.sandbox.midtrans.com/snap/v1";
  private static SNAP_PRODUCTION_BASE_URL = "https://app.midtrans.com/snap/v1";
  private isProduction: boolean;
  private serverKey: string;

  private get snapBaseUrl() {
    return this.isProduction ? Snap.SNAP_PRODUCTION_BASE_URL : Snap.SNAP_SANDBOX_BASE_URL;
  }

  private get coreBaseUrl() {
    return this.isProduction ? Snap.CORE_PRODUCTION_BASE_URL : Snap.CORE_SANDBOX_BASE_URL;
  }

  private httpClient = axios.create({
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  /**Throw `MidtransError` if the config value is not valid */
  private assertConfig(config: Config) {
    const { isProduction, serverKey } = config;
    if (typeof isProduction !== "boolean")
      throw new MidtransError({
        message: `Failed to set Snap config: isProduction type is '${typeof isProduction}', exptected 'boolean' `,
      });

    if (typeof serverKey !== "string")
      throw new MidtransError({
        message: `Failed to set Snap config: serverKey type is '${typeof isProduction}', exptected 'string' `,
      });
  }

  /**Instantiate new Snap instance */
  constructor(config: Config) {
    this.assertConfig(config);
    const { isProduction, serverKey } = config;
    this.isProduction = isProduction;
    this.serverKey = serverKey;

    this.httpClient.interceptors.response.use((res) => {
      const { data } = res;
      // Reject core API error status code
      if (data.status_code && Number(data.status_code) >= 400 && Number(data.status_code) !== 407) {
        return Promise.reject(
          new AxiosError("Midtrans API response error", "API_RESPONSE_ERROR", res.config, res.request, res)
        );
      }
      return res;
    });
  }

  /**Get current snap config */
  config() {
    return {
      isProduction: this.isProduction,
      serverKey: this.serverKey,
      snapBaseUrl: this.snapBaseUrl,
      coreBaseUrl: this.coreBaseUrl,
    };
  }

  /**Set new snap config */
  setConfig(config: Config) {
    this.assertConfig(config);
    const { isProduction, serverKey } = config;
    this.isProduction = isProduction;
    this.serverKey = serverKey;
  }

  /**Make a request to Midtrans Snap API */
  private async request<T = any>(config: AxiosRequestConfig): Promise<T> {
    const defaultConfig: AxiosRequestConfig = {
      auth: {
        username: this.serverKey,
        password: "",
      },
      ...config,
    };
    try {
      const { data } = await this.httpClient(defaultConfig);

      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const res = error.response;
        if (!res)
          throw new MidtransError({
            message: `Midtrans API request failed, HTTP response not found: ${error.message}`,
          });

        const status = res.status < 400 ? Number(res.data.status_code) : res.status;

        throw new MidtransError({
          message: `Midtrans API response error with status code ${status}`,
          statusCode: status,
          apiResponse: res.data,
        });
      }
      throw new MidtransError({ message: `Unknown error: ${(error as Error).message}` });
    }
  }

  /**Check if the transaction status is refunded or not */
  isRefunded(transaction: TransactionStatusSuccessResponse): transaction is TransactionStatusSuccessRefundResponse {
    const status = transaction.transaction_status;
    return status === "partial_refund " || status === "refund";
  }

  /**
   * Create new Snap transaction
   * @see https://docs.midtrans.com/reference/backend-integration
   */
  async createTransaction(parameter: RequestParameter) {
    const url = this.snapBaseUrl + "/transactions";
    const res = await this.request<CreateTransactionSuccessResponse>({
      url,
      method: "POST",
      data: parameter,
    });
    return res;
  }

  /**
   * Get order status using order or transaction id
   * @see https://docs.midtrans.com/reference/get-transaction-status
   */
  async status(orderIdOrTransactionId: string) {
    const url = `${this.coreBaseUrl}/${orderIdOrTransactionId}/status`;
    const res = await this.request<TransactionStatusSuccessResponse>({ url, method: "GET" });
    return res;
  }

  /**
   * Handle notification from Midtrans.
   * Recheck transaction status by default, or you can set it to `false` to verify the notification by comparing the signature key
   */
  async notificaction(body: Record<string, any>, recheck: boolean = true) {
    const { order_id, status_code, gross_amount, transaction_id } = body;
    if (!recheck) {
      const signatureKey = crypto
        .createHash("sha512")
        .update(order_id + status_code + gross_amount + this.serverKey)
        .digest("hex");
      if (signatureKey !== body.signature_key) throw new MidtransError({ message: "Failed to verify signature key" });
      return body;
    }

    const res = await this.status(transaction_id);
    return res;
  }
}

import type { ErrorConstructorOptions } from "./types";

export class MidtransError extends Error {
  apiResponse?: Record<string, any>;
  statusCode?: number;

  constructor(options: ErrorConstructorOptions) {
    const { message, statusCode, apiResponse } = options;
    super(message);

    this.name = "MidtransError";
    this.statusCode = statusCode;
    this.apiResponse = apiResponse;
  }
}

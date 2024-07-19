// Test taken from the `midtrans-client` test
// @see https://github.com/Midtrans/midtrans-nodejs-client/blob/master/test/snap.test.js

import { describe, expect, it } from "vitest";
import { MidtransError, Snap } from "../src";
import {
  CORE_PRODUCTION_BASE_URL,
  CORE_SANDBOX_BASE_URL,
  generateConfig,
  generateParamMax,
  generateParamMin,
  SERVER_KEY,
  SNAP_PRODUCTION_BASE_URL,
  SNAP_SANDBOX_BASE_URL,
} from "./helper";

describe("Snap", () => {
  it("should be failed to instantiate class", () => {
    expect(() => new Snap({} as any)).toThrowError(MidtransError);
  });

  it("should be able to instantiate class", () => {
    const snap = new Snap(generateConfig());
    expect(snap.config()).toEqual({
      isProduction: false,
      serverKey: SERVER_KEY,
      snapBaseUrl: SNAP_SANDBOX_BASE_URL,
      coreBaseUrl: CORE_SANDBOX_BASE_URL,
    });
  });

  it("should be able to set config", () => {
    const snap = new Snap(generateConfig());
    expect(snap.config()).toEqual({
      isProduction: false,
      serverKey: SERVER_KEY,
      snapBaseUrl: SNAP_SANDBOX_BASE_URL,
      coreBaseUrl: CORE_SANDBOX_BASE_URL,
    });
    snap.setConfig({ isProduction: true, serverKey: "newServerKey" });
    expect(snap.config()).toEqual({
      isProduction: true,
      serverKey: "newServerKey",
      snapBaseUrl: SNAP_PRODUCTION_BASE_URL,
      coreBaseUrl: CORE_PRODUCTION_BASE_URL,
    });
  });

  it("should be able to create transaction with minimum parameter", async () => {
    const snap = new Snap(generateConfig());
    const res = await snap.createTransaction(generateParamMin());
    expect(res.token).to.be.a("string");
    expect(res.redirect_url).to.be.a("string");
  });

  it("should be able to create transaction with maximum parameter", async () => {
    const snap = new Snap(generateConfig());
    const res = await snap.createTransaction(generateParamMax());
    expect(res.token).to.be.a("string");
    expect(res.redirect_url).to.be.a("string");
  });

  it("should failed with 404 error when order or transaction id is not exist", async () => {
    const shouldFail = async () => {
      const snap = new Snap(generateConfig());
      await snap.status("is not exist");
    };
    await expect(shouldFail).rejects.toThrowError("404");
  });

  it("should failed with 401 error when server key is not exist", async () => {
    const shouldFail = async () => {
      const snap = new Snap({ isProduction: false, serverKey: "" });
      await snap.status("is not exist");
    };
    await expect(shouldFail).rejects.toThrowError("401");
  });

  it("should failed to create transaction with 401 or 400 error when server key is not exist", async () => {
    const shouldFail = async () => {
      const snap = new Snap({ isProduction: false, serverKey: "" });
      await snap.createTransaction(generateParamMin());
    };
    await expect(shouldFail).rejects.toThrowError(/404|401/);
  });

  it("should failed to create transaction with 400 error when parameter is not provided", async () => {
    const shouldFail = async () => {
      const snap = new Snap(generateConfig());
      await snap.createTransaction({} as any);
    };
    await expect(shouldFail).rejects.toThrowError("400");
  });

  // TODO: Able to check transaction status and very notification
});

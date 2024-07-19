# MTSnap

Unofficial Midtrans Snap payment API client for node.

## Installation

```bash
npm i mtsnap
```

## Usage

```typescript
import { Snap } from "mtsnap";

// create new instance
const snap = new Snap({ isProduction: false, serverKey: process.env.SERVER_KEY });

(async () => {
  try {
    // Create new transaction
    const res = await snap.createTransaction({
      transaction_details: {
        order_id: "test-20240719" + generateTimestamp(),
        gross_amount: 200000,
      },
      credit_card: {
        secure: true,
      },
    });
    console.log(res);
  } catch (error) {
    console.error(error);
  }
})();
```

## API

| Methods                | Description                                               |
| :--------------------- | :-------------------------------------------------------- |
| `.config()`            | Get current snap config                                   |
| `.setConfig()`         | Set new snap config                                       |
| `.createTransaction()` | Create new transaction                                    |
| `.status()`            | Get transaction status                                    |
| `.isRefunded()`        | Type guard to check if the transaction status is refunded |
| `.notificaction()`     | Verify notification from midtrans                         |

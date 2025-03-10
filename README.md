# aptos-send-tx

Send a transaction on the Aptos testnet.

## Running the Transaction

To execute a transaction, use the following command in your terminal:

```bash
npm run tx
```

### Example Output

```bash
 ~/Project/github/Move/aptos-send-tx/ [main] npm run tx                               

> aptos-send-tx@1.0.0 tx
> node --loader ts-node/esm transaction.ts

=== Addresses ===
Sender (A): 0xe21b783b74968b201992e460e5f216e3df773f8df7509c5871d3dfefc5f0ae8e 
Private Key: 6f2cc4834c81696925d86ce4d81e76b36b6518ffff6b0049a75bc61c5d1676cc

Receiver (B): 0x654a3771606b5ef2ca2b50c978b1fb80f73436a68082a94abe3ce654c0f0d6fd 
Private Key: e3b5bf3b3b06cd59d6f7d6d5af40620f9430934fa1e2e5dddc95b1eb6fce048f

=== Initial Balances ===
A: 20000
B: 0
Transaction Hash: 0xa19a19e120c721c8779c8aac8c6394f6d7464069ecdbae9ea5c96c0d4d444c7b

=== Updated Balances ===
A: 18949
B: 1000
```

### Blockchain Explorer
You can view the transaction details on the Aptos testnet explorer:
[Explorer Link](https://explorer.devnet.aptos.dev/)

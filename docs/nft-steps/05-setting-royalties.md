**ADD ROYALTY RULE TO TRANSFER POLICY**

Yes, that's correct!  
**Setting the royalty** is done by the contract (collection) admin/owner via a command-line call to the entry function (e.g., `update_royalty_rules`).  
**The resultant royalty configuration** is stored in the on-chain TransferPolicy object, and is viewable from the explorer or by querying the object directly.

---

## 1. **Setting the Royalty (Command-Line Example)**

You would use the Sui CLI to call your `update_royalty_rules` entry function.  
Here’s a generic example based on your contract:

```sh
sui client call \
  --package <PACKAGE_ID> \
  --module nfter \
  --function update_royalty_rules \
  --args <COLLECTION_ID> <TRANSFER_POLICY_ID> <TRANSFER_POLICY_CAP_ID> <AMOUNT_BP> <MIN_AMOUNT> \
  --gas-budget 100000000
```

**Replace:**

- `<PACKAGE_ID>`: Your published package ID
- `<COLLECTION_ID>`: Object ID of your OffbrandCollection
- `<TRANSFER_POLICY_ID>`: Object ID of the TransferPolicy for your collection
- `<TRANSFER_POLICY_CAP_ID>`: Object ID of the TransferPolicyCap (admin holds this)
- `<AMOUNT_BP>`: Royalty in basis points (e.g., 500 for 5%)
- `<MIN_AMOUNT>`: Minimum royalty in SUI (e.g., 0)

**Example:**

```sh
sui client call \
  --package 0x123... \
  --module nfter \
  --function update_royalty_rules \
  --args 0xabc... 0xdef... 0x456... 500 0 \
  --gas-budget 100000000
```

---

## 2. **Viewing the Royalty in the Explorer**

- Go to the Sui Explorer ([Sui Explorer](https://suiexplorer.com/))
- Search for your **TransferPolicy object** (use the object ID you set above)
- You’ll see the rule configuration, including the royalty percentage and minimum, in the object’s fields.

---

## 3. **References**

- [Sui Client CLI Reference](https://docs.sui.io/references/cli/client)
- [Sui Explorer](https://suiexplorer.com/)
- [TransferPolicy and Royalty Rule Concepts](https://docs.sui.io/concepts/gaming)

---

Would you like help with a command to query the TransferPolicy object directly from the CLI, or details on how to find the object IDs you need?

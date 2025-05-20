**STEP 4 BEGIN COMMANDS - SHOW INITIAL EMPTY POLICY FROM INITIAL INIT/DEPLOY**

```
(.env) hosermage@LAPTOP-1RPE37PF:~/projects/NFTer/move$ sui client object 0x3fc3b857ec0193c5dde32b0e4df5908d432af6684bce3728951241b3d18ece76
[warning] Client/Server api version mismatch, client api version : 1.48.0, server api version : 1.49.0
╭───────────────┬────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╮
│ objectId      │  0x3fc3b857ec0193c5dde32b0e4df5908d432af6684bce3728951241b3d18ece76                                                                                    │
│ version       │  10                                                                                                                                                    │
│ digest        │  5kCh7kHWFiUnYFpovLgyX3vzCruRq42Vvmo56bF7ypBW                                                                                                          │
│ objType       │  0x2::transfer_policy::TransferPolicy<0xcdce2521d91f31676afe199f5a28755289740dd6d73bf40e74b2eed4fa09805f::nfter::OffbrandNFT>                          │
│ owner         │ ╭────────┬───────────────────────────────────╮                                                                                                         │
│               │ │ Shared │ ╭────────────────────────┬──────╮ │                                                                                                         │
│               │ │        │ │ initial_shared_version │  10  │ │                                                                                                         │
│               │ │        │ ╰────────────────────────┴──────╯ │                                                                                                         │
│               │ ╰────────┴───────────────────────────────────╯                                                                                                         │
│ prevTx        │  91NrM6F3yCoKcG6NCB6srhFEh9qug5GATEgJUogBbXcQ                                                                                                          │
│ storageRebate │  1877200                                                                                                                                               │
│ content       │ ╭───────────────────┬────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╮ │
│               │ │ dataType          │  moveObject                                                                                                                    │ │
│               │ │ type              │  0x2::transfer_policy::TransferPolicy<0xcdce2521d91f31676afe199f5a28755289740dd6d73bf40e74b2eed4fa09805f::nfter::OffbrandNFT>  │ │
│               │ │ hasPublicTransfer │  true                                                                                                                          │ │
│               │ │ fields            │ ╭─────────┬───────────────────────────────────────────────────────────────────────────────╮                                    │ │
│               │ │                   │ │ balance │  0                                                                            │                                    │ │
│               │ │                   │ │ id      │ ╭────┬──────────────────────────────────────────────────────────────────────╮ │                                    │ │
│               │ │                   │ │         │ │ id │  0x3fc3b857ec0193c5dde32b0e4df5908d432af6684bce3728951241b3d18ece76  │ │                                    │ │
│               │ │                   │ │         │ ╰────┴──────────────────────────────────────────────────────────────────────╯ │                                    │ │
│               │ │                   │ │ rules   │ ╭────────┬──────────────────────────────────────────────────╮                 │                                    │ │
│               │ │                   │ │         │ │ type   │  0x2::vec_set::VecSet<0x1::type_name::TypeName>  │                 │                                    │ │
│               │ │                   │ │         │ │ fields │ ╭──────────┬──╮                                  │                 │                                    │ │
│               │ │                   │ │         │ │        │ │ contents │  │                                  │                 │                                    │ │
│               │ │                   │ │         │ │        │ ╰──────────┴──╯                                  │                 │                                    │ │
│               │ │                   │ │         │ ╰────────┴──────────────────────────────────────────────────╯                 │                                    │ │
│               │ │                   │ ╰─────────┴───────────────────────────────────────────────────────────────────────────────╯                                    │ │
│               │ ╰───────────────────┴────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╯ │
╰───────────────┴────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╯
(.env) hosermage@LAPTOP-1RPE37PF:~/projects/NFTer/move$
```

**STEP 4**

**Yes, you do need to create a TransferPolicy for your NFTs to be tradeable and to enforce royalty rules.**

### Why?

- Your `OffbrandCollection` stores a `transfer_policy_id` and is initialized with a new `TransferPolicy<OffbrandNFT>` in `init_collection`.
- The Sui Kiosk system requires a TransferPolicy for any type you want to trade with custom rules (like royalties).
- Your royalty logic (`update_royalty_rules` and `create_nft_transfer_policy`) expects a `TransferPolicy` and `TransferPolicyCap` to exist and be passed in.

### How is it created?

- In your `init_collection` entry function, you already create and share a `TransferPolicy<OffbrandNFT>`:
  ```move
  let (policy, policy_cap) = transfer_policy::new<OffbrandNFT>(&publisher, ctx);
  let policy_id = object::id(&policy);
  transfer::public_share_object(policy);
  ...
  transfer::public_transfer(policy_cap, ctx.sender());
  ```
- This means, after calling `init_collection`, you already have:
  - A shared `TransferPolicy<OffbrandNFT>` object (needed for trading and rules)
  - A `TransferPolicyCap<OffbrandNFT>` object (needed for adding/removing rules, withdrawing fees, etc.)

### When do you need to call `create_nft_transfer_policy`?

- If you want to create another, separate `TransferPolicy` (for example, for a new set of rules or a new NFT type), you can use your `create_nft_transfer_policy` function.
- For most use cases, the single policy created in `init_collection` is enough, and you just update its rules with `update_royalty_rules`.

---

### TL;DR

- **You must have a TransferPolicy for your NFT type to use royalties and trade in Kiosk.**
- Your `init_collection` already creates it for you.
- Use `update_royalty_rules` to set or update royalty rules on the existing policy.
- Only use `create_nft_transfer_policy` if you need an extra policy for some reason.

---

**References:**

- [TransferPolicy and Kiosk system](https://github.com/sui-foundation/sui-move-intro-course/blob/374a71bdbb95514d69f71e56ce607f543126ef8d/unit-five/lessons/5_transfer_policy.md)
- [TransferPolicy module docs](https://github.com/MystenLabs/sui/blob/7214872434b3b0578fccc4d3e468371855a4ecf8/crates/sui-framework/docs/sui/transfer_policy.md)

---

Would you like a step-by-step example of how to set royalty rules on your existing policy, or how to use these objects in a mint or trade flow?

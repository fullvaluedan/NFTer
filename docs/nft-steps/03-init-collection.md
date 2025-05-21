**INIT COLLECTION**

```
(.env) hosermage@LAPTOP-1RPE37PF:~/projects/NFTer/move$ sui client call \
  --package 0xcdce2521d91f31676afe199f5a28755289740dd6d73bf40e74b2eed4fa09805f \
  --module nfter \
  --function init_collection \
  --args "Offbrand Crypto" \
         "The official collection of Offbrand Crypto NFTs, uniquely generated and ready for the 8-Bit Oracle." \
         100000000 \
         10000000 \
         0x700786a60ee4ced5b9f05c5f92496e7db18e0c5c8e407be62cc29277a4a22a01 \
  --gas-budget 100000000 \
  --json
[warning] Client/Server api version mismatch, client api version : 1.48.0, server api version : 1.49.0
{
  "digest": "91NrM6F3yCoKcG6NCB6srhFEh9qug5GATEgJUogBbXcQ",
  "transaction": {
    "data": {
      "messageVersion": "v1",
      "transaction": {
        "kind": "ProgrammableTransaction",
        "inputs": [
          {
            "type": "pure",
            "valueType": "0x1::string::String",
            "value": "Offbrand Crypto"
          },
          {
            "type": "pure",
            "valueType": "0x1::string::String",
            "value": "The official collection of Offbrand Crypto NFTs, uniquely generated and ready for the 8-Bit Oracle."
          },
          {
            "type": "pure",
            "valueType": "u64",
            "value": "100000000"
          },
          {
            "type": "pure",
            "valueType": "u64",
            "value": "10000000"
          },
          {
            "type": "object",
            "objectType": "immOrOwnedObject",
            "objectId": "0x700786a60ee4ced5b9f05c5f92496e7db18e0c5c8e407be62cc29277a4a22a01",
            "version": "9",
            "digest": "HXrd2V4smX6B9ASLVwkAnDPtjpjzy2tZukNmjMZLsj3W"
          }
        ],
        "transactions": [
          {
            "MoveCall": {
              "package": "0xcdce2521d91f31676afe199f5a28755289740dd6d73bf40e74b2eed4fa09805f",
              "module": "nfter",
              "function": "init_collection",
              "arguments": [
                {
                  "Input": 0
                },
                {
                  "Input": 1
                },
                {
                  "Input": 2
                },
                {
                  "Input": 3
                },
                {
                  "Input": 4
                }
              ]
            }
          }
        ]
      },
      "sender": "0xb77e64fd104aa3567129d7ead47c10286847c936e1932f36319337ae2c241f4b",
      "gasData": {
        "payment": [
          {
            "objectId": "0x2e11ac57aca575d0eabc82aa2e6220ffa1ff7a3cbb806b0c638252eedebaa8a8",
            "version": 9,
            "digest": "HqtBEP5ausi3ns32T6jxfc6yymvwXiq6AtRsBVKPrjyC"
          }
        ],
        "owner": "0xb77e64fd104aa3567129d7ead47c10286847c936e1932f36319337ae2c241f4b",
        "price": "1000",
        "budget": "100000000"
      }
    },
    "txSignatures": [
      "ALaKhNZHBrfPxiF+Q06s9rixEOmXROyKVUswvTZMyZ9tw8ERDeZJNR9h824DdMcNXr0Gy2r+JFUJsZNoGfALigcu26jlImoB/SXaoY0glMhyVcPdZ/d3E0BYzKKZjPmmcw=="
    ]
  },
  "effects": {
    "messageVersion": "v1",
    "status": {
      "status": "success"
    },
    "executedEpoch": "14",
    "gasUsed": {
      "computationCost": "1000000",
      "storageCost": "8641200",
      "storageRebate": "2813976",
      "nonRefundableStorageFee": "28424"
    },
    "modifiedAtVersions": [
      {
        "objectId": "0x2e11ac57aca575d0eabc82aa2e6220ffa1ff7a3cbb806b0c638252eedebaa8a8",
        "sequenceNumber": "9"
      },
      {
        "objectId": "0x700786a60ee4ced5b9f05c5f92496e7db18e0c5c8e407be62cc29277a4a22a01",
        "sequenceNumber": "9"
      }
    ],
    "transactionDigest": "91NrM6F3yCoKcG6NCB6srhFEh9qug5GATEgJUogBbXcQ",
    "created": [
      {
        "owner": {
          "AddressOwner": "0xb77e64fd104aa3567129d7ead47c10286847c936e1932f36319337ae2c241f4b"
        },
        "reference": {
          "objectId": "0x03d709f36113e427501ffead002c3a0050afa27154ae0e4adbb7c6033e12fb5b",
          "version": 10,
          "digest": "8q18CgWBoz1FsjZNbqEm2Yo86EaTQVmPKVUAzMVs8UA9"
        }
      },
      {
        "owner": {
          "AddressOwner": "0xb77e64fd104aa3567129d7ead47c10286847c936e1932f36319337ae2c241f4b"
        },
        "reference": {
          "objectId": "0x1ed12964896b6437c0d76d7198d7f625279332731f1b8298d668e0a6ee67432c",
          "version": 10,
          "digest": "Gt4q4SZFozpUnRB9TykU3meeLGcJA2REqr16wfz1T5JL"
        }
      },
      {
        "owner": {
          "Shared": {
            "initial_shared_version": 10
          }
        },
        "reference": {
          "objectId": "0x3fc3b857ec0193c5dde32b0e4df5908d432af6684bce3728951241b3d18ece76",
          "version": 10,
          "digest": "5kCh7kHWFiUnYFpovLgyX3vzCruRq42Vvmo56bF7ypBW"
        }
      }
    ],
    "mutated": [
      {
        "owner": {
          "AddressOwner": "0xb77e64fd104aa3567129d7ead47c10286847c936e1932f36319337ae2c241f4b"
        },
        "reference": {
          "objectId": "0x2e11ac57aca575d0eabc82aa2e6220ffa1ff7a3cbb806b0c638252eedebaa8a8",
          "version": 10,
          "digest": "JACTpjokL6Bwi2Z4m2n8GwZuhesV35GgZxwRrgvH4ANT"
        }
      }
    ],
    "wrapped": [
      {
        "objectId": "0x700786a60ee4ced5b9f05c5f92496e7db18e0c5c8e407be62cc29277a4a22a01",
        "version": 10,
        "digest": "6ws1bVyu3F8wGy1fPHhrc2v8UyWiGbRAAuek8SwikKPD"
      }
    ],
    "gasObject": {
      "owner": {
        "AddressOwner": "0xb77e64fd104aa3567129d7ead47c10286847c936e1932f36319337ae2c241f4b"
      },
      "reference": {
        "objectId": "0x2e11ac57aca575d0eabc82aa2e6220ffa1ff7a3cbb806b0c638252eedebaa8a8",
        "version": 10,
        "digest": "JACTpjokL6Bwi2Z4m2n8GwZuhesV35GgZxwRrgvH4ANT"
      }
    },
    "eventsDigest": "2ZrYMLmaKQSLhTeuh86phLM8pUwXXmGeXTZtcnB2HLsw",
    "dependencies": [
      "8iVbpWeeC7wygZFAyRZS3ipQv738Zr8N9MAbwzbKyqVf"
    ]
  },
  "events": [
    {
      "id": {
        "txDigest": "91NrM6F3yCoKcG6NCB6srhFEh9qug5GATEgJUogBbXcQ",
        "eventSeq": "0"
      },
      "packageId": "0xcdce2521d91f31676afe199f5a28755289740dd6d73bf40e74b2eed4fa09805f",
      "transactionModule": "nfter",
      "sender": "0xb77e64fd104aa3567129d7ead47c10286847c936e1932f36319337ae2c241f4b",
      "type": "0x2::transfer_policy::TransferPolicyCreated<0xcdce2521d91f31676afe199f5a28755289740dd6d73bf40e74b2eed4fa09805f::nfter::OffbrandNFT>",
      "parsedJson": {
        "id": "0x3fc3b857ec0193c5dde32b0e4df5908d432af6684bce3728951241b3d18ece76"
      },
      "bcsEncoding": "base64",
      "bcs": "P8O4V+wBk8Xd4ysOTfWQjUMq9mhLzjcolRJBs9GOznY="
    }
  ],
  "objectChanges": [
    {
      "type": "mutated",
      "sender": "0xb77e64fd104aa3567129d7ead47c10286847c936e1932f36319337ae2c241f4b",
      "owner": {
        "AddressOwner": "0xb77e64fd104aa3567129d7ead47c10286847c936e1932f36319337ae2c241f4b"
      },
      "objectType": "0x2::coin::Coin<0x2::sui::SUI>",
      "objectId": "0x2e11ac57aca575d0eabc82aa2e6220ffa1ff7a3cbb806b0c638252eedebaa8a8",
      "version": "10",
      "previousVersion": "9",
      "digest": "JACTpjokL6Bwi2Z4m2n8GwZuhesV35GgZxwRrgvH4ANT"
    },
    {
      "type": "created",
      "sender": "0xb77e64fd104aa3567129d7ead47c10286847c936e1932f36319337ae2c241f4b",
      "owner": {
        "AddressOwner": "0xb77e64fd104aa3567129d7ead47c10286847c936e1932f36319337ae2c241f4b"
      },
      "objectType": "0xcdce2521d91f31676afe199f5a28755289740dd6d73bf40e74b2eed4fa09805f::nfter::OffbrandCollection",
      "objectId": "0x03d709f36113e427501ffead002c3a0050afa27154ae0e4adbb7c6033e12fb5b",
      "version": "10",
      "digest": "8q18CgWBoz1FsjZNbqEm2Yo86EaTQVmPKVUAzMVs8UA9"
    },
    {
      "type": "created",
      "sender": "0xb77e64fd104aa3567129d7ead47c10286847c936e1932f36319337ae2c241f4b",
      "owner": {
        "AddressOwner": "0xb77e64fd104aa3567129d7ead47c10286847c936e1932f36319337ae2c241f4b"
      },
      "objectType": "0x2::transfer_policy::TransferPolicyCap<0xcdce2521d91f31676afe199f5a28755289740dd6d73bf40e74b2eed4fa09805f::nfter::OffbrandNFT>",
      "objectId": "0x1ed12964896b6437c0d76d7198d7f625279332731f1b8298d668e0a6ee67432c",
      "version": "10",
      "digest": "Gt4q4SZFozpUnRB9TykU3meeLGcJA2REqr16wfz1T5JL"
    },
    {
      "type": "created",
      "sender": "0xb77e64fd104aa3567129d7ead47c10286847c936e1932f36319337ae2c241f4b",
      "owner": {
        "Shared": {
          "initial_shared_version": 10
        }
      },
      "objectType": "0x2::transfer_policy::TransferPolicy<0xcdce2521d91f31676afe199f5a28755289740dd6d73bf40e74b2eed4fa09805f::nfter::OffbrandNFT>",
      "objectId": "0x3fc3b857ec0193c5dde32b0e4df5908d432af6684bce3728951241b3d18ece76",
      "version": "10",
      "digest": "5kCh7kHWFiUnYFpovLgyX3vzCruRq42Vvmo56bF7ypBW"
    }
  ],
  "balanceChanges": [
    {
      "owner": {
        "AddressOwner": "0xb77e64fd104aa3567129d7ead47c10286847c936e1932f36319337ae2c241f4b"
      },
      "coinType": "0x2::sui::SUI",
      "amount": "-6827224"
    }
  ],
  "timestampMs": "1747724683421",
  "confirmedLocalExecution": true,
  "checkpoint": "246941"
}
```

Here’s a step-by-step explanation of what the `init_collection` function does:

---

### Function: `init_collection`

#### Purpose

Creates and initializes a new NFT collection on Sui, sets up transfer rules, and assigns admin rights.

#### Step-by-Step Breakdown

1. **Creates a TransferPolicy for the Collection**

   ```move
   let (policy, policy_cap) = transfer_policy::new<OffbrandNFT>(&publisher, ctx);
   let policy_id = object::id(&policy);
   ```

   - A new `TransferPolicy` is created for the `OffbrandNFT` type.
   - This policy will control how NFTs in this collection can be transferred (e.g., enforcing royalties or other rules).
   - The `policy_id` is recorded for reference.

2. **Shares the TransferPolicy**

   ```move
   transfer::public_share_object(policy);
   ```

   - The `TransferPolicy` object is made shared, so it can be accessed and enforced on-chain.

3. **Creates the Collection Object**

   ```move
   let collection = OffbrandCollection {
       id: object::new(ctx),
       name,
       description,
       admin: ctx.sender(),
       total_minted: 0,
       minting_fee,
       prompt_update_fee,
       publisher,
       transfer_policy_id: policy_id,
   };
   ```

   - A new `OffbrandCollection` object is created with:
     - The provided name and description.
     - The sender as the admin.
     - Initial `total_minted` set to 0.
     - The specified minting and prompt update fees.
     - The publisher and the transfer policy ID.

4. **Transfers the TransferPolicyCap to the Admin**

   ```move
   transfer::public_transfer(policy_cap, ctx.sender());
   ```

   - The `TransferPolicyCap` (which allows managing the policy) is given to the admin (the transaction sender).

5. **Transfers the Collection Object to the Admin**
   ```move
   transfer::transfer(collection, ctx.sender());
   ```
   - The new collection object is transferred to the admin’s address.

---

### Summary

- **Creates a new NFT collection** with your specified metadata and fees.
- **Sets up and shares a transfer policy** for all NFTs in this collection.
- **Gives the admin (sender) control** over the collection and its transfer policy.

This sets up everything needed to start minting and managing NFTs under this collection, with transfer rules enforced by the policy.

---

Would you like to see how to mint NFTs using this collection next, or do you want details on how to customize the transfer policy?

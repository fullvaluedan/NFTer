Okay, let's polish these instructions and address your specific question about redeployment.

**Polished Instructions for Creating a TransferPolicy for `OffbrandNFT`**

**Prerequisites:**

- You have already published your `nfter` package containing the `OffbrandNFT` type definition.
- You have the `Publisher` object ID from that publication. (This is the `objectId` of the `Publisher` object created during the `publish` transaction, not the `packageId`).

**Step 1: Add the `new_policy` Function to Your Contract**

You need to add the function to create the `TransferPolicy` to your `nfter.move` file. You **do not** need to add a `transfer_policy_id` field to your `OffbrandCollection` or `OffbrandNFT` structs.

```move
// In nfter::nfter module
use sui::tx_context::{Self, TxContext};
use sui::transfer_policy::{Self, TransferPolicy, TransferPolicyCap};
use sui::package::{Self, Publisher};
use sui::transfer::{Self};

public fun new_policy(publisher: &Publisher, ctx: &mut TxContext) {
    let (policy, policy_cap) = transfer_policy::new<OffbrandNFT>(publisher, ctx);
    transfer::public_share_object(policy);
    transfer::public_transfer(policy_cap, tx_context::sender(ctx));
}
```

**Step 2: Recompile and Redeploy Your Contract**

- **Yes, you need to recompile and redeploy.** Adding the `new_policy` function is a change to your contract's code. You need to:
  1.  Recompile your contract: `sui move build --dev` (or your build command).
  2.  Redeploy the updated package: `sui client publish --gas-budget 500000000 --json`.
  3.  **Important:** Note the new `packageId` and the new `Publisher` object ID from the `publish` transaction output. You will need the new `Publisher` object ID for the next step.

**Step 3: Call `new_policy` Using the Sui CLI**

Use the Sui CLI to call the `new_policy` function, passing the **new** `Publisher` object ID as an argument.

```bash
sui client call --package <NEW_PACKAGE_ID> --module nfter --function new_policy --args <NEW_PUBLISHER_OBJECT_ID> --gas-budget 100000000 --json
```

- Replace `<NEW_PACKAGE_ID>` with the `packageId` from your **recent** `publish` transaction.
- Replace `<NEW_PUBLISHER_OBJECT_ID>` with the `objectId` of the `Publisher` object created in your **recent** `publish` transaction.

**Step 4: Verify the TransferPolicy Creation**

- The `new_policy` function will create a `TransferPolicy<OffbrandNFT>` object and share it.
- It will also create a `TransferPolicyCap<OffbrandNFT>` object and transfer it to the sender of the transaction (you).
- You can verify this by checking the transaction effects in the Sui Explorer or by using the Sui CLI to query the objects created by the transaction.

**Step 5: (Optional) Add Rules to the TransferPolicy**

If you want to add rules (like royalties) to your `TransferPolicy`, you can do so in a separate function. You will need the `TransferPolicyCap` object to add rules.

```move
// In nfter::nfter module
use sui::transfer_policy::{Self, TransferPolicy, TransferPolicyCap};

const ROYALTY_PERCENTAGE_BPS: u16 = 500; // Basis points, e.g., 500 = 5%

public fun add_royalty_rule(policy: &mut TransferPolicy<OffbrandNFT>, policy_cap: &TransferPolicyCap<OffbrandNFT>, royalty_recipient: address) {
    transfer_policy::add_royalty_rule(policy, policy_cap, royalty_recipient, ROYALTY_PERCENTAGE_BPS);
}

// Optionally, add a lock rule to enforce the NFT stays in Kiosks
public fun add_lock_rule(policy: &mut TransferPolicy<OffbrandNFT>, policy_cap: &TransferPolicyCap<OffbrandNFT>) {
    transfer_policy::add_lock_rule(policy, policy_cap);
}
```

You would call these functions using the Sui CLI, passing the `TransferPolicy` and `TransferPolicyCap` object IDs as arguments.

**In summary:**

- You need to recompile and redeploy your contract to add the `new_policy` function.
- You need to call `new_policy` using the **new** `Publisher` object ID from the **recent** `publish` transaction.
- The `TransferPolicy` is a separate, shared object for your NFT type, and you don't store its ID in your NFT or collection structs.

Let me know if you have any other questions!

**BEGIN COMMANDS**

````
(.env) hosermage@LAPTOP-1RPE37PF:~/projects/NFTer/move$ sui client publish --gas-budget 500000000 --json
[warning] Client/Server api version mismatch, client api version : 1.48.0, server api version : 1.49.0
[Note]: Dependency sources are no longer verified automatically during publication and upgrade. You can pass the `--verify-deps` option if you would like to verify them as part of publication or upgrade.
[note] Dependencies on Bridge, MoveStdlib, Sui, and SuiSystem are automatically added, but this feature is disabled for your package because you have explicitly included dependencies on Sui. Consider removing these dependencies from Move.toml.
UPDATING GIT DEPENDENCY https://github.com/MystenLabs/sui.git
INCLUDING DEPENDENCY Sui
INCLUDING DEPENDENCY MoveStdlib
BUILDING nfter
Total number of linter warnings suppressed: 1 (unique lints: 1)
Skipping dependency verification
{
  "digest": "8R8b9M3qBMHDwQDHRkaVUYNXwiJcndwbpmXtpdRUAF79",
  "transaction": {
    "data": {
      "messageVersion": "v1",
      "transaction": {
        "kind": "ProgrammableTransaction",
        "inputs": [
          {
            "type": "pure",
            "valueType": "address",
            "value": "0xb77e64fd104aa3567129d7ead47c10286847c936e1932f36319337ae2c241f4b"
          }
        ],
        "transactions": [
          {
            "Publish": [
              "0x0000000000000000000000000000000000000000000000000000000000000001",
              "0x0000000000000000000000000000000000000000000000000000000000000002"
            ]
          },
          {
            "TransferObjects": [
              [
                {
                  "Result": 0
                }
              ],
              {
                "Input": 0
              }
            ]
          }
        ]
      },
      "sender": "0xb77e64fd104aa3567129d7ead47c10286847c936e1932f36319337ae2c241f4b",
      "gasData": {
        "payment": [
          {
            "objectId": "0x2e11ac57aca575d0eabc82aa2e6220ffa1ff7a3cbb806b0c638252eedebaa8a8",
            "version": 7,
            "digest": "9nwtvsQjNCuK6LYCDnkKsGhcAm5iEG24eviyeFQhzNXZ"
          }
        ],
        "owner": "0xb77e64fd104aa3567129d7ead47c10286847c936e1932f36319337ae2c241f4b",
        "price": "1000",
        "budget": "500000000"
      }
    },
    "txSignatures": [
      "ANwfJHu51d24UfuFSXBj45lDrAubiv2I5bJUGQ/8urCHt2dmxvGFLU3kQ2Ihx1qV7fGqMcvCwtX95KQ5ViC3Dw4u26jlImoB/SXaoY0glMhyVcPdZ/d3E0BYzKKZjPmmcw=="
    ]
  },
  "effects": {
    "messageVersion": "v1",
    "status": {
      "status": "success"
    },
    "executedEpoch": "9",
    "gasUsed": {
      "computationCost": "1000000",
      "storageCost": "44543600",
      "storageRebate": "978120",
      "nonRefundableStorageFee": "9880"
    },
    "modifiedAtVersions": [
      {
        "objectId": "0x2e11ac57aca575d0eabc82aa2e6220ffa1ff7a3cbb806b0c638252eedebaa8a8",
        "sequenceNumber": "7"
      }
    ],
    "transactionDigest": "8R8b9M3qBMHDwQDHRkaVUYNXwiJcndwbpmXtpdRUAF79",
    "created": [
      {
        "owner": {
          "AddressOwner": "0xb77e64fd104aa3567129d7ead47c10286847c936e1932f36319337ae2c241f4b"
        },
        "reference": {
          "objectId": "0x785aea15c374a2eb11c18fe4fc6993a958b2440d4a03a51a57ab095a6bf96a1d",
          "version": 8,
          "digest": "HNtxk3ab86buzdL8bSvdCeX1bGXDjPzpLHiwxZAK3MyC"
        }
      },
      {
        "owner": "Immutable",
        "reference": {
          "objectId": "0xa2b8e53fe9cb35875d71d951ead8ac3c1b3c28e7b97e2994da4accd2b81ef7f0",
          "version": 1,
          "digest": "BFC9DEoMnAceGk2cXB8EPqmDPwuzcHC4taazvvFkJUuW"
        }
      },
      {
        "owner": {
          "AddressOwner": "0xb77e64fd104aa3567129d7ead47c10286847c936e1932f36319337ae2c241f4b"
        },
        "reference": {
          "objectId": "0xb3e25756baf4bb99af4008385462090a693467f9c4fdcb9fb86490606ee36888",
          "version": 8,
          "digest": "ALQLFwpnbje73BMGQbSoK2DjubXs6cRQ4Y8B9GXtu2UW"
        }
      },
      {
        "owner": {
          "AddressOwner": "0xb77e64fd104aa3567129d7ead47c10286847c936e1932f36319337ae2c241f4b"
        },
        "reference": {
          "objectId": "0xe8d8543ed68047755369a515a425eed78589d6aa3f9d915d76df99c420501a08",
          "version": 8,
          "digest": "GmdodcqqQ5UEaCgY79jm5GFNnMccGqrCESqVfq81aL1P"
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
          "version": 8,
          "digest": "BBh86hRpPJvG9gDNj1HETNcj35mpguFVWnFK1YqacQbV"
        }
      }
    ],
    "gasObject": {
      "owner": {
        "AddressOwner": "0xb77e64fd104aa3567129d7ead47c10286847c936e1932f36319337ae2c241f4b"
      },
      "reference": {
        "objectId": "0x2e11ac57aca575d0eabc82aa2e6220ffa1ff7a3cbb806b0c638252eedebaa8a8",
        "version": 8,
        "digest": "BBh86hRpPJvG9gDNj1HETNcj35mpguFVWnFK1YqacQbV"
      }
    },
    "eventsDigest": "T9zmViNcz84xKMGX5Fud7tWSqnkcgATLJXrqiWqJzuG",
    "dependencies": [
      "79DnRWmDcDQhKJnpoomW5gPtUDQy4rVj1BH9ARGRaADv",
      "Ac1osjpCMkYmmdZy6Vf94riZzZTJJBUWdeHNhwN5VCHj"
    ]
  },
  "events": [
    {
      "id": {
        "txDigest": "8R8b9M3qBMHDwQDHRkaVUYNXwiJcndwbpmXtpdRUAF79",
        "eventSeq": "0"
      },
      "packageId": "0xa2b8e53fe9cb35875d71d951ead8ac3c1b3c28e7b97e2994da4accd2b81ef7f0",
      "transactionModule": "nfter",
      "sender": "0xb77e64fd104aa3567129d7ead47c10286847c936e1932f36319337ae2c241f4b",
      "type": "0x2::display::DisplayCreated<0xa2b8e53fe9cb35875d71d951ead8ac3c1b3c28e7b97e2994da4accd2b81ef7f0::nfter::OffbrandNFT>",
      "parsedJson": {
        "id": "0x785aea15c374a2eb11c18fe4fc6993a958b2440d4a03a51a57ab095a6bf96a1d"
      },
      "bcsEncoding": "base64",
      "bcs": "eFrqFcN0ousRwY/k/GmTqViyRA1KA6UaV6sJWmv5ah0="
    },
    {
      "id": {
        "txDigest": "8R8b9M3qBMHDwQDHRkaVUYNXwiJcndwbpmXtpdRUAF79",
        "eventSeq": "1"
      },
      "packageId": "0xa2b8e53fe9cb35875d71d951ead8ac3c1b3c28e7b97e2994da4accd2b81ef7f0",
      "transactionModule": "nfter",
      "sender": "0xb77e64fd104aa3567129d7ead47c10286847c936e1932f36319337ae2c241f4b",
      "type": "0x2::display::VersionUpdated<0xa2b8e53fe9cb35875d71d951ead8ac3c1b3c28e7b97e2994da4accd2b81ef7f0::nfter::OffbrandNFT>",
      "parsedJson": {
        "fields": {
          "contents": [
            {
              "key": "name",
              "value": "{name}"
            },
            {
              "key": "description",
              "value": "{description}"
            },
            {
              "key": "mint_number",
              "value": "{mint_number}"
            },
            {
              "key": "image_url",
              "value": "https://walrus.xyz/blob/{walrus_blob_id}"
            },
            {
              "key": "generation_prompt",
              "value": "{generation_prompt}"
            },
            {
              "key": "model_version",
              "value": "{model_version}"
            },
            {
              "key": "created_at",
              "value": "{created_at}"
            },
            {
              "key": "project_url",
              "value": "https://nfter.bid"
            },
            {
              "key": "creator",
              "value": "{creator}"
            }
          ]
        },
        "id": "0x785aea15c374a2eb11c18fe4fc6993a958b2440d4a03a51a57ab095a6bf96a1d",
        "version": 1
      },
      "bcsEncoding": "base64",
      "bcs": "eFrqFcN0ousRwY/k/GmTqViyRA1KA6UaV6sJWmv5ah0BAAkEbmFtZQZ7bmFtZX0LZGVzY3JpcHRpb24Ne2Rlc2NyaXB0aW9ufQttaW50X251bWJlcg17bWludF9udW1iZXJ9CWltYWdlX3VybChodHRwczovL3dhbHJ1cy54eXovYmxvYi97d2FscnVzX2Jsb2JfaWR9EWdlbmVyYXRpb25fcHJvbXB0E3tnZW5lcmF0aW9uX3Byb21wdH0NbW9kZWxfdmVyc2lvbg97bW9kZWxfdmVyc2lvbn0KY3JlYXRlZF9hdAx7Y3JlYXRlZF9hdH0LcHJvamVjdF91cmwRaHR0cHM6Ly9uZnRlci5iaWQHY3JlYXRvcgl7Y3JlYXRvcn0="
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
      "version": "8",
      "previousVersion": "7",
      "digest": "BBh86hRpPJvG9gDNj1HETNcj35mpguFVWnFK1YqacQbV"
    },
    {
      "type": "created",
      "sender": "0xb77e64fd104aa3567129d7ead47c10286847c936e1932f36319337ae2c241f4b",
      "owner": {
        "AddressOwner": "0xb77e64fd104aa3567129d7ead47c10286847c936e1932f36319337ae2c241f4b"
      },
      "objectType": "0x2::display::Display<0xa2b8e53fe9cb35875d71d951ead8ac3c1b3c28e7b97e2994da4accd2b81ef7f0::nfter::OffbrandNFT>",
      "objectId": "0x785aea15c374a2eb11c18fe4fc6993a958b2440d4a03a51a57ab095a6bf96a1d",
      "version": "8",
      "digest": "HNtxk3ab86buzdL8bSvdCeX1bGXDjPzpLHiwxZAK3MyC"
    },
    {
      "type": "published",
      "packageId": "0xa2b8e53fe9cb35875d71d951ead8ac3c1b3c28e7b97e2994da4accd2b81ef7f0",
      "version": "1",
      "digest": "BFC9DEoMnAceGk2cXB8EPqmDPwuzcHC4taazvvFkJUuW",
      "modules": [
        "nfter",
        "royalty_rule"
      ]
    },
    {
      "type": "created",
      "sender": "0xb77e64fd104aa3567129d7ead47c10286847c936e1932f36319337ae2c241f4b",
      "owner": {
        "AddressOwner": "0xb77e64fd104aa3567129d7ead47c10286847c936e1932f36319337ae2c241f4b"
      },
      "objectType": "0x2::package::UpgradeCap",
      "objectId": "0xb3e25756baf4bb99af4008385462090a693467f9c4fdcb9fb86490606ee36888",
      "version": "8",
      "digest": "ALQLFwpnbje73BMGQbSoK2DjubXs6cRQ4Y8B9GXtu2UW"
    },
    {
      "type": "created",
      "sender": "0xb77e64fd104aa3567129d7ead47c10286847c936e1932f36319337ae2c241f4b",
      "owner": {
        "AddressOwner": "0xb77e64fd104aa3567129d7ead47c10286847c936e1932f36319337ae2c241f4b"
      },
      "objectType": "0x2::package::Publisher",
      "objectId": "0xe8d8543ed68047755369a515a425eed78589d6aa3f9d915d76df99c420501a08",
      "version": "8",
      "digest": "GmdodcqqQ5UEaCgY79jm5GFNnMccGqrCESqVfq81aL1P"
    }
  ],
  "balanceChanges": [
    {
      "owner": {
        "AddressOwner": "0xb77e64fd104aa3567129d7ead47c10286847c936e1932f36319337ae2c241f4b"
      },
      "coinType": "0x2::sui::SUI",
      "amount": "-44565480"
    }
  ],
  "timestampMs": "1747706006289",
  "confirmedLocalExecution": true,
  "checkpoint": "157367"
} ```



**STEP 3**

````

sui client call \
 --package 0xa2b8e53fe9cb35875d71d951ead8ac3c1b3c28e7b97e2994da4accd2b81ef7f0 \
 --module nfter \
 --function create_nft_transfer_policy \
 --args 0xe8d8543ed68047755369a515a425eed78589d6aa3f9d915d76df99c420501a08 \
 --gas-budget 100000000 \
 --json

```

```

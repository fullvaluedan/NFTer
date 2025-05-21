**COMPILE**

```
(.env) hosermage@LAPTOP-1RPE37PF:~/projects/NFTer/move$ sui move build
[note] Dependencies on Bridge, MoveStdlib, Sui, and SuiSystem are automatically added, but this feature is disabled for your package because you have explicitly included dependencies on Sui. Consider removing these dependencies from Move.toml.
UPDATING GIT DEPENDENCY https://github.com/MystenLabs/sui.git
remote: Enumerating objects: 277, done.
remote: Counting objects: 100% (194/194), done.
remote: Compressing objects: 100% (72/72), done.
remote: Total 277 (delta 101), reused 174 (delta 99), pack-reused 83 (from 2)
Receiving objects: 100% (277/277), 792.86 KiB | 1018.00 KiB/s, done.
Resolving deltas: 100% (101/101), completed with 85 local objects.
From https://github.com/MystenLabs/sui
 + 7ad7a9f516...f976b1c0ad gh-pages                         -> origin/gh-pages  (forced update)
   49b2fe4f51..fe3a1d76b5  main                             -> origin/main
 * [new tag]               sui_v1.49.1_1747718361_release   -> sui_v1.49.1_1747718361_release
 * [new tag]               sui_v1.50.0_1747707175_ci        -> sui_v1.50.0_1747707175_ci
 * [new tag]               sui_v1.50.0_1747721236_rel_notes -> sui_v1.50.0_1747721236_rel_notes
INCLUDING DEPENDENCY Sui
INCLUDING DEPENDENCY MoveStdlib
BUILDING nfter
Total number of linter warnings suppressed: 1 (unique lints: 1)
(.env) hosermage@LAPTOP-1RPE37PF:~/projects/NFTer/move$
```

**PUBLISH**

```
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
  "digest": "8iVbpWeeC7wygZFAyRZS3ipQv738Zr8N9MAbwzbKyqVf",
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
            "version": 8,
            "digest": "BBh86hRpPJvG9gDNj1HETNcj35mpguFVWnFK1YqacQbV"
          }
        ],
        "owner": "0xb77e64fd104aa3567129d7ead47c10286847c936e1932f36319337ae2c241f4b",
        "price": "1000",
        "budget": "500000000"
      }
    },
    "txSignatures": [
      "ADjiN+j+ACWlqEBvPJZO4C3Tix1kI8pNoU1ZGRfZse7odPhmnn09PWIIW5Xx9fPKlF3cr7Fzp7yVWTj27MaU8Aku26jlImoB/SXaoY0glMhyVcPdZ/d3E0BYzKKZjPmmcw=="
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
      "storageCost": "45235200",
      "storageRebate": "978120",
      "nonRefundableStorageFee": "9880"
    },
    "modifiedAtVersions": [
      {
        "objectId": "0x2e11ac57aca575d0eabc82aa2e6220ffa1ff7a3cbb806b0c638252eedebaa8a8",
        "sequenceNumber": "8"
      }
    ],
    "transactionDigest": "8iVbpWeeC7wygZFAyRZS3ipQv738Zr8N9MAbwzbKyqVf",
    "created": [
      {
        "owner": {
          "AddressOwner": "0xb77e64fd104aa3567129d7ead47c10286847c936e1932f36319337ae2c241f4b"
        },
        "reference": {
          "objectId": "0x700786a60ee4ced5b9f05c5f92496e7db18e0c5c8e407be62cc29277a4a22a01",
          "version": 9,
          "digest": "HXrd2V4smX6B9ASLVwkAnDPtjpjzy2tZukNmjMZLsj3W"
        }
      },
      {
        "owner": {
          "AddressOwner": "0xb77e64fd104aa3567129d7ead47c10286847c936e1932f36319337ae2c241f4b"
        },
        "reference": {
          "objectId": "0xa33a32e8076c2bc0b8b160551cedcbb30203b43bf8371a5ac20774fa03215aab",
          "version": 9,
          "digest": "76paWU85duoEgqjDpaeujVjEdt6TdnfBr9o5cnQuuVqL"
        }
      },
      {
        "owner": {
          "AddressOwner": "0xb77e64fd104aa3567129d7ead47c10286847c936e1932f36319337ae2c241f4b"
        },
        "reference": {
          "objectId": "0xa806da42d02637dcd86c726f7d3e54e18e23be4a201f2f9acc62400fa69f1a75",
          "version": 9,
          "digest": "21qGKyCDFr61jsBcV5iVV8PUUR9as7N5JasjCoGMKk1N"
        }
      },
      {
        "owner": "Immutable",
        "reference": {
          "objectId": "0xcdce2521d91f31676afe199f5a28755289740dd6d73bf40e74b2eed4fa09805f",
          "version": 1,
          "digest": "AxsoiqQFjEMdxTBEbGZKXCFwPpUGgwDt2HCjJCYNKQS7"
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
          "version": 9,
          "digest": "HqtBEP5ausi3ns32T6jxfc6yymvwXiq6AtRsBVKPrjyC"
        }
      }
    ],
    "gasObject": {
      "owner": {
        "AddressOwner": "0xb77e64fd104aa3567129d7ead47c10286847c936e1932f36319337ae2c241f4b"
      },
      "reference": {
        "objectId": "0x2e11ac57aca575d0eabc82aa2e6220ffa1ff7a3cbb806b0c638252eedebaa8a8",
        "version": 9,
        "digest": "HqtBEP5ausi3ns32T6jxfc6yymvwXiq6AtRsBVKPrjyC"
      }
    },
    "eventsDigest": "3DB7XAfnDJjMdSX5Bj1drzLagYca4ULxaEv3jFaqjXGw",
    "dependencies": [
      "8R8b9M3qBMHDwQDHRkaVUYNXwiJcndwbpmXtpdRUAF79",
      "Ac1osjpCMkYmmdZy6Vf94riZzZTJJBUWdeHNhwN5VCHj"
    ]
  },
  "events": [
    {
      "id": {
        "txDigest": "8iVbpWeeC7wygZFAyRZS3ipQv738Zr8N9MAbwzbKyqVf",
        "eventSeq": "0"
      },
      "packageId": "0xcdce2521d91f31676afe199f5a28755289740dd6d73bf40e74b2eed4fa09805f",
      "transactionModule": "nfter",
      "sender": "0xb77e64fd104aa3567129d7ead47c10286847c936e1932f36319337ae2c241f4b",
      "type": "0x2::display::DisplayCreated<0xcdce2521d91f31676afe199f5a28755289740dd6d73bf40e74b2eed4fa09805f::nfter::OffbrandNFT>",
      "parsedJson": {
        "id": "0xa33a32e8076c2bc0b8b160551cedcbb30203b43bf8371a5ac20774fa03215aab"
      },
      "bcsEncoding": "base64",
      "bcs": "ozoy6AdsK8C4sWBVHO3LswIDtDv4Nxpawgd0+gMhWqs="
    },
    {
      "id": {
        "txDigest": "8iVbpWeeC7wygZFAyRZS3ipQv738Zr8N9MAbwzbKyqVf",
        "eventSeq": "1"
      },
      "packageId": "0xcdce2521d91f31676afe199f5a28755289740dd6d73bf40e74b2eed4fa09805f",
      "transactionModule": "nfter",
      "sender": "0xb77e64fd104aa3567129d7ead47c10286847c936e1932f36319337ae2c241f4b",
      "type": "0x2::display::VersionUpdated<0xcdce2521d91f31676afe199f5a28755289740dd6d73bf40e74b2eed4fa09805f::nfter::OffbrandNFT>",
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
        "id": "0xa33a32e8076c2bc0b8b160551cedcbb30203b43bf8371a5ac20774fa03215aab",
        "version": 1
      },
      "bcsEncoding": "base64",
      "bcs": "ozoy6AdsK8C4sWBVHO3LswIDtDv4Nxpawgd0+gMhWqsBAAkEbmFtZQZ7bmFtZX0LZGVzY3JpcHRpb24Ne2Rlc2NyaXB0aW9ufQttaW50X251bWJlcg17bWludF9udW1iZXJ9CWltYWdlX3VybChodHRwczovL3dhbHJ1cy54eXovYmxvYi97d2FscnVzX2Jsb2JfaWR9EWdlbmVyYXRpb25fcHJvbXB0E3tnZW5lcmF0aW9uX3Byb21wdH0NbW9kZWxfdmVyc2lvbg97bW9kZWxfdmVyc2lvbn0KY3JlYXRlZF9hdAx7Y3JlYXRlZF9hdH0LcHJvamVjdF91cmwRaHR0cHM6Ly9uZnRlci5iaWQHY3JlYXRvcgl7Y3JlYXRvcn0="
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
      "version": "9",
      "previousVersion": "8",
      "digest": "HqtBEP5ausi3ns32T6jxfc6yymvwXiq6AtRsBVKPrjyC"
    },
    {
      "type": "created",
      "sender": "0xb77e64fd104aa3567129d7ead47c10286847c936e1932f36319337ae2c241f4b",
      "owner": {
        "AddressOwner": "0xb77e64fd104aa3567129d7ead47c10286847c936e1932f36319337ae2c241f4b"
      },
      "objectType": "0x2::package::Publisher",
      "objectId": "0x700786a60ee4ced5b9f05c5f92496e7db18e0c5c8e407be62cc29277a4a22a01",
      "version": "9",
      "digest": "HXrd2V4smX6B9ASLVwkAnDPtjpjzy2tZukNmjMZLsj3W"
    },
    {
      "type": "created",
      "sender": "0xb77e64fd104aa3567129d7ead47c10286847c936e1932f36319337ae2c241f4b",
      "owner": {
        "AddressOwner": "0xb77e64fd104aa3567129d7ead47c10286847c936e1932f36319337ae2c241f4b"
      },
      "objectType": "0x2::display::Display<0xcdce2521d91f31676afe199f5a28755289740dd6d73bf40e74b2eed4fa09805f::nfter::OffbrandNFT>",
      "objectId": "0xa33a32e8076c2bc0b8b160551cedcbb30203b43bf8371a5ac20774fa03215aab",
      "version": "9",
      "digest": "76paWU85duoEgqjDpaeujVjEdt6TdnfBr9o5cnQuuVqL"
    },
    {
      "type": "created",
      "sender": "0xb77e64fd104aa3567129d7ead47c10286847c936e1932f36319337ae2c241f4b",
      "owner": {
        "AddressOwner": "0xb77e64fd104aa3567129d7ead47c10286847c936e1932f36319337ae2c241f4b"
      },
      "objectType": "0x2::package::UpgradeCap",
      "objectId": "0xa806da42d02637dcd86c726f7d3e54e18e23be4a201f2f9acc62400fa69f1a75",
      "version": "9",
      "digest": "21qGKyCDFr61jsBcV5iVV8PUUR9as7N5JasjCoGMKk1N"
    },
    {
      "type": "published",
      "packageId": "0xcdce2521d91f31676afe199f5a28755289740dd6d73bf40e74b2eed4fa09805f",
      "version": "1",
      "digest": "AxsoiqQFjEMdxTBEbGZKXCFwPpUGgwDt2HCjJCYNKQS7",
      "modules": [
        "nfter",
        "royalty_rule"
      ]
    }
  ],
  "balanceChanges": [
    {
      "owner": {
        "AddressOwner": "0xb77e64fd104aa3567129d7ead47c10286847c936e1932f36319337ae2c241f4b"
      },
      "coinType": "0x2::sui::SUI",
      "amount": "-45257080"
    }
  ],
  "timestampMs": "1747724210978",
  "confirmedLocalExecution": true,
  "checkpoint": "244678"
}
(.env) hosermage@LAPTOP-1RPE37PF:~/projects/NFTer/move$
```

Here’s a clear explanation of what happens when you run:

```sh
sui client publish --gas-budget 500000000 --json
```

---

## What Does `sui client publish` Do?

The `publish` command uploads your Move smart contract package to the Sui blockchain, making it available for anyone to use or interact with. Here’s what happens step-by-step:

---

### 1. **Builds Your Move Package**

- The CLI compiles your Move code and its dependencies.
- It checks for errors and warnings in your code.

### 2. **Prepares the Transaction**

- The CLI creates a special transaction called a **Programmable Transaction** that contains instructions to:
  - **Publish** your package (upload the modules to the chain).
  - **Transfer** special objects (like UpgradeCap) to your address.

### 3. **Pays Gas**

- The transaction uses SUI coins from your wallet to pay for computation and storage.
- The `--gas-budget` flag sets the maximum amount of gas you’re willing to spend (in this case, 500,000,000 MIST = 0.5 SUI).

### 4. **Publishes the Package On-Chain**

- The package is stored immutably on the Sui blockchain.
- A **Package ID** is generated (e.g., `0xcdce2521d91f31676afe199f5a28755289740dd6d73bf40e74b2eed4fa09805f`).
- The modules inside your package (e.g., `nfter`, `royalty_rule`) are now available on-chain.

### 5. **Creates and Transfers Special Objects**

- **Publisher Object:** Proves you published the package.
- **UpgradeCap Object:** Lets you upgrade the package in the future (or burn it to make it immutable).
- **Display Object:** Used for NFT metadata display.
- These objects are transferred to your address.

### 6. **Outputs Transaction Results**

- You get a JSON summary with:
  - **Transaction digest:** Unique transaction ID.
  - **Created objects:** Publisher, UpgradeCap, Display, etc.
  - **Published package info:** Package ID, modules, version.
  - **Gas used and balance changes.**
  - **Events:** E.g., NFT display created, version updated.

---

### **In Short**

- **Publishes** your Move code to the Sui blockchain.
- **Creates and transfers** management objects to you.
- **Outputs** all details in JSON for easy parsing.

---

#### References:

- [Sui Move Publish Guide](https://docs.sui.io/guides/developer/first-app/publish)
- [Sui CLI Reference](https://docs.sui.io/references/cli/client)

---

Would you like to know how to interact with your published package, or how to upgrade it in the future?

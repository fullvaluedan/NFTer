(.env) hosermage@LAPTOP-1RPE37PF:~/projects/NFTer/move$ sui client publish --gas-budget 500000000 --json
[warning] Client/Server api version mismatch, client api version : 1.48.0, server api version : 1.49.0
[Note]: Dependency sources are no longer verified automatically during publication and upgrade. You can pass the `--verify-deps` option if you would like to verify them as part of publication or upgrade.
[note] Dependencies on Bridge, MoveStdlib, Sui, and SuiSystem are automatically added, but this feature is disabled for your package because you have explicitly included dependencies on Sui. Consider removing these dependencies from Move.toml.
UPDATING GIT DEPENDENCY https://github.com/MystenLabs/sui.git
remote: Enumerating objects: 234, done.
remote: Counting objects: 100% (216/216), done.
remote: Compressing objects: 100% (74/74), done.
remote: Total 234 (delta 142), reused 201 (delta 134), pack-reused 18 (from 2)
Receiving objects: 100% (234/234), 1.38 MiB | 3.32 MiB/s, done.
Resolving deltas: 100% (142/142), completed with 101 local objects.
From https://github.com/MystenLabs/sui

- [new branch] aschran/ete-limit-cp -> origin/aschran/ete-limit-cp
- [new branch] fix-prunerwatermark-waitfor -> origin/fix-prunerwatermark-waitfor

* 6d6b9eba2c...ea5cda16e2 gh-pages -> origin/gh-pages (forced update)
  f538cdd6ad..49b2fe4f51 main -> origin/main
  c596d49844..0b6ce48a99 releases/sui-v1.49.0-release -> origin/releases/sui-v1.49.0-release

- [new tag] sui_v1.50.0_1747695133_ci -> sui_v1.50.0_1747695133_ci
  INCLUDING DEPENDENCY Sui
  INCLUDING DEPENDENCY MoveStdlib
  BUILDING nfter
  Skipping dependency verification
  {
  "digest": "5Rxs471piLXrzHiDbcNqB2RTndD9pzk9CCapKKFrqN2Y",
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
  "version": 4,
  "digest": "6x2NFmEjT77Jos6yQdcGQYzmKHvfsYwfXzbdwsKghstk"
  }
  ],
  "owner": "0xb77e64fd104aa3567129d7ead47c10286847c936e1932f36319337ae2c241f4b",
  "price": "1000",
  "budget": "500000000"
  }
  },
  "txSignatures": [
  "AL7yC5+lGCfZMI4MtqmFXcZ2v0zt4VoGqOA6InAWMCOhnzxYOuuHWuDN3BMqHflXz469yxy+v7jBjLwIxJ5Omg8u26jlImoB/SXaoY0glMhyVcPdZ/d3E0BYzKKZjPmmcw=="
  ]
  },
  "effects": {
  "messageVersion": "v1",
  "status": {
  "status": "success"
  },
  "executedEpoch": "6",
  "gasUsed": {
  "computationCost": "1000000",
  "storageCost": "34245600",
  "storageRebate": "978120",
  "nonRefundableStorageFee": "9880"
  },
  "modifiedAtVersions": [
  {
  "objectId": "0x2e11ac57aca575d0eabc82aa2e6220ffa1ff7a3cbb806b0c638252eedebaa8a8",
  "sequenceNumber": "4"
  }
  ],
  "transactionDigest": "5Rxs471piLXrzHiDbcNqB2RTndD9pzk9CCapKKFrqN2Y",
  "created": [
  {
  "owner": "Immutable",
  "reference": {
  "objectId": "0x64451f3e1be302b8d08442ca3d92fc8dbdc9f145512b7a6d9258f15b15969bc6",
  "version": 1,
  "digest": "GfcC6Y3g5zRCZr678VJVtHaKBub8pSGBErz748BtkeMm"
  }
  },
  {
  "owner": {
  "AddressOwner": "0xb77e64fd104aa3567129d7ead47c10286847c936e1932f36319337ae2c241f4b"
  },
  "reference": {
  "objectId": "0x6f7611d3dee30d97634cf4f713fa409819121e6c00033cbee7ffb2cb5163fbdb",
  "version": 5,
  "digest": "7JN71EpMPQGRHXkcJssiYmS4T64P455jrop1FCRwhazY"
  }
  },
  {
  "owner": {
  "AddressOwner": "0xb77e64fd104aa3567129d7ead47c10286847c936e1932f36319337ae2c241f4b"
  },
  "reference": {
  "objectId": "0xa02f0aa3b5670f5c7bc1d7cb655a4f61e59f7f0bb095767afc46c7222eb037a6",
  "version": 5,
  "digest": "HSjYLdJjbg8XATuGdwzuXQ8tnNbPrsSMeBA5gQTruzuR"
  }
  },
  {
  "owner": {
  "AddressOwner": "0xb77e64fd104aa3567129d7ead47c10286847c936e1932f36319337ae2c241f4b"
  },
  "reference": {
  "objectId": "0xe9f25beb99d3dc62500900045779b6c85d58336a440c06895492ccd9f07f8fc0",
  "version": 5,
  "digest": "7fpF5pqvH2cwc9ryiywgaEKDfL95PD62nqEQ3D3TzjxP"
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
  "version": 5,
  "digest": "9ay5pwAWAe6nuLUwD7yt1GHv5P3mD2QdyZfwdF7Ub3oQ"
  }
  }
  ],
  "gasObject": {
  "owner": {
  "AddressOwner": "0xb77e64fd104aa3567129d7ead47c10286847c936e1932f36319337ae2c241f4b"
  },
  "reference": {
  "objectId": "0x2e11ac57aca575d0eabc82aa2e6220ffa1ff7a3cbb806b0c638252eedebaa8a8",
  "version": 5,
  "digest": "9ay5pwAWAe6nuLUwD7yt1GHv5P3mD2QdyZfwdF7Ub3oQ"
  }
  },
  "eventsDigest": "424fyR81t6tWRahhzbjifWDfwpqY7Q2QECWSrBQPmvco",
  "dependencies": [
  "Ac1osjpCMkYmmdZy6Vf94riZzZTJJBUWdeHNhwN5VCHj",
  "FaAsoEBPqCwmJLYc4pjpcFRudPLzaNZWGcKqqvWy9uLa"
  ]
  },
  "events": [
  {
  "id": {
  "txDigest": "5Rxs471piLXrzHiDbcNqB2RTndD9pzk9CCapKKFrqN2Y",
  "eventSeq": "0"
  },
  "packageId": "0x64451f3e1be302b8d08442ca3d92fc8dbdc9f145512b7a6d9258f15b15969bc6",
  "transactionModule": "nfter",
  "sender": "0xb77e64fd104aa3567129d7ead47c10286847c936e1932f36319337ae2c241f4b",
  "type": "0x2::display::DisplayCreated<0x64451f3e1be302b8d08442ca3d92fc8dbdc9f145512b7a6d9258f15b15969bc6::nfter::OffbrandNFT>",
  "parsedJson": {
  "id": "0x6f7611d3dee30d97634cf4f713fa409819121e6c00033cbee7ffb2cb5163fbdb"
  },
  "bcsEncoding": "base64",
  "bcs": "b3YR097jDZdjTPT3E/pAmBkSHmwAAzy+5/+yy1Fj+9s="
  },
  {
  "id": {
  "txDigest": "5Rxs471piLXrzHiDbcNqB2RTndD9pzk9CCapKKFrqN2Y",
  "eventSeq": "1"
  },
  "packageId": "0x64451f3e1be302b8d08442ca3d92fc8dbdc9f145512b7a6d9258f15b15969bc6",
  "transactionModule": "nfter",
  "sender": "0xb77e64fd104aa3567129d7ead47c10286847c936e1932f36319337ae2c241f4b",
  "type": "0x2::display::VersionUpdated<0x64451f3e1be302b8d08442ca3d92fc8dbdc9f145512b7a6d9258f15b15969bc6::nfter::OffbrandNFT>",
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
  "value": "https://nfter.xyz"
  },
  {
  "key": "creator",
  "value": "{creator}"
  }
  ]
  },
  "id": "0x6f7611d3dee30d97634cf4f713fa409819121e6c00033cbee7ffb2cb5163fbdb",
  "version": 1
  },
  "bcsEncoding": "base64",
  "bcs": "b3YR097jDZdjTPT3E/pAmBkSHmwAAzy+5/+yy1Fj+9sBAAkEbmFtZQZ7bmFtZX0LZGVzY3JpcHRpb24Ne2Rlc2NyaXB0aW9ufQttaW50X251bWJlcg17bWludF9udW1iZXJ9CWltYWdlX3VybChodHRwczovL3dhbHJ1cy54eXovYmxvYi97d2FscnVzX2Jsb2JfaWR9EWdlbmVyYXRpb25fcHJvbXB0E3tnZW5lcmF0aW9uX3Byb21wdH0NbW9kZWxfdmVyc2lvbg97bW9kZWxfdmVyc2lvbn0KY3JlYXRlZF9hdAx7Y3JlYXRlZF9hdH0LcHJvamVjdF91cmwRaHR0cHM6Ly9uZnRlci54eXoHY3JlYXRvcgl7Y3JlYXRvcn0="
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
  "version": "5",
  "previousVersion": "4",
  "digest": "9ay5pwAWAe6nuLUwD7yt1GHv5P3mD2QdyZfwdF7Ub3oQ"
  },
  {
  "type": "published",
  "packageId": "0x64451f3e1be302b8d08442ca3d92fc8dbdc9f145512b7a6d9258f15b15969bc6",
  "version": "1",
  "digest": "GfcC6Y3g5zRCZr678VJVtHaKBub8pSGBErz748BtkeMm",
  "modules": [
  "nfter"
  ]
  },
  {
  "type": "created",
  "sender": "0xb77e64fd104aa3567129d7ead47c10286847c936e1932f36319337ae2c241f4b",
  "owner": {
  "AddressOwner": "0xb77e64fd104aa3567129d7ead47c10286847c936e1932f36319337ae2c241f4b"
  },
  "objectType": "0x2::display::Display<0x64451f3e1be302b8d08442ca3d92fc8dbdc9f145512b7a6d9258f15b15969bc6::nfter::OffbrandNFT>",
  "objectId": "0x6f7611d3dee30d97634cf4f713fa409819121e6c00033cbee7ffb2cb5163fbdb",
  "version": "5",
  "digest": "7JN71EpMPQGRHXkcJssiYmS4T64P455jrop1FCRwhazY"
  },
  {
  "type": "created",
  "sender": "0xb77e64fd104aa3567129d7ead47c10286847c936e1932f36319337ae2c241f4b",
  "owner": {
  "AddressOwner": "0xb77e64fd104aa3567129d7ead47c10286847c936e1932f36319337ae2c241f4b"
  },
  "objectType": "0x2::package::Publisher",
  "objectId": "0xa02f0aa3b5670f5c7bc1d7cb655a4f61e59f7f0bb095767afc46c7222eb037a6",
  "version": "5",
  "digest": "HSjYLdJjbg8XATuGdwzuXQ8tnNbPrsSMeBA5gQTruzuR"
  },
  {
  "type": "created",
  "sender": "0xb77e64fd104aa3567129d7ead47c10286847c936e1932f36319337ae2c241f4b",
  "owner": {
  "AddressOwner": "0xb77e64fd104aa3567129d7ead47c10286847c936e1932f36319337ae2c241f4b"
  },
  "objectType": "0x2::package::UpgradeCap",
  "objectId": "0xe9f25beb99d3dc62500900045779b6c85d58336a440c06895492ccd9f07f8fc0",
  "version": "5",
  "digest": "7fpF5pqvH2cwc9ryiywgaEKDfL95PD62nqEQ3D3TzjxP"
  }
  ],
  "balanceChanges": [
  {
  "owner": {
  "AddressOwner": "0xb77e64fd104aa3567129d7ead47c10286847c936e1932f36319337ae2c241f4b"
  },
  "coinType": "0x2::sui::SUI",
  "amount": "-34267480"
  }
  ],
  "timestampMs": "1747697327939",
  "confirmedLocalExecution": true,
  "checkpoint": "115736"
  }
  (.env) hosermage@LAPTOP-1RPE37PF:~/projects/NFTer/move$

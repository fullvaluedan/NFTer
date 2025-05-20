(.env) hosermage@LAPTOP-1RPE37PF:~/projects/NFTer/move$ sui client call --package 0x64451f3e1be302b8d08442ca3d92fc8dbdc9f145512b7a6d9258f15b15969bc6 --module nfter --function init_collection \
 --args "Offbrand Crypto" "The official collection of Offbrand Crypto NFTs, uniquely generated and ready for the 8-Bit Oracle." 100000000 10000000 \
 --gas-budget 100000000 --json
[warning] Client/Server api version mismatch, client api version : 1.48.0, server api version : 1.49.0
{
"digest": "HEHrntCsaaPjNvm5BwfXRTgEdu5oMiDs5CEPiVVF4W3q",
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
}
],
"transactions": [
{
"MoveCall": {
"package": "0x64451f3e1be302b8d08442ca3d92fc8dbdc9f145512b7a6d9258f15b15969bc6",
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
"version": 5,
"digest": "9ay5pwAWAe6nuLUwD7yt1GHv5P3mD2QdyZfwdF7Ub3oQ"
}
],
"owner": "0xb77e64fd104aa3567129d7ead47c10286847c936e1932f36319337ae2c241f4b",
"price": "1000",
"budget": "100000000"
}
},
"txSignatures": [
"AH2U4LBBrpzv7+HL5nJd49W47w549zR5rjwyr6cMHY6GabPKufHjGw06GuTmNWIXzd/CPic9NhOqZ7ByOepdIwMu26jlImoB/SXaoY0glMhyVcPdZ/d3E0BYzKKZjPmmcw=="
]
},
"effects": {
"messageVersion": "v1",
"status": {
"status": "success"
},
"executedEpoch": "7",
"gasUsed": {
"computationCost": "1000000",
"storageCost": "3663200",
"storageRebate": "978120",
"nonRefundableStorageFee": "9880"
},
"modifiedAtVersions": [
{
"objectId": "0x2e11ac57aca575d0eabc82aa2e6220ffa1ff7a3cbb806b0c638252eedebaa8a8",
"sequenceNumber": "5"
}
],
"transactionDigest": "HEHrntCsaaPjNvm5BwfXRTgEdu5oMiDs5CEPiVVF4W3q",
"created": [
{
"owner": {
"AddressOwner": "0xb77e64fd104aa3567129d7ead47c10286847c936e1932f36319337ae2c241f4b"
},
"reference": {
"objectId": "0x3a479578bde93f54d90aee8be9cf88fefc00f4b1f251c54f863b8f9bd44121c8",
"version": 6,
"digest": "p4XbgKERv5ZpY2LR3eB62NANXi7jodc8tB1V2wbWXmV"
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
"version": 6,
"digest": "EiF97tjwuKN71n8buwkR1bwXN3PD8MGz4SQo5mmRazEZ"
}
}
],
"gasObject": {
"owner": {
"AddressOwner": "0xb77e64fd104aa3567129d7ead47c10286847c936e1932f36319337ae2c241f4b"
},
"reference": {
"objectId": "0x2e11ac57aca575d0eabc82aa2e6220ffa1ff7a3cbb806b0c638252eedebaa8a8",
"version": 6,
"digest": "EiF97tjwuKN71n8buwkR1bwXN3PD8MGz4SQo5mmRazEZ"
}
},
"dependencies": [
"5Rxs471piLXrzHiDbcNqB2RTndD9pzk9CCapKKFrqN2Y"
]
},
"events": [],
"objectChanges": [
{
"type": "mutated",
"sender": "0xb77e64fd104aa3567129d7ead47c10286847c936e1932f36319337ae2c241f4b",
"owner": {
"AddressOwner": "0xb77e64fd104aa3567129d7ead47c10286847c936e1932f36319337ae2c241f4b"
},
"objectType": "0x2::coin::Coin<0x2::sui::SUI>",
"objectId": "0x2e11ac57aca575d0eabc82aa2e6220ffa1ff7a3cbb806b0c638252eedebaa8a8",
"version": "6",
"previousVersion": "5",
"digest": "EiF97tjwuKN71n8buwkR1bwXN3PD8MGz4SQo5mmRazEZ"
},
{
"type": "created",
"sender": "0xb77e64fd104aa3567129d7ead47c10286847c936e1932f36319337ae2c241f4b",
"owner": {
"AddressOwner": "0xb77e64fd104aa3567129d7ead47c10286847c936e1932f36319337ae2c241f4b"
},
"objectType": "0x64451f3e1be302b8d08442ca3d92fc8dbdc9f145512b7a6d9258f15b15969bc6::nfter::OffbrandCollection",
"objectId": "0x3a479578bde93f54d90aee8be9cf88fefc00f4b1f251c54f863b8f9bd44121c8",
"version": "6",
"digest": "p4XbgKERv5ZpY2LR3eB62NANXi7jodc8tB1V2wbWXmV"
}
],
"balanceChanges": [
{
"owner": {
"AddressOwner": "0xb77e64fd104aa3567129d7ead47c10286847c936e1932f36319337ae2c241f4b"
},
"coinType": "0x2::sui::SUI",
"amount": "-3685080"
}
],
"timestampMs": "1747699653885",
"confirmedLocalExecution": true,
"checkpoint": "126894"
}
(.env) hosermage@LAPTOP-1RPE37PF:~/projects/NFTer/move$

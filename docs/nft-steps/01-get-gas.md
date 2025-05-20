**CONFIRM ENVIRONMENT**

```
(.env) hosermage@LAPTOP-1RPE37PF:~/projects/NFTer/move$ sui client envs
[warning] Client/Server api version mismatch, client api version : 1.48.0, server api version : 1.49.0
╭─────────┬─────────────────────────────────────┬────────╮
│ alias   │ url                                 │ active │
├─────────┼─────────────────────────────────────┼────────┤
│ testnet │ https://fullnode.testnet.sui.io:443 │        │
│ devnet  │ https://fullnode.devnet.sui.io:443  │ *      │
╰─────────┴─────────────────────────────────────┴────────╯
```

**GET GAS**

```
(.env) hosermage@LAPTOP-1RPE37PF:~/projects/NFTer/move$ curl --location --request POST 'https://faucet.devnet.sui.io/v2/gas' --header 'Content-Type: application/json' --data-raw '{"FixedAmountRequest":{
"recipient":"0xb77e64fd104aa3567129d7ead47c10286847c936e1932f36319337ae2c241f4b"}}'
{"status":"Success","coins_sent":[{"amount":10000000000,"id":"0x2e11ac57aca575d0eabc82aa2e6220ffa1ff7a3cbb806b0c638252eedebaa8a8","transferTxDigest":"FaAsoEBPqCwmJLYc4pjpcFRudPLzaNZWGcKqqvWy9uLa"}]}(.env) hosermage@LAPTOP-1RPE37PF:~/projects/NFTer/move$ sui client gas
[warning] Client/Server api version mismatch, client api version : 1.48.0, server api version : 1.49.0
╭────────────────────────────────────────────────────────────────────┬────────────────────┬──────────────────╮
│ gasCoinId │ mistBalance (MIST) │ suiBalance (SUI) │
├────────────────────────────────────────────────────────────────────┼────────────────────┼──────────────────┤
│ 0x2e11ac57aca575d0eabc82aa2e6220ffa1ff7a3cbb806b0c638252eedebaa8a8 │ 10000000000 │ 10.00 │
╰────────────────────────────────────────────────────────────────────┴────────────────────┴──────────────────╯
```

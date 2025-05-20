<p align="center"\>
  <img src="nfter-next/public/offbrand.png" alt="Offbrand Crypto Logo" width="300"/\>
</p\>

# NFTer - Anime Character Generator & NFT Platform

Transform your photos into anime characters and mint them as NFTs on Sui. This monorepo includes a Next.js frontend (with Vercel Edge endpoints) and Sui Move smart contracts.

---

Built in collaboration with **[augustinchan.dev](https://augustinchan.dev)**, creator of **[8bitoracle.ai](https://8bitoracle.ai)**.

---

Upload your photo and transform it into an anime character:

Choose from various Naruto-style roles:

```
Civilian Villager
Young Genin
Chūnin
Elite Jōnin
Rogue Ninja
Akatsuki Member
Anbu Black Ops
Hidden Leaf Teacher
Hokage
```

Get a power score based on your character's role
Modern, responsive UI with real-time feedback

---

## Project Structure

```
NFTer/
├── nfter-next/         # Next.js frontend (React, Vercel Edge)
├── move/               # Sui Move contracts
├── docs/
│   └── nft-steps/      # Deployment scripts (setup_sui_nft.sh)
└── README.md
```

---

## Prerequisites

- Node.js 18+ and pnpm (for frontend)
- [Rust & Cargo](https://www.rust-lang.org/tools/install) (for Sui CLI)
- Sui testnet account with SUI tokens
- jq (for shell scripts)
- [Sui CLI via Cargo](https://docs.sui.io/guides/developer/getting-started/sui-install)

---

## Sui CLI Installation (Testnet v1.49+)

Install Sui CLI for testnet using Cargo:

```bash
cargo install --locked --git https://github.com/MystenLabs/sui.git --branch testnet sui
export PATH="$HOME/.cargo/bin:$PATH"
sui --version
# Should output: sui testnet-v1.49.0-...
```

[Full install guide](https://docs.sui.io/guides/developer/getting-started/sui-install)

---

## Environment Variables

Create a `.env.local` file in the `nfter-next` directory:

```
REPLICATE_API_TOKEN=your_replicate_token
NEXT_PUBLIC_PACKAGE_ID=
NEXT_PUBLIC_COLLECTION_ID=
```

- `REPLICATE_API_TOKEN`: For AI image generation.
- `NEXT_PUBLIC_PACKAGE_ID` and `NEXT_PUBLIC_COLLECTION_ID`: Populated after running the setup script below.

---

## Deploying Contracts & Initializing Collection

1.  **Build contracts (optional, script does this):**

`bash    cd move    sui move build    `

2.  **Run the setup script:**

`bash    cd docs/nft-steps    ./setup_sui_nft.sh    `

This will:

- Publish the Move package to testnet
     - Initialize the NFT collection
     - Set up royalty rules

At the end, you'll see output like:

`    --- All done! ---    Summary of deployed assets:      Package ID:         0x...      Collection ID:      0x...    `

Copy these IDs into your `.env.local`.

---

## Running the Frontend

```bash
cd nfter-next
pnpm install
pnpm dev
# Visit http://localhost:3000
```

---

## Minting NFTs (CLI Testing)

To mint an NFT via CLI, use the following (replace values as needed):

```bash
sui client call \
  --package <PACKAGE_ID> \
  --module nfter \
  --function mint_nft \
  --args \
    <COLLECTION_ID> \
    "NFT description" \
    "https://aggregator.walrus-testnet.walrus.space/v1/blobs/<WALRUS_BLOB_ID>" \
    '["0xYOUR_ADDRESS"]' \
    '[100]' \
    "Base prompt" \
    "Style prompt" \
    "<WALRUS_BLOB_ID>" \
    "Generation prompt" \
    "sdxl-v1.0" \
    "{}" \
    '["Role","Model Version"]' \
    '["<ROLE>","sdxl-v1.0"]' \
    <PAYMENT_COIN_OBJECT_ID> \
  --gas-budget 200000000
```

- Use `sui client gas` to find a suitable coin object for `<PAYMENT_COIN_OBJECT_ID>`.
- The image URL must match the format used in the frontend:  
    `https://aggregator.walrus-testnet.walrus.space/v1/blobs/<WALRUS_BLOB_ID>`

---

## Frontend Minting Logic

- The frontend constructs the image URL and passes all required fields to the Move contract.
- Royalty recipient is set to the minter's address, with 100% of a 5% royalty(for demo).
- Attributes include `"Role"` and `"Model Version"`.

---

## References

- [Sui Install Guide](https://docs.sui.io/guides/developer/getting-started/sui-install)
- [Move Contract Source](https://www.google.com/search?q=move/sources/nfter.move)
- [MintNFT Component](https://www.google.com/search?q=nfter-next/src/components/MintNFT.tsx)
- [Walrus Integration](https://www.google.com/search?q=nfter-next/src/lib/walrus.ts)

---

## Summary

- Use Cargo to install Sui CLI for testnet.
- Use the provided setup script to deploy and initialize your collection.
- Use the CLI or frontend to mint NFTs, following the parameter structure above.
- All environment variables and IDs are managed in `nfter-next/.env.local`.

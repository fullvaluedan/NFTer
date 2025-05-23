# NFTer - Anime Character Generator & NFT Platform

Transform your photos into anime characters and mint them as NFTs on Sui. This monorepo includes a Next.js frontend (with Vercel Edge endpoints) and Sui Move smart contracts.

<p align="center">
  <img src="nfter-next/public/offbrand.png" alt="Offbrand Crypto Logo" width="300" />
</p>

**TESTNET**

PACKAGE_ID=0xf623d44db431f73308e982048eefb8ac6e53ccbd9fa772451fa91c372107cfef
COLLECTION_ID=0xcc12d8f4e0c55efff2ca7b230e75230c6be3bc1a32fcecda1b07e9ed94942254

## Features

- 🎨 Transform photos into anime characters using AI
- 🎮 Choose from various Naruto-style roles:
  - Civilian Villager
  - Young Genin
  - Chūnin
  - Elite Jōnin
  - Rogue Ninja
  - Akatsuki Member
  - Anbu Black Ops
  - Hidden Leaf Teacher
  - Hokage
- 💪 Get a power score based on your character's role
- 🎯 Modern, responsive UI with real-time feedback
- 🖼️ Mint your creations as NFTs on Sui blockchain
- 💰 Set up royalties for your NFT creations

## Project Structure

```text
NFTer/
├── nfter-next/        # Next.js frontend (React, Vercel Edge)
├── move/              # Sui Move contracts
├── docs/
│   └── nft-steps/     # Deployment scripts (setup_sui_nft.sh)
└── README.md
```

## Quick Start

1. **Install Dependencies**

   ```bash
   # Install Node.js 18+ and pnpm
   # Install Rust & Cargo
   # Install Sui CLI
   cargo install --locked --git https://github.com/MystenLabs/sui.git --branch testnet sui
   export PATH="$HOME/.cargo/bin:$PATH"
   ```

2. **Set Up Environment**

   ```bash
   # Create .env.local in nfter-next/
   REPLICATE_API_TOKEN=your_replicate_token
   NEXT_PUBLIC_PACKAGE_ID=
   NEXT_PUBLIC_COLLECTION_ID=
   ```

3. **Deploy Contracts**

   ```bash
   cd docs/nft-steps
   ./setup_sui_nft.sh
   # Copy the Package ID and Collection ID to .env.local
   ```

4. **Run Frontend**
   ```bash
   cd nfter-next
   pnpm install
   pnpm dev
   # Visit http://localhost:3000
   ```

## Prerequisites

- Node.js 18+ and pnpm
- [Rust & Cargo](https://www.rust-lang.org/tools/install)
- Sui testnet account with SUI tokens
- jq (for shell scripts)
- [Sui CLI](https://docs.sui.io/guides/developer/getting-started/sui-install)

## Detailed Setup

### Sui CLI Installation

Install Sui CLI for testnet using Cargo:

```bash
cargo install --locked --git https://github.com/MystenLabs/sui.git --branch testnet sui
export PATH="$HOME/.cargo/bin:$PATH"
sui --version
# Should output: sui testnet-v1.49.0-...
```

### Environment Variables

Create a `.env.local` file in the `nfter-next` directory with:

```env
REPLICATE_API_TOKEN=your_replicate_token
NEXT_PUBLIC_PACKAGE_ID=
NEXT_PUBLIC_COLLECTION_ID=
```

- `REPLICATE_API_TOKEN`: Required for AI image generation
- `NEXT_PUBLIC_PACKAGE_ID` and `NEXT_PUBLIC_COLLECTION_ID`: Populated after running the setup script

### Deploying Contracts

1. **Build contracts (optional, script does this):**

   ```bash
   cd move
   sui move build
   ```

2. **Run the setup script:**
   ```bash
   cd docs/nft-steps
   ./setup_sui_nft.sh
   ```

The script will:

- Publish the Move package to testnet
- Initialize the NFT collection
- Set up royalty rules

You'll see output like:

```text
--- All done! ---
Summary of deployed assets:
  Package ID:          0x...
  Collection ID:       0x...
```

Copy these IDs into your `.env.local`.

## Minting NFTs

### Via Frontend

1. Upload your photo
2. Choose your character role
3. Generate the anime character
4. Mint as NFT

### Via CLI (Testing)

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

Notes:

- Use `sui client gas` to find a suitable coin object
- Image URL must match the format: `https://aggregator.walrus-testnet.walrus.space/v1/blobs/<WALRUS_BLOB_ID>`

## Technical Details

- Frontend: Next.js with Vercel Edge endpoints
- Smart Contracts: Sui Move
- Image Generation: Replicate API
- Storage: Walrus Testnet
- Royalties: 5% (configurable)

## References

- [Sui Install Guide](https://docs.sui.io/guides/developer/getting-started/sui-install)
- [Move Contract Source](https://www.google.com/search?q=move/sources/nfter.move)
- [MintNFT Component](https://www.google.com/search?q=nfter-next/src/components/MintNFT.tsx)
- [Walrus Integration](https://www.google.com/search?q=nfter-next/src/lib/walrus.ts)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Built in collaboration with **[augustinchan.dev](https://augustinchan.dev)**, creator of **[8bitoracle.ai](https://8bitoracle.ai)**.

Feel free to submit issues and pull requests!

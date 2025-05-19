# NFT Minting Product Requirements Document

## Overview

This document outlines the requirements for implementing NFT minting functionality for the NFTer application, allowing users to mint their AI-generated anime character variations as NFTs on the Sui blockchain.

## Core Requirements

### 1. NFT Contract Requirements

- [x] Define NFT metadata structure
  - Name, description, image URL (Walrus blob)
  - Collection metadata
  - Display metadata for Sui Explorer
- [x] Implement minting functionality
  - Use Sui Move contract
  - Handle blob references
  - Implement proper ownership
- [x] Add royalty support
  - Implement royalty structure
  - Set default royalty percentage
- [x] Implement transfer capabilities
  - Use Sui's built-in transfer functionality
  - Handle ownership changes
- [x] Add collection management
  - Define collection structure
  - Implement collection metadata

### 2. Image Storage

- [x] Integrate with Walrus for image storage
  - Use Walrus blob storage
  - Handle blob references
  - Implement proper URL construction
- [x] Implement image upload process
  - Convert images to blobs
  - Upload to Walrus
  - Store blob references
- [x] Handle image metadata
  - Store image dimensions
  - Store image format
  - Store image hash
- [x] Set up CDN configuration
  - Configure Next.js for Walrus domain
  - Handle image optimization
  - Implement proper caching

### 3. Minting Process

- [x] User selects generated image variation
  - Show image preview
  - Display metadata
  - Show minting cost
- [x] User connects Sui wallet
  - Use @mysten/dapp-kit
  - Handle wallet connection
  - Show wallet details
- [x] User pays minting fee
  - Calculate gas cost
  - Show transaction preview
  - Handle payment
- [x] Contract mints NFT
  - Build transaction
  - Call mint function
  - Handle transaction
- [x] User receives NFT in wallet
  - Show success message
  - Display NFT preview
  - Show transaction details

### 4. Technical Requirements

- [x] Sui Move contract development
  - Use Sui Move SDK
  - Implement proper structs
  - Handle metadata
- [x] Frontend integration
  - Use @mysten/dapp-kit
  - Implement transaction building
  - Handle responses
- [x] Wallet connection
  - Use ConnectButton component
  - Handle network switching
  - Show wallet details
- [x] Transaction handling
  - Build transactions
  - Sign transactions
  - Handle responses
- [x] Error handling
  - Handle failed transactions
  - Show error messages
  - Implement retry logic

## Implementation Details

### Smart Contract Structure

```move
struct NFTer has key, store {
    id: UID,
    name: String,
    description: String,
    image_url: String,
    collection: String,
    creator: address,
    royalty_percentage: u64,
}

// Display metadata for Sui Explorer
struct NFTerDisplay has drop {}

fun init(otw: NFTerDisplay, ctx: &mut TxContext) {
    let publisher = package::claim(otw, ctx);
    let mut display = display::new<NFTer>(&publisher, ctx);

    display.add(b"name", b"{name}");
    display.add(b"description", b"{description}");
    display.add(b"image_url", b"{image_url}");
    display.add(b"collection", b"{collection}");
    display.update_version();

    transfer::public_transfer(publisher, ctx.sender());
    transfer::public_transfer(display, ctx.sender());
}
```

### Frontend Integration

```typescript
function MintNFT({ onCreated }: { onCreated: (id: string) => void }) {
  const nfterPackageId = useNetworkVariable("nfterPackageId");
  const { mutate: signAndExecute } = useSignAndExecuteTransactionBlock();

  function create() {
    const txb = new TransactionBlock();
    txb.moveCall({
      target: `${nfterPackageId}::nfter::mint`,
      arguments: [
        txb.pure(name),
        txb.pure(description),
        txb.pure(imageUrl),
        txb.pure(collection),
      ],
    });

    signAndExecute(
      { transactionBlock: txb },
      { onSuccess: (tx) => onSuccess(tx) }
    );
  }
}
```

## Questions to Resolve

1. What should be the minting fee?
2. Should we implement a royalty system?
3. What metadata should be stored on-chain vs off-chain?
4. How should we handle failed transactions?
5. What should be the collection structure?

## Success Metrics

1. Successful minting rate
2. User engagement
3. Transaction success rate
4. Gas efficiency
5. User satisfaction

## Dependencies

1. Sui Move SDK
2. Walrus API access
3. @mysten/dapp-kit
4. @mysten/sui.js

# NFT Contract Design - Architecture Decision Record

## Context

We need to design a Sui Move contract for a hackathon project that:

1. Creates a single "Offbrand Crypto" collection
2. Allows users to mint custom NFTs into this collection
3. Handles basic minting fees
4. Supports future royalty integration

## Decision

We will implement a simplified Sui Move contract that focuses on:

1. Single collection management
2. User minting with fees
3. Basic NFT metadata
4. Future royalty support

## Status

Approved

## Consequences

### Positive

- Quick to implement
- User-friendly
- Simple structure
- Ready for future royalty integration

### Negative

- Limited features
- Basic royalty support
- Single collection only

## Technical Details

1. Contract Structure

```move
module nfter::nfter {
    use std::string::String;
    use sui::display;
    use sui::package;
    use sui::object::{Self, UID, ID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::balance::{Self, Balance};
    use sui::sui::SUI;
    use sui::dynamic_field as df;
    use sui::dynamic_object_field as dof;

    /// The Offbrand Crypto collection
    struct OffbrandCollection has key {
        id: UID,
        name: String,
        description: String,
        total_minted: u64,
        minting_fee: u64,
        prompt_update_fee: u64, // Fee to update the prompt
    }

    /// An Offbrand Crypto NFT
    struct OffbrandNFT has key, store {
        id: UID,
        name: String,
        description: String,
        creator: address,
        mint_number: u64,
        original_collection: String,
    }

    /// Dynamic attributes for NFTs
    struct NFTAttribute has store {
        value: String,
        last_updated: u64,
    }

    /// Prompt configuration for 8bitoracle
    struct PromptConfig has store {
        base_prompt: String,
        style_prompt: String,
        last_updated: u64,
        update_count: u64,
    }

    /// Image and generation metadata
    struct ImageMetadata has store {
        walrus_blob_id: String,      // Walrus blob ID
        image_url: String,           // Public URL for display
        generation_prompt: String,   // Exact prompt used for generation
        model_version: String,       // Model version used
        generation_params: String,   // JSON string of generation parameters
        created_at: u64,            // Timestamp of generation
    }

    // Display metadata for Sui Explorer
    struct NFTerDisplay has drop {}

    fun init(otw: NFTerDisplay, ctx: &mut TxContext) {
        let publisher = package::claim(otw, ctx);
        let mut display = display::new<OffbrandNFT>(&publisher, ctx);

        // Basic metadata
        display.add(b"name", b"{name}");
        display.add(b"description", b"{description}");
        display.add(b"mint_number", b"{mint_number}");
        display.add(b"original_collection", b"{original_collection}");

        // Image display - using Walrus blob URL
        display.add(b"image_url", b"https://walrus.xyz/blob/{walrus_blob_id}");

        // Generation metadata
        display.add(b"generation_prompt", b"{generation_prompt}");
        display.add(b"model_version", b"{model_version}");
        display.add(b"created_at", b"{created_at}");

        // Additional metadata for explorer
        display.add(b"project_url", b"https://nfter.xyz");
        display.add(b"creator", b"{creator}");

        display.update_version();

        transfer::public_transfer(publisher, ctx.sender());
        transfer::public_transfer(display, ctx.sender());
    }

    /// Initialize the Offbrand Crypto collection
    public entry fun init_collection(
        name: String,
        description: String,
        minting_fee: u64,
        prompt_update_fee: u64,
        ctx: &mut TxContext
    ) {
        let id = object::new(ctx);
        let collection = OffbrandCollection {
            id,
            name,
            description,
            total_minted: 0,
            minting_fee,
            prompt_update_fee,
        };
        transfer::transfer(collection, tx_context::sender(ctx));
    }

    /// Mint a new Offbrand NFT
    public entry fun mint_nft(
        collection: &mut OffbrandCollection,
        name: String,
        description: String,
        original_collection: String,
        base_prompt: String,
        style_prompt: String,
        walrus_blob_id: String,
        image_url: String,
        generation_prompt: String,
        model_version: String,
        generation_params: String,
        attributes: vector<String>,
        attribute_values: vector<String>,
        payment: &mut Balance<SUI>,
        ctx: &mut TxContext
    ) {
        // Check payment
        let fee = collection.minting_fee;
        assert!(balance::value(payment) >= fee, 1);

        // Transfer fee to collection owner
        let fee_balance = balance::split(payment, fee);
        transfer::public_transfer(
            balance::into_coin(fee_balance, ctx),
            tx_context::sender(ctx)
        );

        // Create NFT
        let id = object::new(ctx);
        let nft = OffbrandNFT {
            id,
            name,
            description,
            creator: tx_context::sender(ctx),
            mint_number: collection.total_minted + 1,
            original_collection,
        };

        // Add image metadata
        df::add(&mut nft.id, b"image_metadata", ImageMetadata {
            walrus_blob_id,
            image_url,
            generation_prompt,
            model_version,
            generation_params,
            created_at: tx_context::epoch(ctx),
        });

        // Add prompt configuration
        df::add(&mut nft.id, b"prompt_config", PromptConfig {
            base_prompt,
            style_prompt,
            last_updated: tx_context::epoch(ctx),
            update_count: 0,
        });

        // Add dynamic attributes
        let i = 0;
        while (i < vector::length(&attributes)) {
            let attr_name = vector::borrow(&attributes, i);
            let attr_value = vector::borrow(&attribute_values, i);
            df::add(&mut nft.id, *attr_name, NFTAttribute {
                value: *attr_value,
                last_updated: tx_context::epoch(ctx),
            });
            i = i + 1;
        };

        // Update collection
        collection.total_minted = collection.total_minted + 1;

        transfer::transfer(nft, tx_context::sender(ctx));
    }

    /// Get an NFT's image metadata
    public fun get_image_metadata(nft: &OffbrandNFT): (String, String, String, String, String, u64) {
        let metadata = df::borrow(&nft.id, b"image_metadata");
        (
            metadata.walrus_blob_id,
            metadata.image_url,
            metadata.generation_prompt,
            metadata.model_version,
            metadata.generation_params,
            metadata.created_at
        )
    }

    /// Update an NFT's prompt configuration
    public entry fun update_prompt(
        collection: &OffbrandCollection,
        nft: &mut OffbrandNFT,
        new_base_prompt: String,
        new_style_prompt: String,
        payment: &mut Balance<SUI>,
        ctx: &mut TxContext
    ) {
        // Check payment
        let fee = collection.prompt_update_fee;
        assert!(balance::value(payment) >= fee, 1);

        // Transfer fee to collection owner
        let fee_balance = balance::split(payment, fee);
        transfer::public_transfer(
            balance::into_coin(fee_balance, ctx),
            tx_context::sender(ctx)
        );

        // Update prompt config
        let prompt_config = df::borrow_mut(&mut nft.id, b"prompt_config");
        prompt_config.base_prompt = new_base_prompt;
        prompt_config.style_prompt = new_style_prompt;
        prompt_config.last_updated = tx_context::epoch(ctx);
        prompt_config.update_count = prompt_config.update_count + 1;
    }

    /// Get an NFT's prompt configuration
    public fun get_prompt_config(nft: &OffbrandNFT): (String, String, u64, u64) {
        let prompt_config = df::borrow(&nft.id, b"prompt_config");
        (
            prompt_config.base_prompt,
            prompt_config.style_prompt,
            prompt_config.last_updated,
            prompt_config.update_count
        )
    }

    /// Update an NFT's attribute
    public entry fun update_attribute(
        nft: &mut OffbrandNFT,
        attribute_name: String,
        new_value: String,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == nft.creator, 0);
        let attr = df::borrow_mut(&mut nft.id, attribute_name);
        attr.value = new_value;
        attr.last_updated = tx_context::epoch(ctx);
    }

    /// Get an NFT's attribute
    public fun get_attribute(nft: &OffbrandNFT, attribute_name: String): (String, u64) {
        let attr = df::borrow(&nft.id, attribute_name);
        (attr.value, attr.last_updated)
    }

    /// Get collection info
    public fun get_collection_info(collection: &OffbrandCollection): (String, String, u64, u64, u64) {
        (
            collection.name,
            collection.description,
            collection.total_minted,
            collection.minting_fee,
            collection.prompt_update_fee
        )
    }
}
```

## Frontend Integration

### User Minting

```typescript
function MintNFT() {
  const { mutate: signAndExecute } = useSignAndExecuteTransactionBlock();

  async function mint() {
    // First, generate image with Replicate
    const generation = await replicate.run(
      "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
      {
        input: {
          prompt: basePrompt,
          style_prompt: stylePrompt,
          // ... other parameters
        },
      }
    );

    // Upload to Walrus
    const walrusResponse = await fetch("https://api.walrus.xyz/upload", {
      method: "POST",
      body: generation.output[0], // The generated image
      headers: {
        "Content-Type": "image/png", // or appropriate type
      },
    });
    const { blobId } = await walrusResponse.json();

    // Now mint the NFT
    const txb = new TransactionBlock();
    const [coin] = txb.splitCoins(txb.gas, [txb.pure(mintingFee)]);

    // Prepare attributes
    const attributes = ["rarity", "type", "special_trait"];
    const attributeValues = ["legendary", "meme", "glowing"];

    txb.moveCall({
      target: `${packageId}::nfter::mint_nft`,
      arguments: [
        txb.object(collectionId),
        txb.pure(name),
        txb.pure(description),
        txb.pure(originalCollection),
        txb.pure(basePrompt),
        txb.pure(stylePrompt),
        txb.pure(blobId), // Walrus blob ID
        txb.pure(`https://walrus.xyz/blob/${blobId}`), // Walrus blob URL
        txb.pure(generation.prompt), // Exact prompt used
        txb.pure(generation.version), // Model version
        txb.pure(JSON.stringify(generation.input)), // Generation parameters
        txb.pure(attributes),
        txb.pure(attributeValues),
        coin,
      ],
    });

    signAndExecute({ transactionBlock: txb });
  }
}

function UpdatePrompt() {
  const { mutate: signAndExecute } = useSignAndExecuteTransactionBlock();

  function update() {
    const txb = new TransactionBlock();
    // Split coins for payment
    const [coin] = txb.splitCoins(txb.gas, [txb.pure(promptUpdateFee)]);

    txb.moveCall({
      target: `${packageId}::nfter::update_prompt`,
      arguments: [
        txb.object(collectionId),
        txb.object(nftId),
        txb.pure(newBasePrompt),
        txb.pure(newStylePrompt),
        coin,
      ],
    });

    signAndExecute({ transactionBlock: txb });
  }
}

function UpdateNFT() {
  const { mutate: signAndExecute } = useSignAndExecuteTransactionBlock();

  function update() {
    const txb = new TransactionBlock();
    txb.moveCall({
      target: `${packageId}::nfter::update_attribute`,
      arguments: [
        txb.object(nftId),
        txb.pure(attributeName),
        txb.pure(newValue),
      ],
    });

    signAndExecute({ transactionBlock: txb });
  }
}
```

### Admin Interface

```typescript
function CollectionAdmin() {
  const { mutate: signAndExecute } = useSignAndExecuteTransactionBlock();
  const { data: collection } = useSuiClientQuery("getObject", {
    id: collectionId,
    options: { showContent: true },
  });

  // Initialize collection (one-time setup)
  function initializeCollection() {
    const txb = new TransactionBlock();
    txb.moveCall({
      target: `${packageId}::nfter::init_collection`,
      arguments: [
        txb.pure("Offbrand Crypto"),
        txb.pure("The official collection of offbrand crypto NFTs"),
        txb.pure(1000000), // 0.001 SUI
        txb.pure(10000), // Max supply
      ],
    });
    signAndExecute({ transactionBlock: txb });
  }

  // Update collection settings
  function updateSettings() {
    const txb = new TransactionBlock();
    txb.moveCall({
      target: `${packageId}::nfter::update_collection_settings`,
      arguments: [txb.object(collectionId), txb.pure(newMintingFee)],
    });
    signAndExecute({ transactionBlock: txb });
  }

  return (
    <div>
      <h2>Collection Admin</h2>
      <div>
        <h3>Collection Info</h3>
        <p>Name: {collection?.name}</p>
        <p>Total Minted: {collection?.total_minted}</p>
        <p>Max Supply: {collection?.max_supply}</p>
        <p>Minting Fee: {collection?.minting_fee / 1e9} SUI</p>
      </div>
      <div>
        <h3>Settings</h3>
        <input
          type="number"
          value={newMintingFee}
          onChange={(e) => setNewMintingFee(e.target.value)}
          placeholder="New minting fee in MIST"
        />
        <button onClick={updateSettings}>Update Settings</button>
      </div>
    </div>
  );
}
```

## Deployment Checklist

1. Contract Deployment:

   - [ ] Deploy to devnet
   - [ ] Initialize collection with:
     - Name: "Offbrand Crypto"
     - Description: "The official collection of offbrand crypto NFTs"
     - Minting Fee: 0.001 SUI
     - Max Supply: 10000
   - [ ] Verify display metadata in Sui Explorer

2. Admin Setup:

   - [ ] Deploy admin UI
   - [ ] Set up admin wallet
   - [ ] Test collection settings updates
   - [ ] Verify minting controls

3. User Interface:
   - [ ] Deploy minting UI
   - [ ] Test minting flow
   - [ ] Verify NFT display in Sui Explorer

## Next Steps (Hackathon Timeline)

Day 1:

1. Implement basic Move contract
2. Set up frontend project structure
3. Deploy to devnet

Day 2:

1. Implement collection initialization
2. Implement NFT minting
3. Add admin interface
4. Add Walrus integration

Day 3:

1. Add frontend UI
2. Test and debug
3. Deploy to testnet

## Dependencies

1. Sui Move SDK
2. @mysten/dapp-kit
3. @mysten/sui.js
4. Walrus API

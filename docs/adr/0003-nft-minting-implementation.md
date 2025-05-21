# ADR 0003: NFT Minting Implementation Learnings

## Status

Accepted

## Context

During the implementation of NFT minting functionality, we encountered several challenges and learned important lessons about working with Sui Move contracts and frontend integration.

## Key Learnings

### 1. Image URL Handling

- Store the image URL directly in the main NFT struct (`OffbrandNFT`) for marketplace compatibility
- Use the same URL construction pattern consistently across the codebase
- Construct the URL in the frontend using the pattern: `https://aggregator.walrus-testnet.walrus.space/v1/blobs/{blob_id}`
- Store both the blob ID and full URL in metadata for flexibility

### 2. String Parameter Handling

- Avoid using curly braces in string parameters (especially in `generationParams`)
- Properly escape and sanitize string inputs before passing to the Move contract
- Use consistent string handling across all parameters

### 3. Package ID Management

- Always verify the correct package ID is being used
- Package ID must match the deployed contract
- Keep package IDs in a centralized configuration
- Validate package ID before making contract calls

### 4. Move Contract Design

- Keep the main NFT struct simple and marketplace-compatible
- Use dynamic fields for extensible metadata
- Ensure proper string handling in Move contract
- Maintain consistent URL patterns across the contract

### 5. Frontend Integration

- Construct complex strings (like URLs) in the frontend
- Properly handle string vectors for attributes
- Implement proper error handling and logging
- Validate all inputs before sending to contract

## Consequences

### Positive

- More reliable NFT minting process
- Better marketplace compatibility
- Improved error handling and debugging
- More maintainable codebase

### Negative

- Additional complexity in frontend string handling
- Need to maintain URL construction patterns
- More careful validation required

## Implementation Notes

1. Frontend changes:

   ```typescript
   // Construct image URL from blob ID
   const imageUrl = `https://aggregator.walrus-testnet.walrus.space/v1/blobs/${walrusData.blobId}`;
   ```

2. Move contract changes:

   ```move
   public struct OffbrandNFT has key, store {
       id: UID,
       name: String,
       description: String,
       image_url: String,  // Direct URL for marketplace compatibility
       creator: address,
       mint_number: u64,
       royalty_info: vector<RoyaltyRecipient>,
   }
   ```

3. String vector handling:
   ```typescript
   const attributeNameStrings = attributeNames.map((name) =>
     txb.pure.string(name)
   );
   const attributeValueStrings = attributeValues.map((value) =>
     txb.pure.string(value)
   );
   ```

## References

- [Sui Move Documentation](https://docs.sui.io/build/move)
- [Sui SDK Documentation](https://docs.sui.io/build/sui-json-rpc)
- [Walrus Documentation](https://docs.walrus.space)

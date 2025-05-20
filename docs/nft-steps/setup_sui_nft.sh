#!/bin/bash

# Hardcoded setup for Offbrand Crypto NFT collection on Sui
# Ensure Sui CLI and jq are installed and configured properly.
# This script automates the publication of a Move package,
# initialization of an NFT collection, and setting of royalty rules.

# --- Hardcoded Parameters ---
PUBLISH_DIR="../../move" # Directory containing your Move package
COLLECTION_NAME="Offbrand Crypto"
COLLECTION_DESC="The official collection of Offbrand Crypto NFTs, uniquely generated and ready for the 8-Bit Oracle."
MINT_FEE="1000000"    # Example: 0.001 SUI (1 SUI = 1,000,000,000 MIST)
PROMPT_FEE="1000000"  # Example: 0.001 SUI
ROYALTY_BP="500"      # 500 basis points = 5% (500/10000)
ROYALTY_MIN="1000000" # Minimum royalty in MIST (e.g., 0.001 SUI)

echo "--- Starting Sui NFT Collection Setup ---"
echo "-----------------------------------------"

echo "Step 1: Publishing Move package from '$PUBLISH_DIR'..."
# Publish the Move package and capture the full JSON output
PUBLISH_JSON=$(sui client publish "$PUBLISH_DIR" --gas-budget 500000000 --json)

# Check if the publish command was successful
if [ -z "$PUBLISH_JSON" ]; then
  echo "Error: 'sui client publish' command failed or returned empty output."
  exit 1
fi

# Extract PACKAGE_ID from the "published" objectChange type
PACKAGE_ID=$(echo "$PUBLISH_JSON" | jq -r '.objectChanges[]? | select(.type=="published") | .packageId')
if [ -z "$PACKAGE_ID" ] || [ "$PACKAGE_ID" == "null" ]; then
  echo "Error: Could not extract PACKAGE_ID from publish output."
  echo "Please inspect the JSON output for anomalies."
  exit 1
fi
echo "Published package ID: $PACKAGE_ID"

# Extract PUBLISHER_ID (the 0x2::package::Publisher object)
# Add '?' to .objectChanges[] to handle cases where the array might be empty or missing elements.
PUBLISHER_ID=$(echo "$PUBLISH_JSON" | jq -r '.objectChanges[]? | select(.type=="created" and .objectType=="0x2::package::Publisher") | .objectId')
if [ -z "$PUBLISHER_ID" ] || [ "$PUBLISHER_ID" == "null" ]; then
  echo "Error: Could not extract PUBLISHER_ID from publish output."
  echo "Please inspect the JSON output for anomalies."
  exit 1
fi
echo "Publisher ID: $PUBLISHER_ID"

echo "-----------------------------------------"
echo "Step 2: Initializing collection '$COLLECTION_NAME'..."
# Call the init_collection function to create the collection objects
INIT_JSON=$(sui client call \
  --package "$PACKAGE_ID" \
  --module nfter \
  --function init_collection \
  --args "$COLLECTION_NAME" "$COLLECTION_DESC" "$MINT_FEE" "$PROMPT_FEE" "$PUBLISHER_ID" \
  --gas-budget 100000000 \
  --json)

# Check if the init_collection command was successful
if [ -z "$INIT_JSON" ]; then
  echo "Error: 'sui client call init_collection' command failed or returned empty output."
  exit 1
fi

# Extract COLLECTION_ID, POLICY_CAP_ID, and POLICY_ID from the init_collection output
# Add '?' to .objectChanges[] and explicitly check if .objectType is a string before 'contains'
COLLECTION_ID=$(echo "$INIT_JSON" | jq -r '.objectChanges[]? | select(.type=="created" and (.objectType | type == "string") and (.objectType | contains("::nfter::OffbrandCollection"))) | .objectId')
POLICY_CAP_ID=$(echo "$INIT_JSON" | jq -r '.objectChanges[]? | select(.type=="created" and (.objectType | type == "string") and (.objectType | contains("::transfer_policy::TransferPolicyCap"))) | .objectId')
POLICY_ID=$(echo "$INIT_JSON" | jq -r '.objectChanges[]? | select(.type=="created" and (.objectType | type == "string") and (.objectType | contains("::transfer_policy::TransferPolicy<"))) | .objectId')

# Validate extracted IDs
if [ -z "$COLLECTION_ID" ] || [ "$COLLECTION_ID" == "null" ]; then
  echo "Error: Could not extract COLLECTION_ID from init_collection output."
  echo "Init JSON: $INIT_JSON"
  exit 1
fi
if [ -z "$POLICY_CAP_ID" ] || [ "$POLICY_CAP_ID" == "null" ]; then
  echo "Error: Could not extract POLICY_CAP_ID from init_collection output."
  echo "Init JSON: $INIT_JSON"
  exit 1
fi
if [ -z "$POLICY_ID" ] || [ "$POLICY_ID" == "null" ]; then
  echo "Error: Could not extract POLICY_ID from init_collection output."
  echo "Init JSON: $INIT_JSON"
  exit 1
fi

echo "Collection ID: $COLLECTION_ID"
echo "TransferPolicyCap ID: $POLICY_CAP_ID"
echo "TransferPolicy ID: $POLICY_ID"

echo "-----------------------------------------"
echo "Step 3: Setting royalties on TransferPolicy (Policy ID: $POLICY_ID)..."
# Call the update_royalty_rules function
sui client call \
  --package "$PACKAGE_ID" \
  --module nfter \
  --function update_royalty_rules \
  --args "$COLLECTION_ID" "$POLICY_ID" "$POLICY_CAP_ID" "$ROYALTY_BP" "$ROYALTY_MIN" \
  --gas-budget 100000000 \
  --json

echo "-----------------------------------------"
echo "--- All done! ---"
echo "Summary of deployed assets:"
echo "  Package ID:         $PACKAGE_ID"
echo "  Collection ID:      $COLLECTION_ID"
echo "  TransferPolicy ID:  $POLICY_ID"
echo "  TransferPolicyCap ID: $POLICY_CAP_ID"
echo "-----------------------------------------"

#!/bin/bash

# Script to extract royalty data from a Sui TransferPolicy
# Requires: sui CLI and jq installed.

set -e # Exit immediately if a command exits with a non-zero status

# --- Configuration ---
TRANSFER_POLICY_ID="0x98b0d473b8b0ee6e833ca2daa7dc6ba95b2333a5dfece743474de374524657da" # Replace with your TransferPolicy ID

echo "--- Extracting Royalty Data for TransferPolicy: $TRANSFER_POLICY_ID ---"
echo "---------------------------------------------------------------------"

# Step 1: Get dynamic fields of the TransferPolicy
echo "1. Fetching dynamic fields for TransferPolicy ID..."
DYNAMIC_FIELDS_JSON=$(sui client dynamic-field "$TRANSFER_POLICY_ID" --json)

if [ -z "$DYNAMIC_FIELDS_JSON" ]; then
  echo "Error: Could not retrieve dynamic fields for $TRANSFER_POLICY_ID. Is the ID correct?"
  exit 1
fi

# Extract the objectId of the royalty_rule::Config from the dynamic fields
# We specifically look for the dynamic field whose objectType contains "::royalty_rule::Config"
ROYALTY_CONFIG_OBJECT_ID=$(echo "$DYNAMIC_FIELDS_JSON" | jq -r '.data[]? | select(.objectType | type == "string" and contains("::royalty_rule::Config")) | .objectId')

if [ -z "$ROYALTY_CONFIG_OBJECT_ID" ] || [ "$ROYALTY_CONFIG_OBJECT_ID" == "null" ]; then
  echo "Error: Could not find the Royalty Config object ID associated with TransferPolicy ID: $TRANSFER_POLICY_ID."
  echo "This TransferPolicy might not have a royalty rule configured, or its structure differs."
  exit 1
fi

echo "Found Royalty Config Object ID: $ROYALTY_CONFIG_OBJECT_ID"
echo "---------------------------------------------------------------------"

# Step 2: Get the details of the Royalty Config object
echo "2. Fetching details of Royalty Config Object ID: $ROYALTY_CONFIG_OBJECT_ID..."
ROYALTY_DETAILS_JSON=$(sui client object "$ROYALTY_CONFIG_OBJECT_ID" --json)

if [ -z "$ROYALTY_DETAILS_JSON" ]; then
  echo "Error: Could not retrieve details for Royalty Config Object ID: $ROYALTY_CONFIG_OBJECT_ID."
  exit 1
fi

# Extract amount_bp and min_amount from the royalty details
ROYALTY_AMOUNT_BP=$(echo "$ROYALTY_DETAILS_JSON" | jq -r '.content.fields.value.fields.amount_bp')
ROYALTY_MIN_AMOUNT=$(echo "$ROYALTY_DETAILS_JSON" | jq -r '.content.fields.value.fields.min_amount')

if [ -z "$ROYALTY_AMOUNT_BP" ] || [ "$ROYALTY_AMOUNT_BP" == "null" ] ||
  [ -z "$ROYALTY_MIN_AMOUNT" ] || [ "$ROYALTY_MIN_AMOUNT" == "null" ]; then
  echo "Error: Could not extract royalty basis points or minimum amount from the Royalty Config object."
  echo "Please check the structure of the object's JSON output."
  exit 1
fi

# Convert basis points to percentage
ROYALTY_PERCENTAGE=$(awk "BEGIN {print $ROYALTY_AMOUNT_BP / 100}")

echo "---------------------------------------------------------------------"
echo "--- Royalty Data Extracted ---"
echo "TransferPolicy ID:   $TRANSFER_POLICY_ID"
echo "Royalty Object ID:   $ROYALTY_CONFIG_OBJECT_ID"
echo "Royalty Basis Points: $ROYALTY_AMOUNT_BP (which is $ROYALTY_PERCENTAGE%)"
echo "Minimum Royalty Amount: $ROYALTY_MIN_AMOUNT MIST" # MIST is the smallest unit of SUI
echo "---------------------------------------------------------------------"

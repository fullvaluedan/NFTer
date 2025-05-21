#!/bin/bash

ADDRESS="$1"

if [ -z "$ADDRESS" ]; then
  echo "Usage: $0 <YOUR_ADDRESS>"
  exit 1
fi

echo "Fetching objects for address: $ADDRESS"
sui client objects "$ADDRESS" --json >objects.json

# Print all types for debugging
echo "All object types for this address:"
jq -r '.[] | .data.type' objects.json | sort | uniq

echo ""
echo "Candidate OffbrandCollection objects:"
jq -r '.[] | .data | select(.type | test("::nfter::OffbrandCollection$")) | "\(.objectId) \(.type)"' objects.json

echo ""
echo "Candidate TransferPolicy objects:"
jq -r '.[] | .data | select(.type | test("::transfer_policy::TransferPolicy<.*::nfter::OffbrandNFT>")) | "\(.objectId) \(.type)"' objects.json

echo ""
echo "Candidate TransferPolicyCap objects:"
jq -r '.[] | .data | select(.type | test("::transfer_policy::TransferPolicyCap<.*::nfter::OffbrandNFT>")) | "\(.objectId) \(.type)"' objects.json

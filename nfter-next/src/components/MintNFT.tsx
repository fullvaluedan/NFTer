import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { SuiObjectChangeCreated, SuiObjectChange } from '@mysten/sui/client';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { useState, useEffect } from 'react'; // Import useEffect
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

interface MintNFTProps {
  walrusData: {
    blobId: string;
    url: string;
  };
  collectionId: string;
  packageId: string;
  role: string;
  prompt: string;
  onMinted: (objectId: string) => void;
}

export function MintNFT({ walrusData, collectionId, packageId, role, prompt, onMinted }: MintNFTProps) {
  const account = useCurrentAccount();
  const { mutate: signAndExecute, isPending } = useSignAndExecuteTransaction();
  const suiClient = useSuiClient();
  const [mintedNftObjectId, setMintedNftObjectId] = useState<string | null>(null);
  const [latestTransactionDigest, setLatestTransactionDigest] = useState<string | null>(null);
  
  // --- PROPS LOGGING ---
  console.log("MintNFT Props:", { walrusData, collectionId, packageId, role, prompt });
  // ---------------------

  const [formData, setFormData] = useState({
    name: `The ${role} Avatar`,
    description: `An AI-generated anime avatar in the ${role} style.`,
    basePrompt: '',
    stylePrompt: '',
    generationPrompt: prompt, // Initial value
    modelVersion: 'sdxl-v1.0',
    generationParams: '',
  });

  // --- ADDED useEffect TO UPDATE formData WHEN PROMPT OR ROLE CHANGES ---
  useEffect(() => {
    // Only update if the incoming prop is different from the current state
    // This prevents unnecessary re-renders if the prompt is already set
    if (formData.generationPrompt !== prompt || formData.name !== `The ${role} Avatar` || formData.description !== `An AI-generated anime avatar in the ${role} style.`) {
        setFormData(prevFormData => ({
            ...prevFormData,
            name: `The ${role} Avatar`, // Update name if role changes
            description: `An AI-generated anime avatar in the ${role} style.`, // Update description if role changes
            generationPrompt: prompt, // Update generationPrompt if prompt changes
        }));
    }
    console.log("MintNFT: useEffect triggered. New prompt:", prompt, "New role:", role);
  }, [prompt, role, formData.generationPrompt, formData.name, formData.description]); // Depend on prompt and role, and relevant formData fields

  // --- DEBUGGING LOG ---
  useEffect(() => {
    console.log("MintNFT: Current formData state:", formData);
  }, [formData]);
  // -------------------

  const handleMint = async () => {
    if (!account) {
      toast.error('Please connect your wallet first');
      return;
    }

    // --- PRE-TRANSACTION LOGGING ---
    console.log("handleMint: Starting mint process");
    console.log("handleMint: Account:", account);
    console.log("handleMint: formData before txb construction:", formData);
    console.log("handleMint: walrusData:", walrusData);
    console.log("handleMint: collectionId:", collectionId);
    console.log("handleMint: packageId:", packageId);
    console.log("handleMint: role:", role);
    // -----------------------------

    try {
      const txb = new Transaction();
      if (!account) { // Double check account, though already done above
        toast.error('Wallet not connected for setting sender');
        return;
      }
      txb.setSender(account.address); // <-- Set the transaction sender

      // --- PAYMENT COIN LOGGING ---
      console.log("handleMint: Preparing payment coin. Gas object:", txb.gas);
      const paymentAmount = 1_000_000;
      console.log("handleMint: Payment amount (u64):", paymentAmount);
      // --------------------------
      const [paymentCoin] = txb.splitCoins(txb.gas, [txb.pure.u64(paymentAmount)]);
      console.log("handleMint: paymentCoin object after split:", paymentCoin);

      const royaltyRecipients = [account.address];
      const royaltyPercentages = [100];

      const attributeNames = ["Role", "Model Version"];
      const attributeValues = [role, formData.modelVersion];

      // Construct the image URL from the blob ID
      const imageUrl = `https://aggregator.walrus-testnet.walrus.space/v1/blobs/${walrusData.blobId}`;

      // --- LOGGING BEFORE txb.pure.string ---
      console.log("handleMint: Values for txb.pure.string:", {
        description: formData.description,
        imageUrl,
        walrusBlobId: walrusData.blobId,
        basePrompt: formData.basePrompt,
        stylePrompt: formData.stylePrompt,
        generationPrompt: formData.generationPrompt,
        modelVersion: formData.modelVersion,
        generationParams: formData.generationParams,
      });
      // --- END LOGGING BEFORE txb.pure.string ---

      // --- LOGGING BEFORE txb.makeMoveVec ---
      const mappedRoyaltyRecipients = royaltyRecipients.map(addr => {
        console.log("handleMint: txb.pure.address for royaltyRecipient:", addr);
        return txb.pure.address(addr);
      });
      console.log("handleMint: Elements for royaltyRecipients vector:", mappedRoyaltyRecipients);

      const mappedRoyaltyPercentages = royaltyPercentages.map(pct => {
        console.log("handleMint: txb.pure.u8 for royaltyPercentage:", pct);
        return txb.pure.u8(pct);
      });
      console.log("handleMint: Elements for royaltyPercentages vector:", mappedRoyaltyPercentages);

      // Create string vectors for attributes
      const attributeNameStrings = attributeNames.map(name => txb.pure.string(name));
      const attributeValueStrings = attributeValues.map(value => txb.pure.string(value));

      console.log("handleMint: Elements for attributeNames vector:", attributeNameStrings);
      console.log("handleMint: Elements for attributeValues vector:", attributeValueStrings);

      txb.moveCall({
        target: `${packageId}::nfter::mint_nft`,
        arguments: [
          txb.object(collectionId),
          txb.pure.string(formData.description),
          txb.pure.string(imageUrl),
          txb.makeMoveVec({ type: "address", elements: mappedRoyaltyRecipients }),
          txb.makeMoveVec({ type: "u8", elements: mappedRoyaltyPercentages }),
          txb.pure.string(formData.basePrompt),
          txb.pure.string(formData.stylePrompt),
          txb.pure.string(walrusData.blobId),
          txb.pure.string(formData.generationPrompt),
          txb.pure.string(formData.modelVersion),
          txb.pure.string(formData.generationParams),
          txb.makeMoveVec({ type: "0x1::string::String", elements: attributeNameStrings }),
          txb.makeMoveVec({ type: "0x1::string::String", elements: attributeValueStrings }),
          paymentCoin,
        ],
      });

      // --- RECONSTRUCTION LOGGING FOR SUI CLIENT CALL ---
      console.log("--- SUI Client Call Reconstruction ---");
      console.log(`sui client call \\
        --package ${packageId} \\
        --module nfter \\
        --function mint_nft \\
        --args \\
          ${collectionId} \\
          "${formData.description}" \\
          "${imageUrl}" \\
          '${JSON.stringify(royaltyRecipients)}' \\
          '${JSON.stringify(royaltyPercentages)}' \\
          "${formData.basePrompt}" \\
          "${formData.stylePrompt}" \\
          "${walrusData.blobId}" \\
          "${formData.generationPrompt.replace(/\n/g, '\\n')}" \\
          "${formData.modelVersion}" \\
          "${formData.generationParams}" \\
          '${JSON.stringify(attributeNames.map(s => s.toString()))}' \\
          '${JSON.stringify(attributeValues.map(s => s.toString()))}' \\
          <PAYMENT_COIN_OBJECT_ID>`);
      console.log("--- End SUI Client Call Reconstruction ---");
      console.log("Note: For <PAYMENT_COIN_OBJECT_ID>, use 'sui client gas' to find a suitable coin ID you own.");
      console.log("Note: The txb.gas object used by the dApp for this transaction would be (for reference):", txb.gas);
      // --------------------------------------------------

      // --- LOGGING TRANSACTION BLOCK ---
      console.log("handleMint: Transaction block before signing:", txb.blockData);
      try {
        const transactionBlockBytes = await txb.build({ client: suiClient });
        console.log("handleMint: Transaction block bytes (for inspection):", transactionBlockBytes);
      } catch (buildError) {
        console.error("handleMint: Error building transaction block for logging:", buildError);
      }
      // -------------------------------

      await signAndExecute(
        {
          transaction: txb,
        },
        {
          onSuccess: async (result) => {
            console.log('Initial mint transaction digest:', result.digest);
            setLatestTransactionDigest(result.digest);
            toast.success('Transaction submitted! Verifying on-chain...');

            const maxRetries = 10;
            const retryDelay = 3000; // 3 seconds
            let attempts = 0;

            const fetchTransactionDetails = async () => {
              try {
                const txn = await suiClient.getTransactionBlock({
                  digest: result.digest,
                  options: {
                    showObjectChanges: true,
                    showEffects: true,
                  },
                });
                console.log('Full transaction details:', txn);

                let newNftId: string | undefined;
                if (txn.objectChanges) {
                  const createdNftChange = txn.objectChanges.find(
                    (objCh: SuiObjectChange): objCh is SuiObjectChangeCreated =>
                      objCh.type === "created" &&
                      objCh.objectType === `${packageId}::nfter::OffbrandNFT`
                  );
                  if (createdNftChange) {
                    newNftId = createdNftChange.objectId;
                  }
                }

                if (!newNftId && txn.effects?.created) {
                  const createdObjects = txn.effects.created;
                  if (createdObjects && Array.isArray(createdObjects) && account) {
                    for (const obj of createdObjects) {
                      if (obj && typeof obj === 'object' && 
                          obj.owner && typeof obj.owner === 'object' && 'AddressOwner' in obj.owner && 
                          obj.reference && typeof obj.reference === 'object' && 'objectId' in obj.reference &&
                          obj.owner.AddressOwner === account.address) {
                        newNftId = obj.reference.objectId as string;
                        break;
                      }
                    }
                  }
                }

                if (newNftId) {
                  toast.success('NFT Minted Successfully!');
                  setMintedNftObjectId(newNftId);
                  if (typeof onMinted === 'function') {
                    onMinted(newNftId);
                  } else {
                    console.warn('MintNFT: onMinted prop was not a function.');
                  }
                } else {
                  console.warn("Could not find the minted NFT object ID in transaction details even after confirmation.");
                  toast.error("Mint confirmed, but could not retrieve specific NFT details.");
                }
              } catch (fetchError: unknown) {
                attempts++;
                let errorMessage = 'An unknown error occurred during fetch.'; // Default message
                if (fetchError instanceof Error) {
                  errorMessage = fetchError.message;
                } else if (typeof fetchError === 'object' && fetchError !== null && 
                           Object.prototype.hasOwnProperty.call(fetchError, 'message') && 
                           typeof (fetchError as { message: unknown }).message === 'string') {
                  errorMessage = (fetchError as { message: string }).message;
                }

                if (attempts < maxRetries && errorMessage.includes('Could not find the referenced transaction')) {
                  console.log(`Attempt ${attempts}: Transaction not found yet (Message: ${errorMessage}). Retrying in ${retryDelay / 1000}s...`);
                  setTimeout(fetchTransactionDetails, retryDelay);
                } else {
                  console.error("Error fetching transaction details or max retries reached:", fetchError);
                  toast.error("Failed to fetch NFT details after minting. Please check the transaction on the explorer.");
                }
              }
            };

            fetchTransactionDetails(); // Initial call to start polling
          },
          onError: (error: Error) => {
            toast.error('Failed to mint NFT');
            console.error('Mint error:', error);
            alert(JSON.stringify(error));
          },
        }
      );
    } catch (error) {
      console.error('Mint error:', error);
      toast.error('Failed to mint NFT');
    }
  };

  return (
    <div className="w-full space-y-3 sm:space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm sm:text-base">NFT Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter NFT name"
          className="text-sm sm:text-base"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm sm:text-base">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Enter NFT description"
          className="text-sm sm:text-base min-h-[80px] sm:min-h-[100px]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="basePrompt" className="text-sm sm:text-base">Base Prompt</Label>
        <Textarea
          id="basePrompt"
          value={formData.basePrompt}
          onChange={(e) => setFormData({ ...formData, basePrompt: e.target.value })}
          placeholder="Enter base prompt for 8-bit Oracle"
          className="text-sm sm:text-base min-h-[60px] sm:min-h-[80px]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="stylePrompt" className="text-sm sm:text-base">Style Prompt</Label>
        <Textarea
          id="stylePrompt"
          value={formData.stylePrompt}
          onChange={(e) => setFormData({ ...formData, stylePrompt: e.target.value })}
          placeholder="Enter style prompt for 8-bit Oracle"
          className="text-sm sm:text-base min-h-[60px] sm:min-h-[80px]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="generationPrompt" className="text-sm sm:text-base">Generation Prompt</Label>
        <Textarea
          id="generationPrompt"
          value={formData.generationPrompt}
          onChange={(e) => setFormData({ ...formData, generationPrompt: e.target.value })}
          placeholder="Enter the prompt used to generate this image"
          className="text-sm sm:text-base min-h-[60px] sm:min-h-[80px]"
        />
      </div>

      <Button
        onClick={handleMint}
        disabled={isPending || !account}
        className="w-full text-sm sm:text-base py-2 sm:py-3"
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Minting...
          </>
        ) : (
          'Mint NFT'
        )}
      </Button>

      {latestTransactionDigest && (
        <div className="mt-6 text-center">
          <Link
            href={`https://testnet.suivision.xyz/txblock/${latestTransactionDigest}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-150 ease-in-out"
          >
            View Transaction on SuiVision
          </Link>
        </div>
      )}

      {/* Detailed success message, appears after objectId is confirmed */}
      {mintedNftObjectId && (
        <div className="mt-4 text-center p-3 border border-green-300 bg-green-50 rounded-lg">
          <p className="text-lg font-semibold text-green-700 mb-2">
            🎉 NFT Minted Successfully! 🎉
          </p>
          <Link
            href={`https://testnet.suivision.xyz/object/${mintedNftObjectId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:text-blue-700 underline"
          >
            View Your NFT on SuiVision
          </Link>
        </div>
      )}
    </div>
  );
}
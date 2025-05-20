import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { useState, useEffect } from 'react'; // Import useEffect
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface MintNFTProps {
  walrusData: {
    blobId: string;
    url: string;
  };
  collectionId: string;
  packageId: string;
  role: string;
  prompt: string;
}

export function MintNFT({ walrusData, collectionId, packageId, role, prompt }: MintNFTProps) {
  const account = useCurrentAccount();
  const { mutate: signAndExecute, isPending } = useSignAndExecuteTransaction();
  
  const [formData, setFormData] = useState({
    name: `The ${role} Avatar`,
    description: `An AI-generated anime avatar in the ${role} style.`,
    basePrompt: '',
    stylePrompt: '',
    generationPrompt: prompt, // Initial value
    modelVersion: 'sdxl-v1.0',
    generationParams: '{}',
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

    try {
      const txb = new Transaction();
      
      const [paymentCoin] = txb.splitCoins(txb.gas, [txb.pure.u64(1_000_000)]); 

      const royaltyRecipients = [account.address];
      const royaltyPercentages = [100];

      const attributeNames = ["Role", "Model Version"];
      const attributeValues = [role, formData.modelVersion];

      txb.moveCall({
        target: `${packageId}::nfter::mint_nft`,
        arguments: [
          txb.object(collectionId),
          txb.pure.string(formData.name),
          txb.pure.string(formData.description),
          txb.makeMoveVec({ type: "address", elements: royaltyRecipients.map(addr => txb.pure.address(addr)) }),
          txb.makeMoveVec({ type: "u64", elements: royaltyPercentages.map(pct => txb.pure.u64(pct)) }),
          txb.pure.string(formData.basePrompt),
          txb.pure.string(formData.stylePrompt),
          txb.pure.string(walrusData.blobId),
          txb.pure.string(walrusData.url),
          txb.pure.string(formData.generationPrompt),
          txb.pure.string(formData.modelVersion),
          txb.pure.string(formData.generationParams),
          txb.makeMoveVec({ type: "string", elements: attributeNames.map(name => txb.pure.string(name)) }),
          txb.makeMoveVec({ type: "string", elements: attributeValues.map(value => txb.pure.string(value)) }),
          paymentCoin,
        ],
      });

      await signAndExecute(
        {
          transaction: txb,
        },
        {
          onSuccess: (result) => {
            toast.success('Successfully minted NFT!');
            console.log('Mint transaction:', result);
          },
          onError: (error: Error) => {
            toast.error('Failed to mint NFT');
            console.error('Mint error:', error);
            alert(JSON.stringify(error)); // Add this for debugging
          },
        }
      );
    } catch (error) {
      console.error('Mint error:', error);
      toast.error('Failed to mint NFT');
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">NFT Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter NFT name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Enter NFT description"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="basePrompt">Base Prompt</Label>
        <Textarea
          id="basePrompt"
          value={formData.basePrompt}
          onChange={(e) => setFormData({ ...formData, basePrompt: e.target.value })}
          placeholder="Enter base prompt for 8-bit Oracle"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="stylePrompt">Style Prompt</Label>
        <Textarea
          id="stylePrompt"
          value={formData.stylePrompt}
          onChange={(e) => setFormData({ ...formData, stylePrompt: e.target.value })}
          placeholder="Enter style prompt for 8-bit Oracle"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="generationPrompt">Generation Prompt</Label>
        <Textarea
          id="generationPrompt"
          value={formData.generationPrompt}
          onChange={(e) => setFormData({ ...formData, generationPrompt: e.target.value })}
          placeholder="Enter the prompt used to generate this image"
          // You might want to make this readOnly if it's strictly AI-generated and not editable by the user
          // readOnly
        />
      </div>

      <Button
        onClick={handleMint}
        disabled={isPending || !account}
        className="w-full"
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
    </div>
  );
}
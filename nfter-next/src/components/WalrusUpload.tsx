import { useWalrusUpload } from '@/hooks/useWalrusUpload';
import { Button } from './ui/button';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { toast } from 'sonner';
import { Upload, ExternalLink, Wallet } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react'; // Ensure useEffect is imported
import { ConnectButton } from '@mysten/dapp-kit';
import { MintNFT } from './MintNFT';

interface WalrusUploadProps {
  imageUrl: string;
  onUploadComplete?: (data: {
    blobId: string;
    url: string;
    suiRef: string;
    suiRefType: string;
    endEpoch: number;
  }) => void;
  collectionId: string;
  packageId: string;
  role: string;
  prompt: string;
}

export function WalrusUpload({
  imageUrl,
  onUploadComplete,
  collectionId,
  packageId,
  role,
  prompt,
}: WalrusUploadProps) {
  const account = useCurrentAccount();
  const { upload, isLoading, error } = useWalrusUpload({
    sendTo: account?.address,
  });
  const [uploadedImage, setUploadedImage] = useState<{
    blobId: string;
    url: string;
  } | null>(null);

  // Existing useEffect for initial props
  useEffect(() => {
    console.log('WalrusUpload: Props received -');
    console.log('  imageUrl:', imageUrl);
    console.log('  collectionId:', collectionId);
    console.log('  packageId:', packageId);
    console.log('  role (initial):', role);
    console.log('  prompt (initial):', prompt);
  }, [imageUrl, collectionId, packageId, role, prompt]);

  // NEW useEffect to log what's passed to MintNFT,
  // triggered when uploadedImage changes (i.e., after successful upload)
  useEffect(() => {
    if (uploadedImage) {
      console.log('WalrusUpload: Data for MintNFT - role:', role, 'prompt:', prompt);
    }
  }, [uploadedImage, role, prompt]); // Dependencies: uploadedImage, and the props it passes

  const handleUpload = async () => {
    if (!account) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], 'avatar.png', { type: 'image/png' });

      const result = await upload(file);
      toast.success('Successfully uploaded to Walrus!');

      setUploadedImage({
        blobId: result.blobId,
        url: result.url,
      });

      onUploadComplete?.(result);
    } catch (err) {
      console.error('Failed to upload to Walrus:', err);
      toast.error('Failed to upload to Walrus');
    }
  };

  // Add this useEffect to log the props just before MintNFT is rendered.
  useEffect(() => {
    console.log('WalrusUpload: Props just before MintNFT - role:', role, 'prompt:', prompt);
  }, [uploadedImage, collectionId, packageId, role, prompt]);

  return (
    <div className="flex flex-col items-center gap-4">
      {!uploadedImage ? (
        <>
          {!account ? (
            <div className="w-full space-y-4 text-center">
              <p className="text-sm text-muted-foreground">
                Connect your wallet to upload to Walrus
              </p>
              <ConnectButton className="w-full !bg-blue-600 hover:!bg-blue-700">
                <Wallet className="mr-2 h-4 w-4" />
                Connect Wallet
              </ConnectButton>
            </div>
          ) : (
            <Button
              onClick={handleUpload}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Uploading...' : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload to Walrus
                </>
              )}
            </Button>
          )}
        </>
      ) : (
        <div className="w-full space-y-4">
          <div className="relative aspect-square w-full overflow-hidden rounded-lg border">
            <Image
              src={uploadedImage.url}
              alt="Uploaded to Walrus"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="text-sm text-muted-foreground">
              <p>Blob ID: {uploadedImage.blobId}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => window.open(uploadedImage.url, '_blank')}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              View on Walrus
            </Button>
          </div>

          {/* Removed the direct console.log from here */}
          <MintNFT
            walrusData={uploadedImage}
            collectionId={collectionId}
            packageId={packageId}
            role={role}
            prompt={prompt}
          />
        </div>
      )}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
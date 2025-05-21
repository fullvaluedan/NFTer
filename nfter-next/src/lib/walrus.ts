interface WalrusUploadResponse {
  newlyCreated?: {
    blobObject: {
      blobId: string;
      id: string;
      storage: {
        endEpoch: number;
      };
    };
  };
  alreadyCertified?: {
    blobId: string;
    endEpoch: number;
    event: {
      txDigest: string;
    };
  };
}

export interface WalrusConfig {
  publisherUrl: string;
  aggregatorUrl: string;
  epochs: number;
  sendTo?: string;
}

export async function uploadToWalrus(
  file: File,
  config: WalrusConfig
): Promise<{
  blobId: string;
  url: string;
  suiRef: string;
  suiRefType: string;
  endEpoch: number;
}> {
  const { publisherUrl, aggregatorUrl, epochs, sendTo } = config;

  // Construct the upload URL with parameters
  const sendToParam = sendTo ? `&send_object_to=${sendTo}` : "";
  const uploadUrl = `${publisherUrl}/v1/blobs?epochs=${epochs}${sendToParam}`;

  // Upload the file
  const response = await fetch(uploadUrl, {
    method: "PUT",
    body: file,
  });

  if (!response.ok) {
    throw new Error("Failed to upload to Walrus");
  }

  const storageInfo: WalrusUploadResponse = await response.json();

  // Extract the relevant information based on the response type
  let info;
  if (storageInfo.alreadyCertified) {
    info = {
      blobId: storageInfo.alreadyCertified.blobId,
      suiRef: storageInfo.alreadyCertified.event.txDigest,
      suiRefType: "Previous Sui Certified Event",
      endEpoch: storageInfo.alreadyCertified.endEpoch,
    };
  } else if (storageInfo.newlyCreated) {
    info = {
      blobId: storageInfo.newlyCreated.blobObject.blobId,
      suiRef: storageInfo.newlyCreated.blobObject.id,
      suiRefType: "Associated Sui Object",
      endEpoch: storageInfo.newlyCreated.blobObject.storage.endEpoch,
    };
  } else {
    throw new Error("Invalid response from Walrus");
  }

  // Construct the blob URL
  const blobUrl = `${aggregatorUrl}/v1/blobs/${info.blobId}`;

  return {
    ...info,
    url: blobUrl,
  };
}

// Default configuration for testnet
export const DEFAULT_WALRUS_CONFIG: WalrusConfig = {
  publisherUrl: "https://publisher.walrus-testnet.walrus.space",
  aggregatorUrl: "https://aggregator.walrus-testnet.walrus.space",
  epochs: 1,
};

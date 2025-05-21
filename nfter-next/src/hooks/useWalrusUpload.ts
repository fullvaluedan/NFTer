import { useState } from "react";
import {
  uploadToWalrus,
  DEFAULT_WALRUS_CONFIG,
  type WalrusConfig,
} from "@/lib/walrus";

interface UploadState {
  isLoading: boolean;
  error: string | null;
  data: {
    blobId: string;
    url: string;
    suiRef: string;
    suiRefType: string;
    endEpoch: number;
  } | null;
}

export function useWalrusUpload(config: Partial<WalrusConfig> = {}) {
  const [state, setState] = useState<UploadState>({
    isLoading: false,
    error: null,
    data: null,
  });

  const upload = async (file: File) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await uploadToWalrus(file, {
        ...DEFAULT_WALRUS_CONFIG,
        ...config,
      });

      setState({
        isLoading: false,
        error: null,
        data: result,
      });

      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to upload to Walrus";
      setState({
        isLoading: false,
        error: errorMessage,
        data: null,
      });
      throw error;
    }
  };

  return {
    upload,
    ...state,
  };
}

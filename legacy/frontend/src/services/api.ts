import axios from "axios";

const API_BASE_URL = "/api";

export interface GenerateResponse {
  image_urls: string[];
  role: string;
  scores: number[];
}

export const generateAvatar = async (
  formData: FormData
): Promise<GenerateResponse> => {
  const response = await axios.post<GenerateResponse>(
    `${API_BASE_URL}/generate`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

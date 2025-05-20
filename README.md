# NFTer - Anime Character Generator

Transform your photos into Naruto-style anime characters using AI. This application uses a FastAPI backend with a React frontend to generate anime-style portraits with different character roles from the Naruto universe.

## Features

- Upload your photo and transform it into an anime character
- Choose from various Naruto-style roles:
  - Civilian Villager
  - Young Genin
  - Chūnin
  - Elite Jōnin
  - Rogue Ninja
  - Akatsuki Member
  - Anbu Black Ops
  - Hidden Leaf Teacher
  - Hokage
- Get a power score based on your character's role
- Modern, responsive UI with real-time feedback

## Architecture

This is a monorepo containing both the backend and frontend applications:

### Backend (FastAPI)

- Handles HTTP requests and API endpoints
- Processes image uploads and transformations
- Communicates with the Replicate API
- Manages file storage and cleanup
- Runs on port 5000

### Frontend (React + Vite)

- Modern React application with TypeScript
- Shadcn UI components
- Tailwind CSS for styling
- Custom animations and transitions
- Runs on port 5173

### API Endpoints

- `POST /generate`: Handles image upload and transformation
  - Accepts: image file and optional role selection
  - Returns: transformed image URLs, role, and power scores

## Project Structure

```
NFTer/
├── backend/                 # FastAPI application
│   ├── src/
│   │   └── nfter/         # Main application code
│   │       ├── app.py     # FastAPI application
│   │       ├── config.py  # Configuration settings
│   │       └── utils.py   # Utility functions
│   ├── tests/             # Test files
│   ├── pyproject.toml     # Python dependencies and project config
│   └── .env              # Backend environment variables
│
├── frontend/               # React application
│   ├── src/              # React source code
│   │   ├── components/   # React components
│   │   ├── pages/       # Page components
│   │   ├── lib/         # Utility functions
│   │   └── App.tsx      # Main React component
│   ├── package.json     # Node.js dependencies
│   └── .env            # Frontend environment variables
│
└── README.md             # This file
```

## Prerequisites

### Backend

- Python 3.8 or higher
- A Replicate API token (get one at [replicate.com](https://replicate.com))

### Frontend

- Node.js 16 or higher
- npm or yarn

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/NFTer.git
cd NFTer
```

2. Set up the backend:

```bash
# Create and activate virtual environment
cd backend
python -m venv .venv
source .venv/bin/activate  # or .\venv\Scripts\activate on Windows

# Install dependencies
pip install -e ".[dev]"

# Create .env file
echo "REPLICATE_API_TOKEN=your_token_here" > .env
```

3. Set up the frontend:

```bash
# Install dependencies
cd frontend
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:5000" > .env
```

## Running the Application

1. Start the backend (port 5000):

```bash
cd backend
source .venv/bin/activate  # or .\venv\Scripts\activate on Windows
uvicorn src.nfter.app:app --reload --port 5000
```

2. In a new terminal, start the frontend (port 5173):

```bash
cd frontend
npm run dev
```

3. Access the applications:

- Frontend: Open your web browser and navigate to `http://localhost:5173`
- Backend API documentation: Visit `http://localhost:5000/docs`

## Development

### Backend Development

- The FastAPI backend runs on port 5000
- API documentation available at `http://localhost:5000/docs`
- Uses pytest for testing
- Type checking with mypy

### Frontend Development

- React development server runs on port 5173
- Uses Vite for fast development
- Hot module replacement enabled
- TypeScript for type safety
- Tailwind CSS for styling
- Shadcn UI components
- API requests are automatically proxied to the backend via Vite's proxy configuration

## Environment Variables

### Backend (.env in backend/ directory)

```
REPLICATE_API_TOKEN=your_token_here
```

### Frontend (.env in frontend/ directory)

```
# Development: No environment variables needed
# Production: Set your deployed backend URL
VITE_API_URL=http://localhost:5000  # Development
# VITE_API_URL=https://your-backend-url.com  # Production
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Replicate](https://replicate.com) for the AI model
- [FastAPI](https://fastapi.tiangolo.com/) web framework
- [React](https://reactjs.org/) frontend library
- [Shadcn UI](https://ui.shadcn.com/) for UI components
- [Tailwind CSS](https://tailwindcss.com/) for styling

## Deployment

### Important Note

This project requires separate deployments for the frontend and backend:

- Frontend: Deploy to Vercel
- Backend: Deploy to a Python-compatible hosting service

### Backend Deployment

The backend must be deployed to a Python-compatible hosting service that can run FastAPI applications. Some options include:

- [Railway](https://railway.app/)
- [Render](https://render.com/)
- [Heroku](https://www.heroku.com/)
- [DigitalOcean](https://www.digitalocean.com/)

1. Set up your environment variables:

   - `REPLICATE_API_TOKEN`: Your Replicate API token

2. Deploy your FastAPI application:

   ```bash
   # Example using uvicorn in production
   uvicorn src.nfter.app:app --host 0.0.0.0 --port $PORT
   ```

3. After deployment, note your backend URL (e.g., `https://your-backend-url.com`)

### Frontend Deployment (Vercel)

1. Create a new project in Vercel and connect your repository

2. Configure environment variables in Vercel:

   - `VITE_API_URL`: Your deployed backend URL from step 3 above

3. Build settings:

   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Root Directory: `frontend` (important: specify the frontend directory)

4. Deploy your application

### Production Considerations

- Update CORS settings in the backend to allow requests from your Vercel frontend domain
- Ensure all API endpoints are properly secured
- Set up proper error handling and logging
- Consider using environment-specific configuration files
- Make sure your backend service can handle the expected load

## Sui Client Setup (for Devnet v1.48.0)

These instructions will guide you through setting up the Sui client for interacting with the devnet.

1.  **Create a `bin` directory in your project:**
    If you don't already have it, create a directory to store the Sui client binary.

    ```bash
    mkdir -p ~/projects/NFTer/nfter-next/bin
    ```

2.  **Download the Sui Client:**
    Download the specified version of the Sui client for Ubuntu x86_64.

    ```bash
    wget https://github.com/MystenLabs/sui/releases/download/devnet-v1.48.0/sui-devnet-v1.48.0-ubuntu-x86_64.tgz -P ~/Downloads
    ```

3.  **Extract the Archive:**
    Navigate to your Downloads directory (or wherever you saved the file) and extract the archive.

    ```bash
    cd ~/Downloads
    tar -xzf sui-devnet-v1.48.0-ubuntu-x86_64.tgz
    ```

4.  **Move the Sui Binary:**
    Move the `sui` executable from the extracted folder to your project's `bin` directory.

    ```bash
    mv sui-devnet-v1.48.0-ubuntu-x86_64/sui ~/projects/NFTer/nfter-next/bin/
    ```

5.  **Update your PATH in `.bashrc`:**
    Add your project's `bin` directory to your PATH environment variable so you can run the `sui` command from anywhere. Open your `.bashrc` file with a text editor (e.g., `nano`, `vim`, `gedit`):

    ```bash
    nano ~/.bashrc
    ```

    Add the following line at the end of the file:

    ```bash
    export PATH="~/projects/NFTer/nfter-next/bin:$PATH"
    ```

    Save the file and exit the editor.

6.  **Apply Changes to `.bashrc`:**
    Source your `.bashrc` file to apply the changes to your current terminal session.

    ```bash
    source ~/.bashrc
    ```

7.  **Verify Installation:**
    Check if the Sui client is correctly installed and in your PATH.

    ```bash
    sui --version
    ```

    You should see an output like `sui devnet-v1.48.0-...`.

After these steps, you'll have the Sui client ready to use for deploying and interacting with your Move contracts on the devnet.

## Devnet Deployment & Initialization

Once your Sui client is set up (see "Sui Client Setup" section) and your `nfter.move` contract compiles successfully (`sui move build --dev` in the `move` directory), follow these steps to deploy to devnet, initialize your collection, and make it available for public minting.

**1. Pre-flight Checks:**

- **Ensure Active Environment is Devnet:**

  ```bash
  sui client active-env
  ```

  If it's not devnet, switch:

  ```bash
  sui client switch --env devnet
  ```

- **Check Active Address & Gas:**
  Ensure your active address (which will be the admin/owner of the collection initially) has SUI tokens on devnet.
  ```bash
  sui client active-address
  sui client gas
  ```
  If you need SUI, use the devnet faucet. Replace `YOUR_SUI_ADDRESS` with the output from `sui client active-address`:
  ```bash
  curl --location --request POST 'https://faucet.devnet.sui.io/gas' --header 'Content-Type: application/json' --data-raw '{"FixedAmountRequest":{"recipient":"YOUR_SUI_ADDRESS"}}'
  ```

**2. Publish the Contract:**

Navigate to your `move` directory in the terminal:

```bash
cd /path/to/your/project/NFTer/move
# Or if you are already in the project root: cd move
```

Then, publish the contract:

```bash
sui client publish --gas-budget 500000000 --json
```

- **IMPORTANT:** From the JSON output of this command, carefully note down the `packageId`. You will need this for the next steps.
  Look for a section similar to:
  ```json
  // ...
  "effects": {
    // ...
    "created": [
      // ... other created objects ...
      {
        "owner": {
          "Immutable": true
        },
        "reference": {
          "objectId": "0x_YOUR_PACKAGE_ID", // <-- This is it!
          "version": "1",
          "digest": "..."
        }
      }
    ]
    // ...
  }
  // ...
  ```
  The `objectId` of the immutable created object is your `packageId`.

**3. Initialize the Collection:**

Use the `packageId` you just obtained. The following command calls the `init_collection` function in your contract.

- **Parameters to decide:**
  - `MINT_FEE_MIST`: Minting fee in MIST (1 SUI = 1,000,000,000 MIST). E.g., `1000000` for 0.001 SUI.
  - `PROMPT_UPDATE_FEE_MIST`: Fee to update the advisor prompt, in MIST. E.g., `500000` for 0.0005 SUI.

Replace `<YOUR_PACKAGE_ID>`, `<MINT_FEE_MIST>`, and `<PROMPT_UPDATE_FEE_MIST>` with your actual values:

```bash
sui client call --package <YOUR_PACKAGE_ID> --module nfter --function init_collection \
    --args "Offbrand Crypto" "The official collection of Offbrand Crypto NFTs, uniquely generated and ready for the 8-Bit Oracle." <MINT_FEE_MIST> <PROMPT_UPDATE_FEE_MIST> \
    --gas-budget 100000000 --json
```

- **IMPORTANT:** From the JSON output of this command, find the `objectId` of the newly created `OffbrandCollection` object. Look for it in the `created` section of the `effects`.
  This will be your `collectionId` (or `COLLECTION_OBJECT_ID`).

**4. Share the Collection Object:**

This step is **CRITICAL** to allow the public to mint NFTs into your collection. The admin (current owner of the collection object) must share it.

Replace `<YOUR_COLLECTION_OBJECT_ID>` with the ID you obtained from the previous step:

```bash
sui client transfer --to-shared --object-id <YOUR_COLLECTION_OBJECT_ID> --gas-budget 100000000
```

After this, your `OffbrandCollection` is shared and publicly accessible for minting (via the `mint_nft` function) and for other interactions defined in your contract that use the shared collection object ID.

**Next Steps (CLI Testing - Recommended):**

Before integrating with the frontend, it's highly recommended to test minting and other functions via the CLI to ensure everything works as expected.

- **To Mint an NFT (Example):**
  You'll need your shared `<YOUR_COLLECTION_OBJECT_ID>`, and details for the NFT.

  ```bash
  # Example parameters (replace with actuals)
  NFT_NAME="My First Offbrand"
  NFT_DESCRIPTION="A unique piece of digital art"
  ROYALTY_RECIPIENT_ADDRESS="0x_YOUR_SUI_ADDRESS_FOR_ROYALTIES_OR_MINTER_ADDRESS"
  ROYALTY_PERCENTAGE=100 # For 100%
  ORACLE_BASE_PROMPT="Advise on the nature of creativity"
  ORACLE_STYLE_PROMPT="In a cryptic tone"
  WALRUS_BLOB_ID="your_walrus_blob_id_here"
  IMAGE_URL="https://walrus.xyz/blob/your_walrus_blob_id_here"
  IMAGE_GEN_PROMPT="A pixel art wizard contemplating an orb"
  MODEL_VERSION="sdxl-v1.0"
  GENERATION_PARAMS='{}' # JSON string of other params
  ATTRIBUTE_NAMES='["rarity","power_level"]' # JSON-style string array for CLI
  ATTRIBUTE_VALUES='["epic","9001"]'     # JSON-style string array for CLI
  COIN_FOR_PAYMENT="0x_ID_OF_A_COIN_YOU_OWN_WITH_SUFFICIENT_BALANCE"

  sui client call --package <YOUR_PACKAGE_ID> --module nfter --function mint_nft \
      --args <YOUR_COLLECTION_OBJECT_ID> "${NFT_NAME}" "${NFT_DESCRIPTION}" \
      "[${ROYALTY_RECIPIENT_ADDRESS}]" "[${ROYALTY_PERCENTAGE}]" \
      "${ORACLE_BASE_PROMPT}" "${ORACLE_STYLE_PROMPT}" \
      "${WALRUS_BLOB_ID}" "${IMAGE_URL}" \
      "${IMAGE_GEN_PROMPT}" "${MODEL_VERSION}" "${GENERATION_PARAMS}" \
      "${ATTRIBUTE_NAMES}" "${ATTRIBUTE_VALUES}" \
      ${COIN_FOR_PAYMENT} \
      --gas-budget 200000000 --json
  ```

  Note the `objectId` of the newly created `OffbrandNFT` from the output.

Remember to replace placeholders like `<YOUR_PACKAGE_ID>` with the actual values you obtain during the process.

## Contract Features

- Single "Offbrand Crypto" collection
- AI-generated NFT minting with image metadata
- Updatable "8-Bit Oracle" advisor prompts
- On-chain royalties using Sui's TransferPolicy system
- Kiosk-compatible for marketplace integration
- Dynamic attributes for NFTs

## Prerequisites

- [Sui CLI](https://docs.sui.io/build/install)
- [Node.js](https://nodejs.org/) (for frontend)
- [pnpm](https://pnpm.io/) (for frontend)

## Contract Deployment

### 1. Build the Contract

```bash
cd move
sui move build
```

### 2. Deploy to Devnet

```bash
sui client publish --gas-budget 500000000
```

Note the `packageId` from the output. You'll need this for all subsequent commands.

### 3. Initialize Collection

```bash
sui client call \
  --package <PACKAGE_ID> \
  --module nfter \
  --function init_collection \
  --args \
    "Offbrand Crypto" \
    "The official collection of offbrand crypto NFTs" \
    1000000 \  # 0.001 SUI minting fee
    500000 \   # 0.0005 SUI prompt update fee
  --gas-budget 10000000
```

Note the `OffbrandCollection` object ID from the output. This is your `collectionId`.

### 4. Set Collection Royalties

The collection uses a shared TransferPolicy for all NFTs. To set the royalty rules:

```bash
sui client call \
  --package <PACKAGE_ID> \
  --module nfter \
  --function update_royalty_rules \
  --args \
    <COLLECTION_ID> \
    <TRANSFER_POLICY_ID> \
    <TRANSFER_POLICY_CAP_ID> \
    500 \     # 5% royalty (500 basis points)
    1000000 \ # 0.001 SUI minimum royalty
  --gas-budget 10000000
```

You can find the `TRANSFER_POLICY_ID` in the collection object's `transfer_policy_id` field. The `TRANSFER_POLICY_CAP_ID` is the ID of the TransferPolicyCap that was transferred to you during collection initialization.

## Frontend Development

### 1. Install Dependencies

```bash
cd frontend
pnpm install
```

### 2. Configure Environment

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUI_NETWORK=testnet
NEXT_PUBLIC_PACKAGE_ID=<PACKAGE_ID>
NEXT_PUBLIC_COLLECTION_ID=<COLLECTION_ID>
```

### 3. Run Development Server

```bash
pnpm dev
```

## Minting NFTs

### 1. Prepare Image

Upload your image to Walrus and note the `walrus_blob_id` and `image_url`.

### 2. Mint NFT

```bash
sui client call \
  --package <PACKAGE_ID> \
  --module nfter \
  --function mint_nft \
  --args \
    <COLLECTION_ID> \
    "NFT Name" \
    "NFT Description" \
    ["0xRECIPIENT_ADDRESS"] \  # Royalty recipient
    [100] \                    # 100% royalty percentage
    "Base Prompt" \
    "Style Prompt" \
    <WALRUS_BLOB_ID> \
    <IMAGE_URL> \
    "Generation Prompt" \
    "Model Version" \
    "Generation Params" \
    [] \                       # Attribute names
    [] \                       # Attribute values
    <PAYMENT_COIN_ID> \
  --gas-budget 10000000
```

## Updating NFT Prompts

```bash
sui client call \
  --package <PACKAGE_ID> \
  --module nfter \
  --function update_prompt \
  --args \
    <COLLECTION_ID> \
    <NFT_ID> \
    "New Base Prompt" \
    "New Style Prompt" \
    <PAYMENT_COIN_ID> \
  --gas-budget 10000000
```

## Marketplace Integration

Our NFTs are kiosk-compatible and can be listed on any Sui marketplace that uses the Kiosk system. See [Kiosk Integration ADR](docs/adr/0002-kiosk-integration.md) for details.

## Testing

### 1. Unit Tests

```bash
cd move
sui move test
```

### 2. Kiosk Compatibility Test

```bash
# Create a kiosk
sui client call --package 0x2 --module kiosk --function create --gas-budget 10000000

# List an NFT
sui client call --package 0x2 --module kiosk --function list \
  --args <KIOSK_ID> <NFT_ID> <PRICE> --gas-budget 10000000
```

## Architecture

- [NFT Contract Design ADR](docs/adr/nft-contract-design.md)
- [Kiosk Integration ADR](docs/adr/0002-kiosk-integration.md)

## License

MIT

**DEVNET**

```
Summary of deployed assets:
  Package ID:         0x4448d95a34e3d103f628fad9265358ea4802c661d9b107191912b30dddfff2ee
  Collection ID:      0x48df38789f69e5e31cb6095fc282f54c51fc411fb5469e4b1f87161e2e224fba
  TransferPolicy ID:  0x96b22d351b70fee01e1d35e45b1b2f7f8f983f038266f9df343b1ae94a6ff906
  TransferPolicyCap ID: 0x8cc9663c39ab966a896ce09b9b87c2c79d205923528ea9aabbed7516116f3fb7
```

**TESTNET**

```
--- All done! ---
Summary of deployed assets:
  Package ID:         0x2dbfd7c0968648c3480d51aead63256281883358f6f19e04fa037af505ebd977
  Collection ID:      0x86017d2f0888d10c0567e310624edd90402c8f105bcd830a5af24a7680584e58
  TransferPolicy ID:  0x98b0d473b8b0ee6e833ca2daa7dc6ba95b2333a5dfece743474de374524657da
  TransferPolicyCap ID: 0x3f70d90ad33f05f08f9fd326d94a65614e3730886ce1b8c0221982e0537bba83
```

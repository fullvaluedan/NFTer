module nfter::nfter {
    use std::string::{Self, String};
    use sui::package;
    use sui::sui::SUI;
    use sui::dynamic_field as df;
    use sui::coin::{Self, Coin};
    use sui::display;

    const IMAGE_METADATA_KEY: vector<u8> = b"image_metadata";
    const PROMPT_CONFIG_KEY: vector<u8> = b"prompt_config";

    /// The Offbrand Crypto collection
    public struct OffbrandCollection has key {
        id: object::UID,
        name: String,
        description: String,
        admin: address,
        total_minted: u64,
        minting_fee: u64,
        prompt_update_fee: u64,
    }

    /// An Offbrand Crypto NFT
    public struct OffbrandNFT has key, store {
        id: object::UID,
        name: String,
        description: String,
        creator: address,
        mint_number: u64,
        original_collection: String,
    }

    /// Dynamic attributes for NFTs
    public struct NFTAttribute has store {
        value: String,
        last_updated: u64,
    }

    /// Prompt configuration for 8bitoracle
    public struct PromptConfig has store {
        base_prompt: String,
        style_prompt: String,
        last_updated: u64,
        update_count: u64,
    }

    /// Image and generation metadata
    public struct ImageMetadata has store {
        walrus_blob_id: String,
        image_url: String,
        generation_prompt: String,
        model_version: String,
        generation_params: String,
        created_at: u64,
    }

    public struct NFTER has drop {}

    fun init(otw: NFTER, ctx: &mut tx_context::TxContext) {
        let publisher = package::claim(otw, ctx);
        let mut display = display::new<OffbrandNFT>(&publisher, ctx);

        display.add(string::utf8(b"name"), string::utf8(b"{name}"));
        display.add(string::utf8(b"description"), string::utf8(b"{description}"));
        display.add(string::utf8(b"mint_number"), string::utf8(b"{mint_number}"));
        display.add(string::utf8(b"original_collection"), string::utf8(b"{original_collection}"));
        display.add(string::utf8(b"image_url"), string::utf8(b"https://walrus.xyz/blob/{walrus_blob_id}"));
        display.add(string::utf8(b"generation_prompt"), string::utf8(b"{generation_prompt}"));
        display.add(string::utf8(b"model_version"), string::utf8(b"{model_version}"));
        display.add(string::utf8(b"created_at"), string::utf8(b"{created_at}"));
        display.add(string::utf8(b"project_url"), string::utf8(b"https://nfter.xyz"));
        display.add(string::utf8(b"creator"), string::utf8(b"{creator}"));
        
        display.update_version();

        transfer::public_transfer(publisher, ctx.sender());
        transfer::public_transfer(display, ctx.sender());
    }

    public entry fun init_collection(
        name: String,
        description: String,
        minting_fee: u64,
        prompt_update_fee: u64,
        ctx: &mut tx_context::TxContext
    ) {
        let collection = OffbrandCollection {
            id: object::new(ctx),
            name,
            description,
            admin: ctx.sender(),
            total_minted: 0,
            minting_fee,
            prompt_update_fee,
        };
        transfer::transfer(collection, ctx.sender());
    }

    public entry fun mint_nft(
        collection: &mut OffbrandCollection,
        name: String,
        description: String,
        original_collection: String,
        base_prompt: String,
        style_prompt: String,
        walrus_blob_id: String,
        image_url: String,
        generation_prompt: String,
        model_version: String,
        generation_params: String,
        attributes_names: vector<String>,
        attributes_values: vector<String>,
        mut payment: Coin<SUI>,
        ctx: &mut tx_context::TxContext
    ) {
        let fee = collection.minting_fee;
        assert!(coin::value(&payment) >= fee, 1);
        let fee_coin = coin::split(&mut payment, fee, ctx);
        transfer::public_transfer(fee_coin, collection.admin);
        transfer::public_transfer(payment, ctx.sender());

        let nft_id = object::new(ctx);
        let mut nft = OffbrandNFT {
            id: nft_id,
            name,
            description,
            creator: ctx.sender(),
            mint_number: collection.total_minted + 1,
            original_collection,
        };

        df::add(&mut nft.id, IMAGE_METADATA_KEY, ImageMetadata {
            walrus_blob_id,
            image_url,
            generation_prompt,
            model_version,
            generation_params,
            created_at: ctx.epoch(),
        });

        df::add(&mut nft.id, PROMPT_CONFIG_KEY, PromptConfig {
            base_prompt,
            style_prompt,
            last_updated: ctx.epoch(),
            update_count: 0,
        });

        let mut i = 0;
        let num_attributes = vector::length(&attributes_names);
        assert!(num_attributes == vector::length(&attributes_values), 2);
        while (i < num_attributes) {
            let attr_name = vector::borrow(&attributes_names, i);
            let attr_value = vector::borrow(&attributes_values, i);
            df::add<String, NFTAttribute>(&mut nft.id, *attr_name, NFTAttribute {
                value: *attr_value,
                last_updated: ctx.epoch(),
            });
            i = i + 1;
        };

        collection.total_minted = collection.total_minted + 1;
        transfer::transfer(nft, ctx.sender());
    }

    public fun get_image_metadata(nft: &OffbrandNFT): (String, String, String, String, String, u64) {
        let metadata: &ImageMetadata = df::borrow(&nft.id, IMAGE_METADATA_KEY);
        (
            metadata.walrus_blob_id,
            metadata.image_url,
            metadata.generation_prompt,
            metadata.model_version,
            metadata.generation_params,
            metadata.created_at
        )
    }

    public entry fun update_prompt(
        collection: &OffbrandCollection,
        nft: &mut OffbrandNFT,
        new_base_prompt: String,
        new_style_prompt: String,
        mut payment: Coin<SUI>,
        ctx: &mut tx_context::TxContext
    ) {
        let fee = collection.prompt_update_fee;
        assert!(coin::value(&payment) >= fee, 1);
        let fee_coin = coin::split(&mut payment, fee, ctx);
        transfer::public_transfer(fee_coin, collection.admin);
        transfer::public_transfer(payment, ctx.sender());

        let prompt_config: &mut PromptConfig = df::borrow_mut(&mut nft.id, PROMPT_CONFIG_KEY);
        prompt_config.base_prompt = new_base_prompt;
        prompt_config.style_prompt = new_style_prompt;
        prompt_config.last_updated = ctx.epoch();
        prompt_config.update_count = prompt_config.update_count + 1;
    }

    public fun get_prompt_config(nft: &OffbrandNFT): (String, String, u64, u64) {
        let prompt_config: &PromptConfig = df::borrow(&nft.id, PROMPT_CONFIG_KEY);
        (
            prompt_config.base_prompt,
            prompt_config.style_prompt,
            prompt_config.last_updated,
            prompt_config.update_count
        )
    }

    public entry fun update_attribute(
        nft: &mut OffbrandNFT,
        attribute_name: String,
        new_value: String,
        ctx: &mut tx_context::TxContext
    ) {
        assert!(ctx.sender() == nft.creator, 0);
        let attr: &mut NFTAttribute = df::borrow_mut(&mut nft.id, attribute_name);
        attr.value = new_value;
        attr.last_updated = ctx.epoch();
    }

    public fun get_attribute(nft: &OffbrandNFT, attribute_name: String): (String, u64) {
        let attr: &NFTAttribute = df::borrow(&nft.id, attribute_name);
        (attr.value, attr.last_updated)
    }

    public fun get_collection_info(collection: &OffbrandCollection): (String, String, address, u64, u64, u64) {
        (
            collection.name,
            collection.description,
            collection.admin,
            collection.total_minted,
            collection.minting_fee,
            collection.prompt_update_fee
        )
    }
} 
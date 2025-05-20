Gaming on Sui
Gaming on Sui leverages blockchain technology to enhance in-game economies, ownership, and interactions. With features like dynamic NFTs, kiosks, soulbound assets, and on-chain randomness, Sui provides builders with the tools to create immersive, transparent, and fair gaming experiences. Players benefit from true asset ownership, decentralized marketplaces, and seamless Web3 integration without compromising usability.

This topic explores the key features of Sui for gaming, real-world use cases, and essential tools for builders. Whether you're building an RPG, a racing game, or a digital card game, Sui provides the Web3 infrastructure to power your next-generation gaming projects.

Representing in-game objects on chain
One of the aspects that defines a Web3 game is having objects within the game reside on a blockchain. Whether it's in-game currency, battle passes, skins, or any number of other objects, knowing how to create and integrate these items is the first step in building the desired user experience on Sui.

In-game currencies
In-game currencies allow users to purchase game features like items, upgrades, and premium content. Before Web3, these currencies remained only in the game and their values were set by the game developers.

Using Sui, players can now have true ownership of their in-game currency. The currency exists as a token on the Sui blockchain, where players can conceivably buy, sell, or swap that currency for anything else that also lives on chain. If you create an ecosystem of games, players can purchase currency in one of your games but spend it in another one that also uses that same currency. The possibilities are vast, but you must first learn how to create the currency. The following topics can get you started.

Coin Standard
In-Game Currency
Tokens
Similar to in-game currencies, tokens provide a level of engagement and control integrated into the game experience that isn't possible without Web3. For example, you can create tokens associated with your game that reward loyalty amongst your user base. You can also produce regulated tokens that allow the bearer of a specific capability to control the addresses that have access to the token, facilitating gated access to special events, leagues, or other game features. The following topics provide more insight into tokens on Sui.

Regulated Coin and Deny List
Loyalty Tokens
Closed-Loop Token
Game features
NFTs are able to represent many traditional game features. For example, in-game objects, battle passes, rewards, skins, game cards or keys, and loot boxes are just a few of the features that you can create using NFTs on Sui. The following topics and sections provide more details.

Create a Non-Fungible Token
Soulbound assets
Game economies
Sui Object Display
Dynamic assets
On Sui, everything is an object and all objects are NFTs. For the purpose of the gaming discussion, you can also think of these NFTs as game assets.

You can view an object on Sui as a key-value pair data structure. In Move, the smart contract language of Sui, objects are defined as a struct. As an example, consider the game board of a tic-tac-toe game:

examples/tic-tac-toe/move/sources/owned.move
public struct Game has key, store {
id: UID,
board: vector<u8>,
turn: u8,
x: address,
o: address,
admin: vector<u8>,
}

The first key-value pair for any object is id: address, which is a unique value of type UID. Every object has a different address, which is why every object is an NFT because this mandatory key-value pair sets each object apart and makes it unique.

Creating assets
Smart contracts contain the functions that create objects. Using the previous example, the function (new) that creates the object represented (a digital tic-tac-toe gameboard) provides the values for each attribute. The Sui framework creates the UID that uniquely identifies this particular game.

examples/tic-tac-toe/move/sources/owned.move
public fun new(x: address, o: address, admin: vector<u8>, ctx: &mut TxContext): Game {
let game = Game {
id: object::new(ctx),
board: vector[MARK__, MARK__, MARK__, MARK__, MARK__, MARK__, MARK__, MARK__, MARK__],
turn: 0,
x,
o,
admin,
};

    let turn = TurnCap {
        id: object::new(ctx),
        game: object::id(&game),
    };

    transfer::transfer(turn, x);
    game

}

This is an on-chain action, or transaction. In this case, the transaction is a request to the chain to create an object. You provide the necessary data to the function and pay the gas fee for the computation effort of the network validators. The result is the creation of a new NFT that exists on the Sui blockchain at the address (id).

Updating assets
On Sui, you can update an NFT asset using a separate transaction, provided the smart contract that defines the NFT allows it. Similar to creation, you provide data to the relevant update function and pay the gas fee, and the smart contract updates the object at the correct address with the new information.

Using the tic-tac-toe example, you might instruct the smart contract to update the gameboard object to place an x on an available square. Because the computation effort required for most updates is less than the effort to create the original object, the resulting gas fees are typically less, as well.

For more information on the computation of gas fees, see Sui Gas Pricing.

Composing assets
On Sui, you can include one object inside of another (dynamic fields). For example, an object named Parent might contain objects of type Child. The smart contract can provide the necessary functions to add and remove the child objects from their parents.

examples/move/dynamic_fields/sources/example.move
public struct Parent has key {
id: UID,
}

public struct Child has key, store {
id: UID,
count: u64,
}

The function to add child objects to a parent might resemble the following. In this case, ofield is an alias for the sui::dynamic_object_field package.

examples/move/dynamic_fields/sources/example.move
public fun add_child(parent: &mut Parent, child: Child) {
ofield::add(&mut parent.id, b"child", child);
}

You can apply dynamic fields to many use cases. An object named TicketBooth, for example, could contain objects of type ConcertTicket. An object of type Car might have a field named is_functioning that is false until all necessary objects (Engine, Tires, Body, Wheel) are present, at which point it can automatically update its is_functioning field to true.

Composability is a really important feature of Sui. While it provides many options when developing an idea on Sui, it also allows building on top of existing projects, using third-party assets in your project. This can range from “Only users who own a particular NFT are eligible for a discount” to full collaboration between two distinct projects and everything in between on the smart contract level.

Transfer to object
Sui enables more use cases with the transfer to object feature, which allows an owned object to be sent to another object (shared or owned). In this case, the sent object appears as owned by the parent object. In the above examples, the objects are wrapped inside other objects and this can be seen in the parent object's metadata when inspecting the parent object.

When an object is sent to another object, the metadata of the parent object remain the same, but its id has a new object. This feature can enable use cases such as on-chain wallets where a Wallet object is used to deposit other objects. Combining this with transfer to object can lead to complex and exciting use cases.

See Transfer to Object for more details on how to effectively transfer objects to other objects on Sui.

Deleting assets
On Sui, you can delete an object if the smart contract allows the operation. If the correct smart contract function is present, then you can delete the object in a single transaction. This results in a gas-fee rebate, which happens whenever bytes are freed on chain. The transaction's gas payer receives a rebate to account for the future storage of the object no longer being necessary but having already been paid for. See the Storage fund section in Tokenomics to learn more about rebates.

Soulbound assets
A soulbound asset is an NFT that belongs to an address and cannot be transferred or deleted. On Sui, assets are usually freely transferable between addresses, but this is undesirable behavior in some cases.

Assets such as game season passes, loyalty accrual assets, avatars, identification assets for a product, and assets that grant certain privileges at the smart contract level are well-suited to be bound to an address without the option of transfer or deletion.

On Sui, it is straightforward to implement such an asset, and the infrastructure guarantees that the desired behavior always holds.

You define an NFT asset as soulbound at the contract level. After designated as soulbound, it cannot be converted to a normal transferable asset. Changing it would require creating a new asset with the same name and a migration strategy, such as deleting the soulbound asset and creating a normal one to take its place.

Soulbound assets are created by omitting the store ability. Without this ability, you cannot store soulbound assets inside other objects. Keep this behavior in mind when deciding the asset type. This means that Soulbound assets are not fully composable; they can store other assets but cannot be stored inside other assets.

The same pattern can be used to implement NFT assets that are transferable/burnable only under certain circumstances. You can define these circumstances at the smart contract level by making the asset soulbound and defining custom transfer and burn functions.

Sui Object Display
The Sui Object Display standard is a tool that helps define how objects appear in apps and interfaces. It works like a template where you can insert data from an object to control how it's displayed. Use it to manage how different types of data are shown, even if the data itself is stored on chain while the display happens off chain (in apps or websites).

The Sui Object Display standard provides several key benefits and components:

Controlled representation: Manages how assets are displayed online without directly interacting with the underlying asset. You can make updates to the display independent of the assets and affect how all assets of type <T> are displayed.
Flexibility: No limits on the fields you can customize.
Enhancing asset information: Similar to enhancing ERC721 or ERC1155 NFTs with extra details, the Sui Object Display allows you to add specific details to your digital items, such as names, descriptions, images, and more.
Stored data and off-chain representation: Manages stored data based on metadata standards and controls how it's represented off chain.
Dynamic display: Ensures a uniform presentation of shared attributes across all NFTs of type <T>, maintaining a consistent representation of common fields (such as image URLs derived from unique IDs) and a cohesive display format across the asset collection.
There are a few limitations to be aware of. First, the current structure of Sui Object Display is per type, limiting its scope. Secondly, its structure does not allow for nested attributes or enums.

Implementation overview
At a high level, you implement this feature using the following steps:

Use a Publisher object you own to set sui::display for a specific type.
Sui Move's Display<T> defines how different types look. For example, Display<0x2::capy::Capy> shapes the appearance of a type.
Sui Full nodes use Display definitions to organize data when requested with { showDisplay: true } in queries.
A display is a map of keys and values, both strings. Values allow for string interpolation, meaning the value changes dynamically depending on the NFT being viewed.

A basic example is to create a Display for Asset objects:

public struct Asset has key, store {
id: "0x3301",
expiration: 123456789
}

public struct Display has store {
"random_field": "The id is {id} and it expires at {expiration}"
}

The above Display as is defined, for the example Asset will become:

Display
{
"random_field": "The id is 0x3301 and it expires at 123456789"
}

For another Asset, the id and expiration values change according to the new Assets values.

An app can use the Display object, where any custom keys can be understood. By default, most third-party apps like explorers or wallets recognize the attributes described below.

name: A name for the object, displayed when users view the object.
description: A description for the object, displayed when users view the object.
link: A link to the object for use in an application.
image_url: A URL or a blob with the image for the object.
thumbnail_url: A URL to a smaller image for use in wallets, explorers, and other products as a preview.
project_url: A link to a website associated with the object or creator.
creator: A string indicating the object creator.
See Sui Object Display for more details on the standard.

Game economies
Designing and managing tokens and coins on the Sui blockchain is crucial to creating a viable game economy.

GameFi
GameFi (Gaming Finance) combines gaming with blockchain-based financial incentives. It provides players with economic benefits through token rewards for in-game achievements. The recent rise of GameFi has led to significant growth in token launches to support gaming ecosystems.

The terms that follow are frequently used when discussing GameFi, so it's important to make sure your definition of the terms match the documentation.

Token generation event (TGE): The first creation and distribution of tokens.
Initial coin offering (ICO): An early fundraising model using token sales.
Vesting: The gradual release of tokens over time.
Staking: Locking tokens to participate in network operations and earn rewards.
Cliff: An initial waiting period before token vesting begins.
Annual percentage yield (APY): The effective return on a staked asset over a year.
Decentralized autonomous organization (DAO): A governance model where decisions are made using smart contracts and tokens.
Governance token: A token granting voting power in decentralized networks.
Token economics (Tokenomics)
Tokenomics refers to the model and design of the rules that govern tokens for a Web3 ecosystem. In the case of GameFi, it defines how a token is created, distributed, utilized, and maintained within your gaming platform. Some of the features that comprise a token's economics include supply details, distribution mechanisms, staking and vesting.

There are several types of token supply that are considered when discussing tokenomics for an on-chain ecosystem.

Supply type Description
Total supply Maximum number of tokens that will ever exist.
Circulating supply Tokens currently in use and available for trading.
Adjusted supply Tokens adjusted after burning or minting events.
Fixed supply A predetermined number of tokens with no future changes.
There is more than one type of distribution mechanics, but they are not necessarily all used.

Distribution mechanisms Description
Initial distribution Through ICO, TGE, airdrops, or private sales.
Ongoing distribution Through staking, liquidity mining, or incentive programs.
Ongoing distribution refers to staking and vesting of GameFi tokens. Not all game economies include staking or vesting models. When deciding whether yours should, consider the benefits:

Encourages long-term participation.
Reduces circulating supply, potentially stabilizing token prices.
Rewards active participants in the ecosystem.
Rewards team members over the course of their involvement.
To learn more about token vesting strategies, see Token Vesting Strategies.

When deciding how best to launch your tokens, it's important to consider some key points:

Should you go with a fixed or adjusted supply of coins? A fixed supply means all tokens mint at the TGE. Adjusted supply requires careful control over minting and burning functions.
Does your token need to be regulated? A regulated coin provides greater control over who has access to your token but comes at the cost of additional maintenance of a deny list. You can learn more about regulated tokens at Regulated Coin and Deny List.
Consider your metadata requirements, as well.
Decimal places: Predefine precision of the token.
Metadata management: Determine if metadata should be immutable.
Burning mechanisms: Define rules for token burning.
Kiosk
On Sui, owned objects are either freely transferable or non-transferable. To ensure royalties, Sui provides a standard called Kiosk. A kiosk is a shared object that restricts access to a single address or user. See Sui Kiosk for an in-depth look at the Kiosk standard.

The kiosk "owner" (although a shared object has no owner from the perspective of Sui, the smart contract ensures that only one address is permitted to access it) is allowed to:

Place Assets from their address inside the Kiosk.
Take Assets from the Kiosk back to their address.
Lock Assets from their address or already placed inside the Kiosk, making the “take” operation impossible.
Destroy a Kiosk that has no Assets inside.
List an Asset for sale with a price denoted in SUI.
List an Asset for sale only to a specific address, with the price denoted in SUI.
Any other address is allowed to:

Buy an item that has undergone the “list” operation.
Buy an item meant for a specific address if the asset was “listed” in such a way.
The adoption of Kiosks implies that marketplaces become aggregators of “listed” items inside different Kiosks.

An Asset that has undergone the “lock” operation cannot undergo the “take” operation anymore; it can only undergo the “list” operation.

Transfer Policy
The “buy” operation requires the use of another Object called Transfer Policy. This is usually a Shared Object and contains Rules that govern the “buy” operation, the most common Rule being “Royalties.”

A “buy” operation cannot be completed for an Asset without a defined Transfer Policy.

An empty Transfer Policy, one that does not have Rules, means that the Asset is freely tradable. Since Kiosk only allows the “list” and “buy” pair of operations, a transfer is possible by setting the price to 0 SUI.

Rules can be anything programmable with Move. To use marketplaces, an Asset creator should use Rules defined in https://github.com/MystenLabs/apps/tree/main/kiosk/sources/rules

Common Rules include:

Royalty Rule: A percentage of the price that goes to the Asset creator (practically it goes inside the Transfer Policy and the creator may transfer it at any point in time).
Floor Price Rule: A minimum price that an Asset may be “listed” for.
Lock Rule: Enforce the Asset to be locked inside a Kiosk after a “buy” operation.
The combination of the Lock Rule and the Royalty Rule enforces royalties to be paid to the creator. The Lock Rule ensures an Asset cannot be “taken” out of a Kiosk (to be freely traded), while the Royalty Rule ensures that any Asset traded through Kiosk will have royalties deducted from the transaction.

Adding the Lock Rule is recommended when royalties are a strict requirement. As long as marketplaces support only Kiosk on Sui, even without the Lock Rule, users may not have other options. It is safe to assume that peer-to-peer trading is unsafe, and most, if not all, users will avoid it since there is no way to ensure the transaction will take place smoothly. In peer-to-peer transactions, someone has to initiate either the Asset transfer or the payment transfer, and there are no guarantees that the follow-up will take place.

The most important thing is during the initial airdrop or minting of the asset to ensure the Asset is put inside a Kiosk and not sent to an address directly.

  
// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.6.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";
import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract BetterNFT is 
  Context,
  AccessControlEnumerable,
  ERC721Enumerable,
  ERC721Burnable,
  ERC721Pausable
{
  using Counters for Counters.Counter;

  uint256 public maxTokenSupply;
  uint256 public mintPrice = 0.1 ether;

  Counters.Counter private _tokenIdTracker;
  string private _baseTokenURI;
  bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");


  constructor(
    string memory name,
    string memory symbol,
    string memory baseTokenURI,
    uint256 maxSupply
  ) ERC721(name, symbol) {
    _baseTokenURI = baseTokenURI;

    _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());

    _setupRole(PAUSER_ROLE, _msgSender());

    maxTokenSupply = maxSupply;
  }

  function _baseURI() internal view virtual override returns (string memory) {
    return _baseTokenURI;
  }


  function setMintPrice(uint256 newPrice) public onlyRole(DEFAULT_ADMIN_ROLE) {
    mintPrice = newPrice;
  }

  function setMaxTokenSupply(uint256 maxColonistSupply) public onlyRole(DEFAULT_ADMIN_ROLE) {
    maxTokenSupply = maxColonistSupply;
  }

  function mint() public payable {
    require(_tokenIdTracker.current() + 1 <= maxTokenSupply, "Purchase would exceed max available colonists");
    require(mintPrice <= msg.value, "Ether value sent is not correct");
    
    _safeMint(msg.sender, _tokenIdTracker.current());
    _tokenIdTracker.increment();
  }

  /**
    * @dev Pauses all token transfers.
    *
    * See {ERC721Pausable} and {Pausable-_pause}.
    *
    * Requirements:
    *
    * - the caller must have the `PAUSER_ROLE`.
    */
  function pause() public virtual {
    require(hasRole(PAUSER_ROLE, _msgSender()), "ERC721: must have pauser role to pause");
    _pause();
  }

  /**
    * @dev Unpauses all token transfers.
    *
    * See {ERC721Pausable} and {Pausable-_unpause}.
    *
    * Requirements:
    *
    * - the caller must have the `PAUSER_ROLE`.
    */
  function unpause() public virtual {
    require(hasRole(PAUSER_ROLE, _msgSender()), "ERC721: must have pauser role to unpause");
    _unpause();
  }

  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 tokenId
  ) internal virtual override(ERC721, ERC721Enumerable, ERC721Pausable) {
    super._beforeTokenTransfer(from, to, tokenId);
  }

  /**
    * @dev See {IERC165-supportsInterface}.
    */
  function supportsInterface(bytes4 interfaceId)
    public
    view
    virtual
    override(AccessControlEnumerable, ERC721, ERC721Enumerable)
  returns (bool) {
      return super.supportsInterface(interfaceId);
  }
}
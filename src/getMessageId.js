const { parseAbiItem } = require('viem');
const { 
  DEPOSITOR_ADDRESS,
  SEPOLIA
} = require('./data');
const { defineChain, createPublicClient, http } = require('viem');

const sepolia = defineChain({
  id: 11_155_111,
  name: 'Sepolia',
  nativeCurrency: { name: 'Sepolia Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: {
      http: [SEPOLIA],
    },
  },
  blockExplorers: {
    default: {
      name: 'Etherscan',
      url: 'https://sepolia.etherscan.io',
      apiUrl: 'https://api-sepolia.etherscan.io/api',
    },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 751532,
    },
    ensRegistry: { address: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e' },
    ensUniversalResolver: {
      address: '0xc8Af999e38273D658BE1b921b88A9Ddf005769cC',
      blockCreated: 5_317_080,
    },
  },
  testnet: true,
})

const execution = async () => {  
  

  // new const eventNFTDeposit = parseAbiItem('event NFTDeposit(address indexed nftAddress, address indexed owner, uint256 indexed tokenId, bytes32 messageId, uint256 startedTime, uint256 expiredTime)');
  
  const eventNFTDeposit = parseAbiItem(
    'event NFTDeposit(address indexed nftAddress, address indexed owner, uint256 tokenId, uint256 startedTime, uint256 expiredTime)'
  )
  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(),
  })
  
  const filter = await publicClient.createEventFilter({
    address: DEPOSITOR_ADDRESS,
    event: eventNFTDeposit,
    fromBlock: 8613223n,
    // args: {
    //   nftAddress,
    //   owner,
    //   tokenId
    // }
  })

  const logs = await publicClient.getFilterLogs({ filter })

  console.log(logs)
};

execution().catch((error) => {
  console.error('Error contract:', error);
});
 

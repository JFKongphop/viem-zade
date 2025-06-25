const { parseUnits, formatUnits } = require('viem');
const { 
  publicClient,
  walletClient,
  OWNER_ADDRESS,
  NFT_ADDRESS,
  NFT_ABI,
} = require('./data');

const execution = async () => {  
  const hash = await walletClient.writeContract({
    address: NFT_ADDRESS,
    abi: NFT_ABI,
    functionName: 'mint',
  });

  console.log(hash);

  const balance = await publicClient.readContract({
    address: NFT_ADDRESS,
    abi: NFT_ABI,
    functionName: 'balanceOf',
    args: [OWNER_ADDRESS]
  });

  console.log(balance)
};

execution().catch((error) => {
  console.error('Error contract:', error);
});
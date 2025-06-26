const { poseidon3 } = require('poseidon-lite');
const { toBytes32 } = require('./bytesConverter');
const { 
  walletClient,
  NFT_ADDRESS,
  NFT_ABI,
  DEPOSITOR_ABI,
  DEPOSITOR_ADDRESS,
  WITHDRAWER_ADDRESS
} = require('./data');

const execution = async () => {  
  const tokenId = 1;
  let hash = await walletClient.writeContract({
    address: NFT_ADDRESS,
    abi: NFT_ABI,
    functionName: 'approve',
    args: [DEPOSITOR_ADDRESS, tokenId]
  });

  console.log(hash);

  const secret1 = 1;
  const secret2 = 2;
  const loanAmount = 100;

  const commitment = toBytes32(poseidon3([secret1, secret2, loanAmount]));

  hash = await walletClient.writeContract({
    address: DEPOSITOR_ADDRESS,
    abi: DEPOSITOR_ABI,
    functionName: 'depositNft',
    args: [
      NFT_ADDRESS,
      tokenId,
      WITHDRAWER_ADDRESS,
      commitment
    ]
  });

  console.log(hash);
};

execution().catch((error) => {
  console.error('Error contract:', error);
});
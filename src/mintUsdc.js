const { parseUnits, formatUnits } = require('viem');
const { 
  publicClient,
  walletClient,
  OWNER_ADDRESS,
  USDC_ADDRESS,
  USDC_ABI,
} = require('./data');

const execution = async () => {  
  const amount = parseUnits('100', 18);

  const hash = await walletClient.writeContract({
    address: USDC_ADDRESS,
    abi: USDC_ABI,
    functionName: 'mint',
    args: [OWNER_ADDRESS, amount]
  });

  console.log(hash);

  const balance = await publicClient.readContract({
    address: USDC_ADDRESS,
    abi: USDC_ABI,
    functionName: 'balanceOf',
    args: [OWNER_ADDRESS]
  });

  console.log(formatUnits(balance, 18))
};

execution().catch((error) => {
  console.error('Error contract:', error);
});
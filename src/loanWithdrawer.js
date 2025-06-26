const { parseAbiItem } = require('viem');
const { bytes32ToBigInt, toBytes32 } = require('./bytesConverter');
const { poseidon2, poseidon3 } = require('poseidon-lite');
const { MerkleTree } = require('fixed-merkle-tree');
const { generateProof } = require('./circuit');

const {
  WITHDRAWER_ADDRESS,
  SCROLL,
  walletClient,
  WITHDRAWER_ABI
} = require('./data');
const { defineChain, createPublicClient, http } = require('viem');

const scroll = defineChain({
  id: 534_351,
  name: 'Scroll Sepolia',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: {
      http: [SCROLL],
    },
  },
  blockExplorers: {
    default: {
      name: 'Scrollscan',
      url: 'https://sepolia.scrollscan.com',
      apiUrl: 'https://api-sepolia.scrollscan.com/api',
    },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 9473,
    },
  },
  testnet: true,
});

const execution = async () => {    
  const eventLeafCommitment = parseAbiItem('event LeafCommitment(bytes32 indexed commitment, uint indexed leafIndex)');

  const publicClient = createPublicClient({
    chain: scroll,
    transport: http(),
  })

  const filter = await publicClient.createEventFilter({
    address: WITHDRAWER_ADDRESS,
    event: eventLeafCommitment,
    fromBlock: 10604488n,
  })

  const logs = await publicClient.getFilterLogs({ filter })
  const leaf = logs.map((x) => x.args.commitment);

  const leafLength = leaf.length;

  const leaves = [
    19014214495641488759237505126948346942972912379615652741039992445865937985820n,
    19014214495641488759237505126948346942972912379615652741039992445865937985820n,
    19014214495641488759237505126948346942972912379615652741039992445865937985820n,
    19014214495641488759237505126948346942972912379615652741039992445865937985820n
  ]
  
  for (let i = 0; i < leafLength; i++) {
    leaves[i] = bytes32ToBigInt(leaf[i]);
  }
  
  const tree = new MerkleTree(2, leaves, {
    hashFunction: (a, b) => poseidon2([a, b]),
    zeroElement: 0n
  });

  const nullifier = 1;
  const secret = 2;
  const loanAmount = 100;
  const commitment = poseidon3([nullifier, secret, loanAmount]);
  // const commitment = bytes32ToBigInt(leaf[0]);

  const { pathElements, pathIndices, pathRoot } = tree.proof(commitment);
  
  const input = {
    root: pathRoot.toString(),
    nullifier: commitment.toString(),
    secret: [nullifier, secret].map((x) => x.toString()),
    loanAmount: loanAmount.toString(),
    pathElements: pathElements.map((x) => x.toString()),    
    pathIndices: pathIndices.map((x) => x.toString())
  };  

  const parsed = await generateProof(input);

  const [a, b, c, publicOutput] = parsed;
  
  const rootBytes32 = toBytes32(pathRoot);

  const hash = await walletClient.writeContract({
    address: WITHDRAWER_ADDRESS,
    abi: WITHDRAWER_ABI,
    functionName: 'loanWithdraw',
    args: [
      rootBytes32,
      a, 
      b, 
      c,
      publicOutput
    ]
  });

  console.log(hash);
};

execution().catch((error) => {
  console.error('Error contract:', error);
});
 

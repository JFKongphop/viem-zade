const { createPublicClient, createWalletClient, http } = require('viem');
const { sepolia } = require('viem/chains');
const { privateKeyToAccount } = require('viem/accounts');
const dotenv = require('dotenv');
dotenv.config();

const { abi: USDC_ABI} = require('./abi/tokens/USDC.sol/USDC.json');
const { abi: NFT_ABI } = require('./abi/tokens/NFT.sol/NFT.json');
const { abi: DEPOSITOR_ABI } = require('./abi/NFTDepositor.sol/NFTDepositor.json');
const { abi: WITHDRAWER_ABI } = require('./abi/LoanWithdrawer.sol/LoanWithdrawer.json')

const PRIVATE_KEY = `0x${process.env.PRIVATE_KEY}`;
const OWNER_ADDRESS = process.env.OWNER_ADDRESS;
const RECEIVER_ADDRESS = process.env.DESINATION_ADDRESS;
const NFT_ADDRESS = process.env.NFT;
const USDC_ADDRESS = process.env.USDC_SEPOLIA;
const DEPOSITOR_ADDRESS = process.env.NFT_DEPOSITOR;
const WITHDRAWER_ADDRESS = process.env.LOAN_WITHDRAW;

const account = privateKeyToAccount(PRIVATE_KEY);

const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(),
});

const walletClient = createWalletClient({
  account,
  chain: sepolia,
  transport: http(),
});

module.exports = {
  publicClient,
  walletClient,
  OWNER_ADDRESS,
  RECEIVER_ADDRESS,
  NFT_ADDRESS,
  USDC_ADDRESS,
  USDC_ABI,
  NFT_ABI,
  DEPOSITOR_ABI,
  WITHDRAWER_ABI,
  DEPOSITOR_ADDRESS,
  WITHDRAWER_ADDRESS
}
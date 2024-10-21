"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const block_1 = __importDefault(require("./block"));
const transaction_1 = __importDefault(require("./transaction"));
class BlockChain {
    constructor(minerAddress) {
        this.blockTime = 5000;
        this.blockChainAddress = '0'.repeat(25) + 'BYTECHAIN';
        this.difficulty = 3;
        this.MiningReward = 1024;
        this.chain = [];
        this.transactionPool = [];
        this.minerAddress = minerAddress;
        this.GenesisBlock();
    }
    // Creating genesis block
    GenesisBlock() {
        const GenesisTransactionAmount = 1000000;
        const GenesisTransactionRecipient = '13sEjuBbarwqyVepXPWYFZd1UJa76BBa1B';
        const GenesisBlockPrevHash = '0'.repeat(64);
        const genesisTransaction = [
            new transaction_1.default(GenesisTransactionAmount, this.blockChainAddress, GenesisTransactionRecipient, '')
        ];
        const genesisBlock = new block_1.default(1, genesisTransaction, genesisTransaction.length, GenesisBlockPrevHash);
        genesisBlock.SetBlockProps(this.difficulty);
        this.chain.push(genesisBlock);
    }
    // Getting the last block in the chain
    GetLastBlock() {
        return this.chain[this.chain.length - 1];
    }
    // Creating and Adding a new transaction to the transaction pool
    AddNewTransaction(transaction, pubKey) {
        if (!(transaction instanceof transaction_1.default)) {
            throw new TypeError('Invalid transaction format');
        }
        if (!transaction.IsValidTransaction(pubKey)) {
            throw new Error('Invalid transaction');
        }
        this.transactionPool.push(transaction);
        return transaction;
    }
    // Creating a new block
    AddNewBlock() {
        const blockHeight = this.chain.length + 1;
        const transactions = this.transactionPool;
        const trxCount = transactions.length;
        const prevBlockHash = this.GetLastBlock().blockHash;
        const newBlock = new block_1.default(blockHeight, transactions, trxCount, prevBlockHash);
        newBlock.SetBlockProps(this.difficulty);
        // Reset transaction pool after block is added
        this.transactionPool = [];
        this.chain.push(newBlock);
        return newBlock;
    }
    // Mining a block
    Mine() {
        const MiningRewardTransaction = new transaction_1.default(this.MiningReward, this.blockChainAddress, this.minerAddress, '');
        this.AddNewTransaction(MiningRewardTransaction, '');
        const newBlock = this.AddNewBlock();
        return newBlock;
    }
    CalculateDifficulty() {
        const lastBlock = this.GetLastBlock();
        const prevLastBlock = this.chain[this.chain.length - 2];
        const diffInTime = lastBlock.timestamp - prevLastBlock.timestamp;
        if (this.difficulty < 1) {
            this.difficulty = 1;
        }
        if (this.difficulty > 5) {
            this.difficulty = 5;
        }
        if (diffInTime < this.blockTime) {
            this.difficulty = this.difficulty + 1;
        }
        else if (diffInTime > this.blockTime) {
            this.difficulty = this.difficulty - 1;
        }
        else {
            this.difficulty = this.difficulty;
        }
    }
    SyncBlocks(block) {
        // TODO: Implement block sync logic
    }
    // Validate the entire blockchain
    IsChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const prevBlock = this.chain[i - 1];
            if (!(currentBlock instanceof block_1.default) || !(prevBlock instanceof block_1.default)) {
                return false;
            }
            if (!currentBlock.blockHash) {
                return false;
            }
            if (currentBlock.prevBlockHash !== prevBlock.blockHash) {
                return false;
            }
        }
        return true;
    }
}
exports.default = BlockChain;

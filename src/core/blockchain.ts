import Block from './block';
import Transaction from './transaction';

class BlockChain {
    chain: Block[];
    transactionPool: Transaction[];
    blockTime: number = 5000;
    blockChainAddress: string = '0'.repeat(25) + 'BYTECHAIN';
    minerAddress: string;
    difficulty: number = 3;
    MiningReward: number = 1024;

    constructor(minerAddress: string) {
        this.chain = [];
        this.transactionPool = [];
        this.minerAddress =  minerAddress;
        this.GenesisBlock();
    }

    // Creating genesis block
    GenesisBlock(): void { 
        const GenesisTransactionAmount = 1000000;
        const GenesisTransactionRecipient = '13sEjuBbarwqyVepXPWYFZd1UJa76BBa1B'; 
        const GenesisBlockPrevHash = '0'.repeat(64);

        const genesisTransaction: Transaction[] = [
            new Transaction(
                GenesisTransactionAmount, 
                this.blockChainAddress, 
                GenesisTransactionRecipient,
                '',
            )
        ]

        const genesisBlock = new Block(1, genesisTransaction, genesisTransaction.length, GenesisBlockPrevHash);
        
        genesisBlock.SetBlockProps(this.difficulty);
        this.chain.push(genesisBlock);
    }

    // Getting the last block in the chain
    GetLastBlock(): Block {
        return this.chain[this.chain.length - 1];
    }

    // Creating and Adding a new transaction to the transaction pool
    AddNewTransaction(transaction: Transaction, pubKey: string): Transaction {
        if (!(transaction instanceof Transaction)) {
            throw new TypeError('Invalid transaction format');
        }

        if (!transaction.IsValidTransaction(pubKey)) {
            throw new Error('Invalid transaction');
        }

        this.transactionPool.push(transaction);
        return transaction;
    }

    // Creating a new block
    AddNewBlock(): Block {
        const blockHeight = this.chain.length + 1;
        const transactions: Transaction[] = this.transactionPool;
        const trxCount = transactions.length;
        const prevBlockHash = this.GetLastBlock().blockHash;

        const newBlock = new Block(blockHeight, transactions, trxCount, prevBlockHash);
        newBlock.SetBlockProps(this.difficulty);

        // Reset transaction pool after block is added
        this.transactionPool = [];
        this.chain.push(newBlock);

        return newBlock; 
    }

    // Mining a block
    Mine(): Block {
        const MiningRewardTransaction = new Transaction(this.MiningReward, this.blockChainAddress, this.minerAddress, '');
        this.AddNewTransaction(MiningRewardTransaction, '');
        const newBlock = this.AddNewBlock(); 
        return newBlock;
    }

    CalculateDifficulty() {
        const lastBlock: Block = this.GetLastBlock();
        const prevLastBlock: Block = this.chain[this.chain.length - 2];
        const diffInTime: number = lastBlock.timestamp - prevLastBlock.timestamp;
        if (this.difficulty < 1) {
            this.difficulty = 1;
        }
        if (this.difficulty > 5) {
            this.difficulty = 5;
        }
        if (diffInTime < blockTime) {
            this.difficulty = this.difficulty + 1;
        } else if (diffInTime > blockTime) {
            this.difficulty = this.difficulty - 1;
        } else {
            this.difficulty = this.difficulty;
        }
    }

    SyncBlocks(block: Block): void {
        // TODO: Implement block sync logic
    }

    // Validate the entire blockchain
    IsChainValid(): boolean {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const prevBlock = this.chain[i - 1];

            if (!(currentBlock instanceof Block) || !(prevBlock instanceof Block)) {
                return false;
            }

            if (!currentBlock.ContainValidTransactions()) {
                return false;
            }

            if (currentBlock.blockHash !== currentBlock.BlockHash()) {
                return false;
            }

            if (currentBlock.prevBlockHash !== prevBlock.blockHash) {
                return false;
            }
        }
        return true;
    }
}

export default BlockChain;

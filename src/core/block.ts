import buildMerkleTree from '../utils/merkle_tree';
import Transaction from './transaction';
 
// Block class
class Block {
    nonce: number;
    blockHeight: number;
    timestamp: number;
    transactions: Transaction[];
    trxCount: number;
    merkleroot: string;
    prevBlockHash: string;
    blockHash: string;

    constructor (blockHeight: number, transactions: Transaction[], trxCount: number, merkleroot: string, prevBlockHash: string, blockHash: string) {
        this.nonce = 0;
        this.blockHeight = blockHeight;
        this.timestamp = Date.now();
        this.transactions = transactions;
        this.trxCount = trxCount;
        this.merkleroot = merkleroot;
        this.prevBlockHash = prevBlockHash;
        this.blockHash = blockHash;
    }

    CalculateMerkleRoot(): string {
        if (this.transactions.length === 0) {
            return '';
        }
        return buildMerkleTree(this.transactions);
    }

    ContainValidTransactions(): string | boolean {
        for (const transaction of this.transactions) {
            if (!(transaction instanceof Transaction)) {
                throw new Error('Invalid transaction instance');
            }
            //            TODO
            // if (!transaction.IsValidTransaction()) {
            //     return false;
            // }
        }
        return true;
    }
}


export default Block;

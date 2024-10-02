import buildMerkleTree from '../utils/merkle_tree';
import Transaction from './transaction';
import ProofOfWork from '../consensus/pow'
 
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

    constructor (blockHeight: number, transactions: Transaction[], trxCount: number, prevBlockHash: string) {
        this.nonce = 0;
        this.blockHeight = blockHeight;
        this.transactions = transactions;
        this.trxCount = trxCount;
        this.timestamp = 0;
        this.merkleroot = '';
        this.prevBlockHash = prevBlockHash;
        this.blockHash = '';
    }

    SetBlockProps(MiningDifficulty: number) {
        this.merkleroot = this.CalculateMerkleRoot();
        const blockDataAsString = `${this.blockHeight}${this.nonce}${JSON.stringify(this.transactions)}${this.merkleroot}${this.prevBlockHash}`;
        
        const { hash, nonce } = ProofOfWork(blockDataAsString, MiningDifficulty);
        
        this.blockHash = hash;
        this.nonce = nonce;
        this.timestamp = Date.now();
    }

    CalculateMerkleRoot(): string {
        if (this.transactions.length === 0) {
            return '';
        }
        return buildMerkleTree(this.transactions);
    }
}


export default Block;

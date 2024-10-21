"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const merkle_tree_1 = __importDefault(require("../utils/merkle_tree"));
const pow_1 = __importDefault(require("../consensus/pow"));
// Block class
class Block {
    constructor(blockHeight, transactions, trxCount, prevBlockHash) {
        this.nonce = 0;
        this.blockHeight = blockHeight;
        this.transactions = transactions;
        this.trxCount = trxCount;
        this.timestamp = 0;
        this.merkleroot = '';
        this.prevBlockHash = prevBlockHash;
        this.blockHash = '';
    }
    SetBlockProps(MiningDifficulty) {
        this.merkleroot = this.CalculateMerkleRoot();
        const blockDataAsString = `${this.blockHeight}${this.nonce}${JSON.stringify(this.transactions)}${this.merkleroot}${this.prevBlockHash}`;
        const { hash, nonce } = (0, pow_1.default)(blockDataAsString, MiningDifficulty);
        this.blockHash = hash;
        this.nonce = nonce;
        this.timestamp = Date.now();
    }
    CalculateMerkleRoot() {
        if (this.transactions.length === 0) {
            return '';
        }
        return (0, merkle_tree_1.default)(this.transactions);
    }
}
exports.default = Block;

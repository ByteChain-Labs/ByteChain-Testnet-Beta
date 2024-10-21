"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("../utils/crypto");
const crypto_2 = __importDefault(require("crypto"));
const bs58_1 = __importDefault(require("bs58"));
const elliptic_1 = __importDefault(require("elliptic"));
const ec = new elliptic_1.default.ec('secp256k1');
class Account {
    constructor() {
        this.privateKey = ec.genKeyPair().getPrivate('hex');
        this.publicKey = this.CreatePublicKey(this.privateKey);
        this.blockchainAddress = this.CreateBlockChainAddress(this.publicKey);
    }
    // Generates the public key from a private key
    CreatePublicKey(privKey) {
        const keyPair = ec.keyFromPrivate(privKey);
        privKey = '';
        const publicKey = keyPair.getPublic('hex');
        return publicKey;
    }
    // Creates a blockchain address from the public key
    CreateBlockChainAddress(publicKey) {
        const publicKeyBuffer = Buffer.from(publicKey, 'hex');
        const sha256Hash = crypto_2.default.createHash('sha256').update(publicKeyBuffer).digest();
        const ripemd160Hash = crypto_2.default.createHash('ripemd160').update(sha256Hash).digest();
        const versionByte = Buffer.from([0x1B]); // Version byte 
        const payload = Buffer.concat([versionByte, ripemd160Hash]);
        const checksum = (0, crypto_1.hashFunc)(payload).slice(0, 4);
        const finalPayload = Buffer.concat([payload, checksum]);
        const blockchainAddress = bs58_1.default.encode(finalPayload);
        return blockchainAddress;
    }
    SignTransaction(transaction, privKey) {
        const publicKey = this.CreatePublicKey(privKey);
        const generatedAddress = this.CreateBlockChainAddress(publicKey);
        if (generatedAddress !== transaction.sender) {
            throw new Error('You cannot sign transactions for another account.');
        }
        const { amount, sender, recipient } = transaction;
        const hashedTransaction = (0, crypto_1.hashTransaction)(amount, sender, recipient);
        const keyFromPrivate = ec.keyFromPrivate(privKey);
        privKey = '';
        const sig = keyFromPrivate.sign(hashedTransaction, 'base64');
        const signature = sig.toDER('hex');
        return signature;
    }
}
exports.default = Account;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("../utils/crypto");
const elliptic_1 = require("elliptic");
const ec = new elliptic_1.ec('secp256k1');
class Transaction {
    constructor(amount, sender, recipient, signature) {
        this.amount = amount;
        this.sender = sender;
        this.recipient = recipient;
        this.signature = signature;
    }
    // Validate the transaction to check if it's signed by the owner of the wallet
    IsValidTransaction(pubKey) {
        const BlockChainAddress = '0'.repeat(25) + 'BYTECHAIN';
        if (this.sender === BlockChainAddress)
            return true;
        if (!this.signature) {
            throw new Error('This transaction does not contain a signature');
        }
        try {
            const publicKey = ec.keyFromPublic(pubKey, 'hex');
            const isValid = publicKey.verify((0, crypto_1.hashTransaction)(this.amount, this.sender, this.recipient), this.signature);
            if (!isValid) {
                console.error('Transaction signature verification failed');
            }
            return isValid;
        }
        catch (error) {
            console.error('Error validating transaction:', error.message);
            return false;
        }
    }
}
exports.default = Transaction;

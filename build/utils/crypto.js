"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashFunc = hashFunc;
exports.hashBlock = hashBlock;
exports.hashTransaction = hashTransaction;
const crypto_1 = __importDefault(require("crypto"));
function hashFunc(data) {
    const hashedData = crypto_1.default.createHash('sha256').update(crypto_1.default.createHash('sha256').update(data).digest()).digest();
    return hashedData;
}
function hashBlock(data) {
    if (typeof data !== 'string') {
        throw new TypeError('Data must be a string.');
    }
    const hashedData = crypto_1.default.createHash('sha256').update(crypto_1.default.createHash('sha256').update(data).digest('hex')).digest('hex');
    return hashedData;
}
function hashTransaction(amount, sender, recipient) {
    const transactionDataAsString = `${amount}${sender}${recipient}`;
    const hashedTransaction = hashBlock(transactionDataAsString);
    return hashedTransaction;
}

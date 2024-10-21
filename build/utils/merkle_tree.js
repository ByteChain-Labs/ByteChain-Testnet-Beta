"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("./crypto");
function buildMerkleTree(transactions) {
    if (!Array.isArray(transactions)) {
        throw new TypeError('Transactions must be an array.');
    }
    if (transactions.length === 0) {
        return '';
    }
    if (transactions.length === 1) {
        return (0, crypto_1.hashBlock)(JSON.stringify(transactions[0]));
    }
    let hashes = transactions.map(transaction => (0, crypto_1.hashBlock)(JSON.stringify(transaction)));
    while (hashes.length > 1) {
        if (hashes.length % 2 !== 0) {
            hashes.push(hashes[hashes.length - 1]);
        }
        let nextLevel = [];
        for (let i = 0; i < hashes.length; i += 2) {
            nextLevel.push((0, crypto_1.hashBlock)(hashes[i] + hashes[i + 1]));
        }
        hashes = nextLevel;
    }
    return hashes[0];
}
exports.default = buildMerkleTree;

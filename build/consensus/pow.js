"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("../utils/crypto");
function ProofOfWork(blockDataAsString, MiningDifficulty) {
    let nonce = 0;
    let hash;
    while (true) {
        hash = (0, crypto_1.hashBlock)(blockDataAsString + nonce);
        if (hash.substring(0, MiningDifficulty) === '0'.repeat(MiningDifficulty)) {
            break;
        }
        nonce++;
    }
    return { hash, nonce };
}
exports.default = ProofOfWork;

import { hashTransaction, hashFunc } from '../utils/crypto'
import Transaction from '../core/transaction'
import crypto from 'crypto';
import bs58 from 'bs58';
import elliptic from 'elliptic';

const ec = new elliptic.ec('secp256k1');

class Account {
    public privateKey: string;
    public publicKey: string;
    public blockchainAddress: string;

    constructor() {
        this.privateKey = ec.genKeyPair().getPrivate('hex');
        this.publicKey = this.CreatePublicKey(this.privateKey);
        this.blockchainAddress = this.CreateBlockChainAddress(this.publicKey);
    }

    // Generates the public key from a private key
    CreatePublicKey(privKey: string): string {
        const keyPair = ec.keyFromPrivate(privKey);
        privKey = '';
        const publicKey = keyPair.getPublic('hex');
        return publicKey;
    }

    // Creates a blockchain address from the public key
    CreateBlockChainAddress(publicKey: string): string {
        const publicKeyBuffer = Buffer.from(publicKey, 'hex');
        const sha256Hash = crypto.createHash('sha256').update(publicKeyBuffer).digest();
        const ripemd160Hash = crypto.createHash('ripemd160').update(sha256Hash).digest();
        const versionByte = Buffer.from([0x1B]); // Version byte 
        const payload = Buffer.concat([versionByte, ripemd160Hash]);
        const checksum = hashFunc(payload).slice(0, 4);
        const finalPayload = Buffer.concat([payload, checksum]);
        const blockchainAddress = bs58.encode(finalPayload);
        
        return blockchainAddress;
    }

    SignTransaction(transaction: Transaction, privKey: string): string {
        const publicKey = this.CreatePublicKey(privKey);
        const generatedAddress = this.CreateBlockChainAddress(publicKey);

        if (generatedAddress !== transaction.sender) {
            throw new Error('You cannot sign transactions for another account.');
        }

        const { amount, sender, recipient } = transaction;
        const hashedTransaction = hashTransaction(amount, sender, recipient);
        const keyFromPrivate = ec.keyFromPrivate(privKey);
        privKey = '';
        const sig = keyFromPrivate.sign(hashedTransaction, 'base64');
        const signature = sig.toDER('hex');

        return signature;
    }

    
}


export default Account;

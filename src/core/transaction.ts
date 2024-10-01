import { hashTransaction } from '../utils/crypto';
import { ec as EC } from 'elliptic';
const ec = new EC('secp256k1');

class Transaction {
    amount: number;
    sender: string;
    recipient: string;
    signature: string;

    constructor(amount: number, sender: string, recipient: string, signature: string) {
        this.amount = amount;
        this.sender = sender;
        this.recipient = recipient;
        this.signature = signature;
    }

    // Validate the transaction to check if it's signed by the owner of the wallet
    IsValidTransaction(pubKey: string): boolean {
        const BlockChainAddress = '0'.repeat(25) + 'BYTECHAIN';

        if (this.sender === BlockChainAddress) return true;

        if (!this.signature) {
            throw new Error('This transaction does not contain a signature');
        }

        try {
            const publicKey = ec.keyFromPublic(pubKey, 'hex');
            const isValid = publicKey.verify(
                hashTransaction(this.amount, this.sender, this.recipient),
                this.signature
            );

            if (!isValid) {
                console.error('Transaction signature verification failed');
            }
            return isValid;
        } catch (error) {
            console.error('Error validating transaction:', (error as Error).message);
            return false;
        }
    }
}

export default Transaction;

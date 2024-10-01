import crypto from 'crypto';

export function hashFunc(data: Buffer): Buffer {
    const hashedData = crypto.createHash('sha256').update(
        crypto.createHash('sha256').update(data).digest()
    ).digest();
    return hashedData;
}

export function hashBlock(data: string): string {
    if (typeof data !== 'string') {
        throw new TypeError('Data must be a string.');
    }
    const hashedData = crypto.createHash('sha256').update(
        crypto.createHash('sha256').update(data).digest('hex')
    ).digest('hex');
    return hashedData;
}

export function hashTransaction<T>(transaction: T): string {
    const transactionDataAsString = `${transaction.amount}${transaction.sender}${transaction.recipient}`;
    const hashedTransaction = hashBlock(transactionDataAsString);
    return hashedTransaction;
}

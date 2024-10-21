import Account from './account';

class Wallet {
  account: Account;
  balance: number;

  constructor(account: Account) {
    this.account = account;
    this.balance = 0
  }

  InitiateTransaction(amount: number, recipient: string) {
    if (amount > this.balance) {
      throw new Error('Insufficient fund');
    }
  }
}
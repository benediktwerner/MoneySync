import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';

declare global {
  interface Date {
    hasSameMonthAs(other: Date): boolean;
  }
}

Date.prototype.hasSameMonthAs = function(other: Date) {
  return this.getUTCFullYear() == other.getUTCFullYear() && this.getUTCMonth() == other.getUTCMonth();
};

export interface Dict<T> {
  [key: string]: T;
}

export interface User {}

export interface Account {
  id: string;
  name: string;
  balance: number;
  icon: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface Transaction {
  id: string;
  name: string;
  amount: number;
  date: any;
  accountId: string;
  categoryId: string;
}

@Injectable({
  providedIn: 'root',
})
export class DataService {
  accounts: Dict<Account> = {};
  categories: Dict<Category> = {};
  transactions: Dict<Transaction> = {};

  onAccountsChange: BehaviorSubject<Account[]>;
  onCategoriesChange: BehaviorSubject<Category[]>;
  onTransactionsChange: BehaviorSubject<Transaction[]>;

  totalBalance: number = 0;
  currentMonthTotal: number = 0;
  lastMonthTotal: number = 0;

  userCollection: AngularFirestoreDocument<User>;
  accountsCollection: AngularFirestoreCollection<Account>;
  categoriesCollection: AngularFirestoreCollection<Category>;
  transactionsCollection: AngularFirestoreCollection<Transaction>;

  constructor(private db: AngularFirestore) {
    this.userCollection = db.doc<User>('users/bene');
    this.accountsCollection = this.userCollection.collection<Account>('accounts');
    this.categoriesCollection = this.userCollection.collection<Category>('categories');
    this.transactionsCollection = this.userCollection.collection<Transaction>('transactions');

    this.onAccountsChange = new BehaviorSubject(Object.values(this.accounts));
    this.onCategoriesChange = new BehaviorSubject(Object.values(this.categories));
    this.onTransactionsChange = new BehaviorSubject(Object.values(this.transactions));

    this.accountsCollection.valueChanges().subscribe(accs => {
      const accounts = {};
      accs.forEach(acc => (accounts[acc.id] = acc));
      this.accounts = accounts;
      this.onAccountsChange.next(Object.values(accounts));
    });
    this.categoriesCollection.valueChanges().subscribe(cats => {
      const categories = {};
      cats.forEach(cat => (categories[cat.id] = cat));
      this.categories = categories;
      this.onCategoriesChange.next(Object.values(categories));
    });
    this.transactionsCollection.valueChanges().subscribe(trans => {
      const transactions = {};
      const currDate = new Date();
      const lastMonthDate = new Date();
      lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);

      let accountBalances = {};
      let totalBalance = 0;
      let lastMonthTotal = 0;
      let currentMonthTotal = 0;

      trans.forEach(t => {
        t.date = t.date.toDate();
        transactions[t.id] = t;
        totalBalance += t.amount;

        if (t.accountId in accountBalances) accountBalances[t.accountId] += t.amount;
        else accountBalances[t.accountId] = t.amount;

        if (t.date.hasSameMonthAs(currDate)) currentMonthTotal += t.amount;
        else if (t.date.hasSameMonthAs(lastMonthDate)) lastMonthTotal += t.amount;
      });

      this.transactions = transactions;
      this.totalBalance = totalBalance;
      this.lastMonthTotal = lastMonthTotal;
      this.currentMonthTotal = currentMonthTotal;
      Object.keys(this.accounts).forEach(accId => (this.accounts[accId].balance = accountBalances[accId]));

      this.onTransactionsChange.next(Object.values(this.transactions));
      this.onAccountsChange.next(Object.values(this.accounts));
    });
  }

  addTransaction(transaction: Transaction) {
    transaction.id = this.db.createId();
    this.transactionsCollection.doc<Transaction>(transaction.id).set(transaction);
  }

  updateTransaction(transaction: Transaction) {
    this.transactionsCollection.doc<Transaction>(transaction.id).update(transaction);
  }

  removeTransaction(id: string) {
    this.transactionsCollection.doc<Transaction>(id).delete();
  }

  addAccount(account: Account) {
    account.id = this.db.createId();
    this.accountsCollection.doc<Account>(account.id).set(account);
  }

  updateAccount(account: Account) {
    this.accountsCollection.doc<Account>(account.id).update(account);
  }

  removeAccount(id: string, moveTransactions = false, targetAccountId?: string) {
    const batch = this.db.firestore.batch();

    if (moveTransactions) {
      Object.values(this.transactions).forEach(trans => {
        if (trans.accountId == id)
          batch.update(this.transactionsCollection.doc(trans.id).ref, { accountId: targetAccountId });
      });
    } else {
      Object.values(this.transactions).forEach(trans => {
        if (trans.accountId == id) batch.delete(this.transactionsCollection.doc(trans.id).ref);
      });
    }
    batch.delete(this.accountsCollection.doc<Account>(id).ref);
    return batch.commit();
  }
}

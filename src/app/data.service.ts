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

export interface User {
  defaultAccount: string;
  chartsStartAtZero: boolean;
  chartsFill: 'start' | 'end' | 'origin' | boolean;
  chartsLineStyle: 'stepped' | 'round' | 'straight';
}

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

interface TransactionInternal {
  id: string;
  name: string;
  amount: number;
  date: any;
  accountId: string;
  categoryId: string;
}

export interface Transaction extends TransactionInternal {
  date: Date;
}

@Injectable({
  providedIn: 'root',
})
export class DataService {
  user: User = { defaultAccount: '', chartsStartAtZero: true, chartsFill: false, chartsLineStyle: 'round' };
  accounts: Dict<Account> = {};
  categories: Dict<Category> = {};
  transactions: Dict<Transaction> = {};

  onUserChange: BehaviorSubject<User>;
  onAccountsChange: BehaviorSubject<Account[]>;
  onCategoriesChange: BehaviorSubject<Category[]>;
  onTransactionsChange: BehaviorSubject<Transaction[]>;

  totalBalance: number = 0;
  currentMonthTotal: number = 0;
  lastMonthTotal: number = 0;

  private userDoc: AngularFirestoreDocument<User>;
  private accountsCollection: AngularFirestoreCollection<Account>;
  private categoriesCollection: AngularFirestoreCollection<Category>;
  private transactionsCollection: AngularFirestoreCollection<TransactionInternal>;

  constructor(private db: AngularFirestore) {
    this.userDoc = db.doc<User>('users/bene');
    this.accountsCollection = this.userDoc.collection<Account>('accounts');
    this.categoriesCollection = this.userDoc.collection<Category>('categories');
    this.transactionsCollection = this.userDoc.collection<TransactionInternal>('transactions');

    this.onUserChange = new BehaviorSubject(this.user);
    this.onAccountsChange = new BehaviorSubject(Object.values(this.accounts));
    this.onCategoriesChange = new BehaviorSubject(Object.values(this.categories));
    this.onTransactionsChange = new BehaviorSubject(Object.values(this.transactions));

    this.userDoc.valueChanges().subscribe(user => {
      Object.assign(this.user, user);
      this.onUserChange.next(user);
    });
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

    if (this.user.defaultAccount == id) {
      const accounts = Object.values(this.accounts);
      if (accounts.length > 1) batch.set(this.userDoc.ref, { defaultAccount: accounts.find(acc => acc.id != id).id });
      else batch.set(this.userDoc.ref, { defaultAccount: '' });
    }

    batch.delete(this.accountsCollection.doc<Account>(id).ref);
    return batch.commit();
  }

  addCategory(category: Category) {
    category.id = this.db.createId();
    this.categoriesCollection.doc<Category>(category.id).set(category);
  }

  updateCategory(category: Category) {
    this.categoriesCollection.doc<Category>(category.id).update(category);
  }

  removeCategory(id: string) {
    this.categoriesCollection.doc<Category>(id).delete();
  }

  updateUserSettings(user?: User) {
    this.userDoc.update(user ? user : this.user);
  }
}

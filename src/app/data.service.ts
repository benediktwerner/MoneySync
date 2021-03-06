import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { BehaviorSubject, Subscription } from 'rxjs';
import 'firebase/firestore';
import { AuthService } from './auth.service';

declare global {
  interface Date {
    hasSameMonthAs(other: Date): boolean;
  }
}

Date.prototype.hasSameMonthAs = function(other: Date) {
  return (
    this.getUTCFullYear() == other.getUTCFullYear() && this.getUTCMonth() == other.getUTCMonth()
  );
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
  icon: string;
  balance: number;
  initialBalance: number;
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
  user: User = {
    defaultAccount: '',
    chartsStartAtZero: true,
    chartsFill: false,
    chartsLineStyle: 'round',
  };
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

  private subscriptions: Subscription;

  constructor(private db: AngularFirestore, auth: AuthService) {
    this.onUserChange = new BehaviorSubject(this.user);
    this.onAccountsChange = new BehaviorSubject(Object.values(this.accounts));
    this.onCategoriesChange = new BehaviorSubject(Object.values(this.categories));
    this.onTransactionsChange = new BehaviorSubject(Object.values(this.transactions));

    auth.user.subscribe(user => {
      this.userDoc = db.doc<User>('users/' + user.uid);
      this.accountsCollection = this.userDoc.collection<Account>('accounts');
      this.categoriesCollection = this.userDoc.collection<Category>('categories');
      this.transactionsCollection = this.userDoc.collection<TransactionInternal>('transactions');

      if (this.subscriptions) this.subscriptions.unsubscribe();

      const userSub = this.userDoc.valueChanges().subscribe(user => {
        Object.assign(this.user, user);
        this.onUserChange.next(this.user);
      });
      const accsSub = this.accountsCollection.valueChanges().subscribe(accs => {
        const accounts = {};
        accs.forEach(acc => (accounts[acc.id] = acc));
        this.accounts = accounts;
        this.generateBalances();
        this.onAccountsChange.next(Object.values(accounts));
      });
      const categorySub = this.categoriesCollection.valueChanges().subscribe(cats => {
        const categories = {};
        cats.forEach(cat => (categories[cat.id] = cat));
        this.categories = categories;
        this.onCategoriesChange.next(Object.values(categories));
      });
      const transSub = this.transactionsCollection.valueChanges().subscribe(trans => {
        const transactions = {};
        trans.forEach(t => {
          t.date = t.date.toDate();
          transactions[t.id] = t;
        });
        this.transactions = transactions;
        this.generateBalances();
        this.onTransactionsChange.next(Object.values(this.transactions));
        this.onAccountsChange.next(Object.values(this.accounts));
      });

      this.subscriptions = userSub;
      this.subscriptions.add(accsSub);
      this.subscriptions.add(categorySub);
      this.subscriptions.add(transSub);
    });
  }

  private generateBalances() {
    if (Object.keys(this.accounts).length == 0) return;

    const currDate = new Date();
    const lastMonthDate = new Date();
    lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);

    this.totalBalance = 0;
    this.lastMonthTotal = 0;
    this.currentMonthTotal = 0;

    for (const acc of Object.values(this.accounts)) {
      acc.balance = acc.initialBalance;
      this.totalBalance += acc.initialBalance;
    }

    for (const trans of Object.values(this.transactions)) {
      this.totalBalance += trans.amount;
      this.accounts[trans.accountId].balance += trans.amount;

      if (trans.date.hasSameMonthAs(currDate)) this.currentMonthTotal += trans.amount;
      else if (trans.date.hasSameMonthAs(lastMonthDate)) this.lastMonthTotal += trans.amount;
    }
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
          batch.update(this.transactionsCollection.doc(trans.id).ref, {
            accountId: targetAccountId,
          });
      });
    } else {
      Object.values(this.transactions).forEach(trans => {
        if (trans.accountId == id) batch.delete(this.transactionsCollection.doc(trans.id).ref);
      });
    }

    if (this.user.defaultAccount == id) {
      const accounts = Object.values(this.accounts);
      if (accounts.length > 1)
        batch.update(this.userDoc.ref, { defaultAccount: accounts.find(acc => acc.id != id).id });
      else batch.update(this.userDoc.ref, { defaultAccount: '' });
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

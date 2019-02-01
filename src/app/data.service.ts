import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { tap, map, shareReplay } from 'rxjs/operators';

declare global {
  interface Date {
    hasSameMonthAs(other: Date): boolean;
  }
}

Date.prototype.hasSameMonthAs = function(other: Date) {
  return this.getUTCFullYear() == other.getUTCFullYear() && this.getUTCMonth() == other.getUTCMonth();
};

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

export interface TransactionPlain {
  id: string;
  name: string;
  amount: number;
  timestamp: any;
  accountId: string;
  categoryId: string;
}

export interface Transaction extends TransactionPlain {
  date: Date;
  account: Observable<Account>;
  category: Observable<Category>;
}

@Injectable({
  providedIn: 'root',
})
export class DataService {
  accounts: Observable<Account[]>;
  transactions: Observable<Transaction[]>;
  categories: Observable<Category[]>;

  totalBalance: Observable<number>;
  currentMonthTotal: Observable<number>;
  lastMonthTotal: Observable<number>;

  userCollection: AngularFirestoreDocument<User>;
  accountsCollection: AngularFirestoreCollection<Account>;
  categoriesCollection: AngularFirestoreCollection<Category>;
  transactionsCollection: AngularFirestoreCollection<TransactionPlain>;

  private currDate: Date;
  private lastMonthDate: Date;

  constructor(private db: AngularFirestore) {
    this.userCollection = db.doc<User>('users/bene');
    this.accountsCollection = this.userCollection.collection<Account>('accounts');
    this.categoriesCollection = this.userCollection.collection<Category>('categories');
    this.transactionsCollection = this.userCollection.collection<TransactionPlain>('transactions');

    this.accounts = this.accountsCollection.valueChanges().pipe(shareReplay(1));
    this.categories = this.categoriesCollection.valueChanges().pipe(shareReplay(1));
    this.transactions = this.transactionsCollection.valueChanges().pipe(
      map(arr =>
        arr.map(trans => {
          const date = trans.timestamp.toDate();
          const account = this.accountsCollection
            .doc<Account>(trans.accountId)
            .valueChanges()
            .pipe(shareReplay(1));
          const category = this.categoriesCollection
            .doc<Category>(trans.categoryId)
            .valueChanges()
            .pipe(shareReplay(1));
          return { account, category, date, ...trans };
        })
      ),
      shareReplay(1)
    );

    this.totalBalance = this.accounts.pipe(
      map(arr => arr.reduce((total, current) => total + current.balance, 0)),
      shareReplay(1)
    );

    let updateDate = tap(() => {
      this.currDate = new Date();
      this.lastMonthDate = new Date();
      this.lastMonthDate.setMonth(this.lastMonthDate.getMonth() - 1);
    });

    this.currentMonthTotal = this.transactions.pipe(
      updateDate,
      map<Transaction[], number>(arr =>
        arr.reduce((total, current) => (current.date.hasSameMonthAs(this.currDate) ? total + current.amount : total), 0)
      ),
      shareReplay(1)
    );

    this.lastMonthTotal = this.transactions.pipe(
      updateDate,
      map<Transaction[], number>(arr =>
        arr.reduce(
          (total, current) => (current.date.hasSameMonthAs(this.lastMonthDate) ? total + current.amount : total),
          0
        )
      ),
      shareReplay(1)
    );
  }

  addTransaction(transaction: TransactionPlain) {
    transaction.id = this.db.createId();
    this.transactionsCollection.doc<TransactionPlain>(transaction.id).set(transaction);
  }

  removeTransaction(transaction: Transaction) {
    this.transactionsCollection.doc<TransactionPlain>(transaction.id).delete();
  }
}

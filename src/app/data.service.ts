import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  DocumentReference,
  DocumentChangeAction,
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

export interface Reference {
  reference: DocumentReference;
}

export interface User {}

export interface AccountPlain {
  name: string;
  balance: number;
  type: string;
}

export interface Account extends AccountPlain, Reference {}

export interface TransactionPlain {
  name: string;
  amount: number;
  timestamp: any;
  accountRef: DocumentReference;
  categoryRef: DocumentReference;
}

export interface Transaction extends TransactionPlain, Reference {
  date: Date;
  account: Observable<AccountPlain>;
  category: Observable<CategoryPlain>;
}

export interface CategoryPlain {
  name: string;
  icon: string;
}

export interface Category extends CategoryPlain, Reference {}

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
  accountsCollection: AngularFirestoreCollection<AccountPlain>;
  transactionsCollection: AngularFirestoreCollection<TransactionPlain>;
  categoriesCollection: AngularFirestoreCollection<CategoryPlain>;

  private currDate: Date;
  private lastMonthDate: Date;

  constructor(private db: AngularFirestore) {
    this.userCollection = db.doc<User>('users/bene');
    this.accountsCollection = this.userCollection.collection<AccountPlain>('accounts');
    this.transactionsCollection = this.userCollection.collection<TransactionPlain>('transactions');
    this.categoriesCollection = this.userCollection.collection<CategoryPlain>('categories');

    function mapReference<T extends object, R extends Reference>() {
      return map<DocumentChangeAction<T>[], R[]>(arr =>
        arr.map(action => {
          const data = action.payload.doc.data();
          const reference = action.payload.doc.ref;
          return { reference, ...(data as object) } as R;
        })
      );
    }

    this.accounts = this.accountsCollection.snapshotChanges().pipe(
      mapReference<AccountPlain, Account>(),
      shareReplay(1)
    );

    this.transactions = this.transactionsCollection.snapshotChanges().pipe(
      map(arr =>
        arr.map(action => {
          const trans = action.payload.doc.data();
          const reference = action.payload.doc.ref;
          const date = trans.timestamp.toDate();
          const account = this.accountsCollection
            .doc<AccountPlain>(trans.accountRef.id)
            .valueChanges()
            .pipe(shareReplay(1));
          const category = this.categoriesCollection
            .doc<CategoryPlain>(trans.categoryRef.id)
            .valueChanges()
            .pipe(shareReplay(1));
          return { account, category, date, reference, ...trans };
        })
      ),
      shareReplay(1)
    );

    this.categories = this.categoriesCollection.snapshotChanges().pipe(
      mapReference<CategoryPlain, Category>(),
      shareReplay(1)
    );

    this.totalBalance = this.accounts.pipe(map(arr => arr.reduce((total, current) => total + current.balance, 0)));

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

  addTransaction(transaction) {
    this.transactionsCollection.add(transaction);
  }
}

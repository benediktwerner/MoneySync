import { Component } from '@angular/core';
import { DataService, Account, Category } from '../data.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
})
export class TransactionsComponent {
  accounts: Observable<Account[]>;
  categories: Observable<Category[]>;

  showEarnings: boolean = true;
  showSpendings: boolean = true;

  accountFilter: string = '';
  categoryFilter: string = '';
  nameFilter: string = '';

  minAmount: number;
  maxAmount: number;

  constructor(public data: DataService) {
    this.accounts = data.onAccountsChange.pipe(map(accs => Object.values(accs)));
    this.categories = data.onCategoriesChange.pipe(map(cats => Object.values(cats)));
  }
}

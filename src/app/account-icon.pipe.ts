import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'accountIcon',
})
export class AccountIconPipe implements PipeTransform {
  transform(value: string): any {
    switch (value) {
      case 'cash':
        return 'account_balance_wallet';
      case 'account':
        return 'account_balance';
      case 'card':
        return 'credit_card';
      default:
        return 'attach_money';
    }
  }
}

import { Component } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { MatSnackBar } from '@angular/material/snack-bar/';
import { MatDialog } from '@angular/material/dialog';
import { AddTransactionDialogComponent } from './transactions/components/add-transaction-dialog/add-transaction-dialog.component';

export interface Item {
  name: string;
  age: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  navbarCollapsed: boolean = true;

  constructor(private dialog: MatDialog, private snackBar: MatSnackBar, updates: SwUpdate) {
    updates.available.subscribe(() => {
      this.showMessage('A new version is available', 'UPDATE', () =>
        updates.activateUpdate().then(() => document.location.reload())
      );
    });
  }

  showMessage(message: string, action = 'OK', onAction = null) {
    let snackBarRef = this.snackBar.open(message, action);

    if (onAction) {
      snackBarRef.onAction().subscribe(onAction);
    }
  }

  addTransaction() {
    this.dialog.open(AddTransactionDialogComponent);
  }
}

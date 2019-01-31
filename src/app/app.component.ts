import { Component } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { MatSnackBar, MatDialog } from '@angular/material';
import { DataService } from './data.service';
import { AddTransactionDialogComponent } from './add-transaction-dialog/add-transaction-dialog.component';

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
  constructor(private dialog: MatDialog, private snackBar: MatSnackBar, private data: DataService, updates: SwUpdate) {
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
    this.dialog
      .open(AddTransactionDialogComponent)
      .afterClosed()
      .subscribe(result => {
        if (result) this.data.addTransaction(result);
      });
  }
}

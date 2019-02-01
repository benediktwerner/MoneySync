import {
  MatButtonModule,
  MatSnackBarModule,
  MatToolbarModule,
  MatIconModule,
  MatCardModule,
  MatListModule,
  MatDividerModule,
  MatDialogModule,
  MatInputModule,
  MatSelectModule,
  MatAutocompleteModule,
  MAT_DIALOG_DEFAULT_OPTIONS,
} from '@angular/material';
import { NgModule } from '@angular/core';

@NgModule({
  exports: [
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatSnackBarModule,
    MatListModule,
    MatDividerModule,
    MatDialogModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
  ],
  providers: [
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: { autoFocus: false, hasBackdrop: true },
    },
  ],
})
export class MaterialModule {}

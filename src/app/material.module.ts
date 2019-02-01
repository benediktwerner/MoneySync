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
  MAT_DIALOG_DEFAULT_OPTIONS,
} from '@angular/material';
import { NgModule } from '@angular/core';

const modules = [
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
];

@NgModule({
  imports: modules,
  exports: modules,
  providers: [
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: { autoFocus: false, hasBackdrop: true },
    },
  ],
})
export class MaterialModule {}

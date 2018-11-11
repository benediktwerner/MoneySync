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
})
export class MaterialModule {}

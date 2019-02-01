import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeletionDialogComponent } from './deletion-dialog.component';
import { MaterialModule } from 'src/app/material.module';

@NgModule({
  declarations: [DeletionDialogComponent],
  imports: [CommonModule, MaterialModule],
  exports: [DeletionDialogComponent],
  entryComponents: [DeletionDialogComponent],
})
export class DeletionDialogModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconSelectorComponent } from './icon-selector.component';
import { MaterialModule } from 'src/app/material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  declarations: [IconSelectorComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MaterialModule],
  exports: [IconSelectorComponent],
})
export class IconSelectorModule {}

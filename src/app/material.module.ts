import { MatButtonModule } from '@angular/material';
import { NgModule } from '@angular/core';

const modules = [MatButtonModule];

@NgModule({
    imports: modules,
    exports: modules
})
export class MaterialModule { }

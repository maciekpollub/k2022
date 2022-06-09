import { NgModule } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatListModule, MatSelectionList } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { TopFilterComponent } from '../top-filter/top-filter.component';



@NgModule({
  declarations: [
    TopFilterComponent,
  ],
  imports: [
    CommonModule,
    MatGridListModule,
    //MatSelectionList,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
  ],
  exports: [
    MatGridListModule,
    MatSelectionList,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    TopFilterComponent,
  ],
})
export class SharedModule { }

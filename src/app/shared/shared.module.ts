import { NgModule } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatListModule, MatSelectionList } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';




@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatGridListModule,
    //MatSelectionList,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
  ],
  exports: [
    MatGridListModule,
    MatSelectionList,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule
  ],
})
export class SharedModule { }

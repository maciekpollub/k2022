import { Component, OnInit } from '@angular/core';
import { IAppState } from '../../reducer';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor(private store: Store<IAppState>) { }

  ngOnInit(): void {
  }

}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { IAppState } from '../reducer';
import { setCTAVisibility } from '../actions';

export interface IMenuItem {
  name: string;
  path: string;
}

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent implements OnInit {

  menuItems: IMenuItem[] = [
    { name: 'Uczestnicy', path: 'participant-list' },
    { name: 'Kwatery Buzuna', path: 'accommodation-list' },
    { name: 'Kwatery inne', path: '' }
  ]

  constructor(private router: Router, private store: Store<IAppState>) { }

  ngOnInit(): void {
  }

  routeTo (path: string) {
    this.router.navigate([path])
    this.store.dispatch(setCTAVisibility({ visible: false }));
  };

}

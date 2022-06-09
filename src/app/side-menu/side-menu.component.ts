import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
    { name: 'Kwatery', path: 'accommodation' },
  ]

  constructor(private router: Router, private store: Store<IAppState>, private actRoute: ActivatedRoute) { }

  ngOnInit(): void {
  }

  routeTo (path: string) {
    this.store.dispatch(setCTAVisibility({ visible: false }));
    switch(path) {
      case 'participants': {
        this.router.navigate(['participant-list']);
        break;
      };
      case 'accommodation': {
        this.router.navigate([path]);
        break;
      };
      default: {
        this.router.navigate(['accommodation', path]);
        break;
      }
    }
  };

  routeToOtherAcc() {
    this.router.navigate(['/accommodation/other-accommodation-list'])
  }

}

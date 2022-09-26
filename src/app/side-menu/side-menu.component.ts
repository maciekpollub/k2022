import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { IAppState } from '../reducer';
import { setCTAVisibility } from '../actions';
import { Subscription } from 'rxjs';
import { relieveActiveAccommodationData, relieveActiveOtherAccommodationData } from '../accommodation/actions';
import { relieveActiveParticpantData } from '../participants/actions';

export interface IMenuItem {
  name: string;
  path: string;
}

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent implements OnInit, OnDestroy {

  menuItems: IMenuItem[] = [
    { name: 'Uczestnicy', path: 'participant-list' },
    { name: 'Kwatery', path: 'accommodation' },
  ]

  participantsModuleActive = true;
  accommodationsModuleActive = false;
  subs = new Subscription();

  currentRoute = '';

  constructor(private router: Router, private store: Store<IAppState>, private actRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.subs.add(
      this.router.events.subscribe((ev) => {
        if (ev instanceof NavigationEnd) {
          this.currentRoute = ev.url;
        }
      })
    )
  }

  routeTo (path: string) {
    this.store.dispatch(setCTAVisibility({ visible: false }));
    switch(path) {
      case 'participants': {
        this.router.navigate([path, 'list']);
        break;
      };
      case 'new': {
        this.store.dispatch(relieveActiveParticpantData());
        this.router.navigate(['participants', 'new']);
        break;
      }
      case 'accommodation': {
        this.router.navigate([path, 'buzun-list']);
        break;
      };
      case 'new-accommodation': {
        this.store.dispatch(relieveActiveAccommodationData());
        this.router.navigate(['accommodation', path]);
        break;
      };
      case 'new-other-accommodation': {
        this.store.dispatch(relieveActiveOtherAccommodationData());
        this.router.navigate(['accommodation', path]);
        break;
      }
      default: {
        this.router.navigate(['accommodation', path]);
        break;
      }
    }
  };

  routeToOtherAcc() {
    this.router.navigate(['/accommodation/other-accommodation-list'])
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}

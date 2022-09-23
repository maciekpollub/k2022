import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import * as XLSX from 'xlsx';
import { IAppState, isCTAVisible } from './reducer';
import { setCTAVisibility, toggleDrawerState } from './actions';
import { IFirstDataPiece } from './interfaces/data-piece';
import { IParticipant } from './interfaces/participant';
import { map, Observable, Subscription } from 'rxjs';
import { MatDrawer } from '@angular/material/sidenav';
import { Router, NavigationStart } from '@angular/router';
import { IAccommodation } from './interfaces/accommodation';
import { IOtherAccommodation } from './interfaces/other-accommodation';
import { Location } from '@angular/common';
import { fetchParticipantsDataRequest, supplyParticipantsWithFBKeysRequest } from './participants/actions';
import { fetchAccommodationsDataRequest, fetchOtherAccommodationsDataRequest, supplyAccommodationsWithFBKeysRequest,
        supplyOtherAccommodationsWithFBKeysRequest } from './accommodation/actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'k2022';
  file: File | null;
  arrayBuffer: any;

  first_filelist: any;
  second_filelist: any;
  third_filelist: any;

  firstFilteredList: IFirstDataPiece[];
  participantList: IParticipant[];
  accommodationList: IAccommodation[];
  otherAccommodationList: IOtherAccommodation[];

  participantList$: Observable<IParticipant[]>;
  accommodationList$: Observable<IAccommodation[]>;
  otherAccommodationList$: Observable<IOtherAccommodation[]>

  CTAVisible: Observable<boolean>;
  @ViewChild('drawer') drawer: MatDrawer;

  subs = new Subscription();

  constructor(
    private store: Store<IAppState>,
    private router: Router,
    private location: Location
    ) {
    this.file = null;
    this.firstFilteredList= [];
    this.participantList = [];
    this.accommodationList = [];
    this.otherAccommodationList = [];

    this.store.dispatch(fetchParticipantsDataRequest());
    this.store.dispatch(fetchAccommodationsDataRequest());
    this.store.dispatch(fetchOtherAccommodationsDataRequest());

    this.store.dispatch(supplyParticipantsWithFBKeysRequest());
    this.store.dispatch(supplyAccommodationsWithFBKeysRequest());
    this.store.dispatch(supplyOtherAccommodationsWithFBKeysRequest());
  }

  // readfile() {
  //   let url = "/assets/kr2018.xlsx";
  //   let req = new XMLHttpRequest();
  //   req.open("GET", url, true);
  //   req.responseType = "arraybuffer";
  //   req.onload =  (e) => {
  //       let data = new Uint8Array(req.response);
  //       let arr = new Array();
  //       for(let i = 0; i != data.length; ++i) {
  //         arr[i] = String.fromCharCode(data[i]);
  //       }
  //       let bstr = arr.join("");
  //       let workbook = XLSX.read(bstr, {type:"binary"});

  //       let first_sheet_name = workbook.SheetNames[0];
  //       let first_worksheet = workbook.Sheets[first_sheet_name];
  //       this.fDSrv.update_sheet_range(first_worksheet);
  //       this.first_filelist = XLSX.utils.sheet_to_json(first_worksheet, {raw: true});
  //       this.firstFilteredList = this.fDSrv.filterFetchedParticipants(this.first_filelist);
  //       this.participantList = this.fDSrv.mapParticipantList(this.firstFilteredList);

  //       let second_sheet_name = workbook.SheetNames[1];
  //       let second_worksheet = workbook.Sheets[second_sheet_name];
  //       this.fDSrv.update_sheet_range(second_worksheet);
  //       this.second_filelist = XLSX.utils.sheet_to_json(second_worksheet, {raw: true});
  //       this.accommodationList = this.fDSrv.mapAccommodationList(this.second_filelist);

  //       let third_sheet_name = workbook.SheetNames[2];
  //       let third_worksheet = workbook.Sheets[third_sheet_name];
  //       this.fDSrv.update_sheet_range(third_worksheet);
  //       this.third_filelist = XLSX.utils.sheet_to_json(third_worksheet, {raw: true});
  //       this.otherAccommodationList = this.fDSrv.mapOtherAccommodationList(this.third_filelist);

  //       this.dbSrv.pushToLocalDB(this.participantList, this.accommodationList, this.otherAccommodationList);

  //       this.store.dispatch(fetchSpreadSheet({
  //         fetchedDataParticipants: this.participantList,
  //         fetchedDataAccommodations: this.accommodationList,
  //         fetchedDataOtherAccommodations: this.otherAccommodationList,
  //       }));
  //   };
  //   req.send();
  // }

  ngOnInit() {
    this.subs.add(
      this.router.events.pipe(
        map((evnt) => {
          if(evnt instanceof NavigationStart && evnt.url !== '/') {
            this.store.dispatch(setCTAVisibility({ visible: false }))
          }
        })
      ).subscribe()
    );
    this.CTAVisible = this.store.select(isCTAVisible);
  }

  toggleDrawer() {
    this.drawer.toggle();
    this.store.dispatch(toggleDrawerState());
  }

  routeBack() {
    this.location.back();
  }

  ngOnDestroy(){
    this.subs.unsubscribe();
  }

}

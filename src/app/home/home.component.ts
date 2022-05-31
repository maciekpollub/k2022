import { Component, OnInit } from '@angular/core';

export interface ITile {
  bgColor?: string;
  cols: number;
  rows: number;
  text: string;
  color?: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  tiles: ITile[] = [
    {text: 'KONWIWENCJA', cols: 1, rows: 1, bgColor: 'darkgrey', color: 'white'},
    {text: '', cols: 1, rows: 1 },
    {text: '', cols: 1, rows: 1 },
    {text: '2022', cols: 1, rows: 1, bgColor: 'black', color: 'white'},
  ]

  constructor() { }

  ngOnInit(): void {
  }

}

import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { BillList } from "../bills/bill-list/bill-list";
import { LegislatorList } from "../legislators/legislator-list/legislator-list";

@Component({
  selector: 'app-home',
  imports: [MatTabsModule, BillList, LegislatorList],
  templateUrl: './home.html',
  styleUrl: './home.sass',
})
export class Home {}

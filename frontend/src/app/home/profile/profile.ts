import { Component, Injectable, inject, signal, computed, Signal } from '@angular/core';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { DatePipe } from '@angular/common';
import { AuthService } from 'src/app/core/auth-service';
import { AddressForm } from 'src/app/shared/address-form/address-form.component';
import { TableComponent } from 'src/app/shared/table/table.component';
import { LEGISLATOR_COLS } from '@models/column-config';

interface SearchAddress {
  address: string;
  address2: string | null;
  city: string;
  state: string;
  postalCode: number;
}

@Component({
  selector: 'app-profile',
  imports: [DatePipe, MatListModule, MatIconModule, AddressForm, MatTabsModule, TableComponent],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  private auth = inject(AuthService);
  private functions = inject(Functions);
  user = this.auth.userProfile;

  legislatorCols = LEGISLATOR_COLS;

  searchAddress = async (e: SearchAddress) => {
    let addressStr = e.address;
    if (e.address2) addressStr += `, ${e.address2}`;
    addressStr += `, ${e.city}, ${e.state} ${e.postalCode}`;

    const fetchUserReps = httpsCallable(this.functions, 'fetchUserReps');

    try {
      const result = await fetchUserReps({ address: addressStr });
      alert('Success!');
    } catch (error) {
      alert(error);
    }
  };
}

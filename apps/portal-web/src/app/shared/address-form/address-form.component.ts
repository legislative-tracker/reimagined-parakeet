import { Component, inject, input, output } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';

/**
 * Common fields shared across all address form types.
 */
export interface BaseAddress {
  address: string | null;
  address2?: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
}

/**
 * Specific fields for shipping scenarios.
 */
export interface ShippingAddress extends BaseAddress {
  company?: string | null;
  firstName: string | null;
  lastName: string | null;
  shipping: string | null;
}

/**
 * Union type representing the possible data payloads emitted by the form.
 */
export type AddressFormOutput = Partial<BaseAddress> | Partial<ShippingAddress>;

/**
 * A reusable address form component supporting search and shipping configurations.
 * @description Utilizes Angular Signals (input) and new Output emitters for reactive data flow.
 */
@Component({
  selector: 'app-address-form',
  templateUrl: './address-form.component.html',
  styleUrl: './address-form.component.scss',
  standalone: true,
  imports: [
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    ReactiveFormsModule,
  ],
})
export class AddressForm {
  /** FormBuilder service injected using the modern inject() function. */
  private readonly fb = inject(FormBuilder);

  /** Determines the form layout and required fields. */
  public readonly formType = input.required<'search' | 'shipping'>();

  /** Emits the form value upon successful submission. */
  public readonly formSubmit = output<AddressFormOutput>();

  /** Form group for search-specific address queries. */
  public readonly searchAddress = this.fb.group({
    address: ['', Validators.required],
    address2: '',
    city: ['', Validators.required],
    state: ['', Validators.required],
    postalCode: [
      '',
      Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(5)]),
    ],
  });

  /** Form group for full shipping address details. */
  public readonly shippingAddress = this.fb.group({
    company: '',
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    address: ['', Validators.required],
    address2: '',
    city: ['', Validators.required],
    state: ['', Validators.required],
    postalCode: [
      '',
      Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(5)]),
    ],
    shipping: ['free', Validators.required],
  });

  /** UI state for toggling secondary address fields. */
  public hasUnitNumber = false;

  /** Static list of US States and Territories for the selection dropdown. */
  public readonly states = [
    { name: 'Alabama', abbreviation: 'AL' },
    { name: 'Alaska', abbreviation: 'AK' },
    { name: 'American Samoa', abbreviation: 'AS' },
    { name: 'Arizona', abbreviation: 'AZ' },
    { name: 'Arkansas', abbreviation: 'AR' },
    { name: 'California', abbreviation: 'CA' },
    { name: 'Colorado', abbreviation: 'CO' },
    { name: 'Connecticut', abbreviation: 'CT' },
    { name: 'Delaware', abbreviation: 'DE' },
    { name: 'District Of Columbia', abbreviation: 'DC' },
    { name: 'Federated States Of Micronesia', abbreviation: 'FM' },
    { name: 'Florida', abbreviation: 'FL' },
    { name: 'Georgia', abbreviation: 'GA' },
    { name: 'Guam', abbreviation: 'GU' },
    { name: 'Hawaii', abbreviation: 'HI' },
    { name: 'Idaho', abbreviation: 'ID' },
    { name: 'Illinois', abbreviation: 'IL' },
    { name: 'Indiana', abbreviation: 'IN' },
    { name: 'Iowa', abbreviation: 'IA' },
    { name: 'Kansas', abbreviation: 'KS' },
    { name: 'Kentucky', abbreviation: 'KY' },
    { name: 'Louisiana', abbreviation: 'LA' },
    { name: 'Maine', abbreviation: 'ME' },
    { name: 'Marshall Islands', abbreviation: 'MH' },
    { name: 'Maryland', abbreviation: 'MD' },
    { name: 'Massachusetts', abbreviation: 'MA' },
    { name: 'Michigan', abbreviation: 'MI' },
    { name: 'Minnesota', abbreviation: 'MN' },
    { name: 'Mississippi', abbreviation: 'MS' },
    { name: 'Missouri', abbreviation: 'MO' },
    { name: 'Montana', abbreviation: 'MT' },
    { name: 'Nebraska', abbreviation: 'NE' },
    { name: 'Nevada', abbreviation: 'NV' },
    { name: 'New Hampshire', abbreviation: 'NH' },
    { name: 'New Jersey', abbreviation: 'NJ' },
    { name: 'New Mexico', abbreviation: 'NM' },
    { name: 'New York', abbreviation: 'NY' },
    { name: 'North Carolina', abbreviation: 'NC' },
    { name: 'North Dakota', abbreviation: 'ND' },
    { name: 'Northern Mariana Islands', abbreviation: 'MP' },
    { name: 'Ohio', abbreviation: 'OH' },
    { name: 'Oklahoma', abbreviation: 'OK' },
    { name: 'Oregon', abbreviation: 'OR' },
    { name: 'Palau', abbreviation: 'PW' },
    { name: 'Pennsylvania', abbreviation: 'PA' },
    { name: 'Puerto Rico', abbreviation: 'PR' },
    { name: 'Rhode Island', abbreviation: 'RI' },
    { name: 'South Carolina', abbreviation: 'SC' },
    { name: 'South Dakota', abbreviation: 'SD' },
    { name: 'Tennessee', abbreviation: 'TN' },
    { name: 'Texas', abbreviation: 'TX' },
    { name: 'Utah', abbreviation: 'UT' },
    { name: 'Vermont', abbreviation: 'VT' },
    { name: 'Virgin Islands', abbreviation: 'VI' },
    { name: 'Virginia', abbreviation: 'VA' },
    { name: 'Washington', abbreviation: 'WA' },
    { name: 'West Virginia', abbreviation: 'WV' },
    { name: 'Wisconsin', abbreviation: 'WI' },
    { name: 'Wyoming', abbreviation: 'WY' },
  ];

  /**
   * Validates the active form and emits the result through the formSubmit output.
   */
  public onSubmit(): void {
    if (this.formType() === 'search') {
      this.formSubmit.emit(this.searchAddress.value as Partial<BaseAddress>);
    } else if (this.formType() === 'shipping') {
      this.formSubmit.emit(this.shippingAddress.value as Partial<ShippingAddress>);
    }
  }
}

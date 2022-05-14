import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import {RecordedvoiceComponent} from '../user-profile/recordedvoice/recordedvoice.component';
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import {MatFormFieldModule} from '@angular/material/form-field';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        MatAutocompleteModule,
        MatFormFieldModule
    ],
  declarations: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent
  ],
  exports: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent]
})
export class ComponentsModule { }

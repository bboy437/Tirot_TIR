
import { NgModule } from "@angular/core";
import {
  MatCardModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatInputModule,
  MatToolbarModule,
  MatIconModule,
  MatCheckboxModule,
  MatListModule,
  MatSortModule,
  MatPaginatorModule,
  MatTableModule,
  MatSelectModule,
  MatDialogModule,
  MatGridListModule,
  MatProgressSpinnerModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatAutocompleteModule,
  MAT_DATE_LOCALE, MatFormFieldModule, MAT_DATE_FORMATS, DateAdapter, 
  MatRadioModule
  
} from "@angular/material";
import { TextMaskModule } from 'angular2-text-mask';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatChipsModule } from "@angular/material/chips";
import { CommonModule } from "@angular/common";
import { FlexLayoutModule } from "@angular/flex-layout";
import { TransactionRouterModule } from "./transaction.routes";
import { CoreModule } from "../core/core.module";
import { ProductionOrderListingComponent } from "./production-order-listing/production-order-listing.component";
import { ProductionOrderDetailComponent } from './production-order-detail/production-order-detail.component';
import { ProductionOrderDetailDialogComponent } from './production-order-detail/dialog/production-order-detail-dialog/production-order-detail-dialog.component';
import { ProductionOrderListingDialogComponent } from './production-order-listing/dialog/production-order-listing-dialog/production-order-listing-dialog.component';
import { ProductionPlaningComponent } from './production-planing/production-planing.component';
import { CalendarModule } from 'angular-calendar';
import { ProductionPlaningEntryComponent } from './production-planing-entry/production-planing-entry.component';
// import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  imports: [
    CalendarModule.forRoot(),
    // NgbModalModule.forRoot(),
    MatCardModule,
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatInputModule,
    MatToolbarModule,
    MatIconModule,
    MatCheckboxModule,
    MatListModule,
    MatChipsModule,
    CoreModule,
    TransactionRouterModule,
    MatSortModule,
    MatPaginatorModule,
    MatTableModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatDialogModule,
    MatGridListModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    TextMaskModule,
    MatRadioModule
  ],
  declarations: [
    ProductionOrderListingComponent,
    ProductionOrderDetailComponent,
    ProductionOrderListingDialogComponent,
    ProductionOrderDetailDialogComponent,
    ProductionPlaningComponent,
    ProductionPlaningEntryComponent
  ],
  exports: [
    CommonModule,
    MatToolbarModule,
    MatInputModule,
    MatSortModule,
    MatPaginatorModule,
    MatTableModule,
    MatSelectModule,
    MatDialogModule,
    MatGridListModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    MatButtonToggleModule,
    


  ],
  providers: [
    
  ],
  entryComponents: [ProductionOrderListingDialogComponent,ProductionOrderDetailDialogComponent]
})
export class TransactionModule {}

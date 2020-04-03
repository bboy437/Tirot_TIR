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
  MatRadioModule,
  MatStepperModule,
  MatSnackBarModule,
  MatProgressBarModule,
  MatTab,
  MatTabsModule

} from "@angular/material";
import { TextMaskModule } from 'angular2-text-mask';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatChipsModule } from "@angular/material/chips";
import { CommonModule } from "@angular/common";
import { FlexLayoutModule } from "@angular/flex-layout";
import { ProductionrecordRouterModule } from "./productionrecord.routes";
import { CoreModule } from "../core/core.module";
import { CalendarModule } from 'angular-calendar';
// import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ProductionPlanListComponent } from "./production-plan-list/production-plan-list.component";
import { ProductionRecordHeaderComponent } from './production-record-header/production-record-header.component';
import { StandardInspectEntryComponent } from './standard-inspect-entry/standard-inspect-entry.component';
import { MixedSolutionEntryComponent } from './mixed-solution-entry/mixed-solution-entry.component';
import { MixedSolutionEntryDialogComponent } from './mixed-solution-entry/dialog/mixed-solution-entry-dialog/mixed-solution-entry-dialog.component';
import { MachineCheckListComponent } from "./machine-check-list/machine-check-list.component";
import { MachineCheckListItemComponent } from "./machine-check-list-item/machine-check-list-item.component";
import { ProductionPlanDetailComponent } from './production-plan-detail/production-plan-detail.component';
import { FinalInspectionListComponent } from './final-inspection-list/final-inspection-list.component';
import { FinalInspectionDetailComponent } from './final-inspection-detail/final-inspection-detail.component';
import { FinalInspectionDetailDialogComponent } from './final-inspection-detail/dialog/final-inspection-detail-dialog/final-inspection-detail-dialog.component';
import { InlineInspectEntryComponent } from './inline-inspect-entry/inline-inspect-entry.component';
import { DefectButtonComponent } from './defect-button/defect-button.component';
import { InlineInspectDialogComponent } from './inline-inspect-entry/dialog/inline-inspect-dialog/inline-inspect-dialog.component';
import { RollDescriptionComponent } from './roll-description/roll-description.component';
import { FinalInspectionListDialogComponent } from './final-inspection-list/dialog/final-inspection-list-dialog/final-inspection-list-dialog.component';
import { DialogService } from "../services/dialog.service";
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
    ProductionrecordRouterModule,
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
    MatRadioModule,
    MatStepperModule,
    MatSnackBarModule,
    MatProgressBarModule,
    MatTabsModule
  ],
  declarations: [
    ProductionPlanListComponent,
    ProductionRecordHeaderComponent,
    StandardInspectEntryComponent,
    MixedSolutionEntryComponent,
    MixedSolutionEntryDialogComponent,
    MachineCheckListComponent,
    MachineCheckListItemComponent,
    ProductionPlanDetailComponent,
    FinalInspectionListComponent,
    FinalInspectionDetailComponent,
    FinalInspectionDetailDialogComponent,
    FinalInspectionListDialogComponent,
    InlineInspectEntryComponent,
    DefectButtonComponent,
    InlineInspectDialogComponent,
    RollDescriptionComponent
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
    MatStepperModule,
    MatSnackBarModule,
    MatTabsModule

  ],
  providers: [
    
  ],

  entryComponents: [MixedSolutionEntryDialogComponent, InlineInspectDialogComponent, FinalInspectionDetailDialogComponent, FinalInspectionListDialogComponent]
})
export class ProductionRecordModule { }

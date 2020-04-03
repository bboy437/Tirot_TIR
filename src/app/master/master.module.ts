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
  MatSnackBarModule,
  MatProgressSpinnerModule,
} from "@angular/material";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatChipsModule } from "@angular/material/chips";
import { CommonModule } from "@angular/common";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MasterRouterModule } from "./master.routes";
import { CoreModule } from "../core/core.module";
import { ProductsListingComponent } from "./products-listing/products-listing.component";
import { ProductsDetailComponent } from "./products-detail/products-detail.component";
import { RawMaterialListingComponent } from "./raw-material-listing/raw-material-listing.component";
import { RawMaterialDetailComponent } from "./raw-material-detail/raw-material-detail.component";
import { ArticleListingComponent } from "./article-listing/article-listing.component";
import { ArticleDetailComponent } from "./article-detail/article-detail.component";
import { ArticleDialogComponent } from "./article-detail/dialogs/article-dialog/article-dialog.component";
import { ShiftSchduleListingComponent } from "./shift-schdule-listing/shift-schdule-listing.component";
import { ShiftSchduleDetailComponent } from "./shift-schdule-detail/shift-schdule-detail.component";
import { CustomerListingComponent } from "./customer-listing/customer-listing.component";
import { CustomerDetailComponent } from "./customer-detail/customer-detail.component";
import { TeamListingComponent } from "./team-listing/team-listing.component";
import { TeamDetailComponent } from "./team-detail/team-detail.component";
import { ProcessListingComponent } from "./process-listing/process-listing.component";
import { ProcessDetailComponent } from "./process-detail/process-detail.component";
import { StationListingComponent } from "./station-listing/station-listing.component";
import { StationDetailComponent } from "./station-detail/station-detail.component";
import { StationGroupListingComponent } from "./stationgroup-listing/stationgroup-listing.component";
import { StationGroupDetailComponent } from "./stationgroup-detail/stationgroup-detail.component";
import { SysRoleListingComponent } from "./sysrole-listing/sysrole-listing.component";
import { SysRoleDetailComponent } from "./sysrole-detail/sysrole-detail.component";
import { TextMaskModule } from 'angular2-text-mask';
import { DefectListingComponent } from './defect-listing/defect-listing.component';
import { DefectDetailComponent } from './defect-detail/defect-detail.component';
import { GradeListingComponent } from './grade-listing/grade-listing.component';
import { GradeDetailComponent } from './grade-detail/grade-detail.component';
import { UomListingComponent } from './uom-listing/uom-listing.component';
import { UomDetailComponent } from './uom-detail/uom-detail.component';
import { ColorPickerModule } from 'ngx-color-picker';

@NgModule({
  imports: [
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
    MasterRouterModule,
    MatSortModule,
    MatPaginatorModule,
    MatTableModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatDialogModule,
    MatGridListModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    TextMaskModule,
    ColorPickerModule
  ],
  declarations: [
    ProductsListingComponent,
    ProductsDetailComponent,
    RawMaterialListingComponent,
    RawMaterialDetailComponent,
    ArticleListingComponent,
    ArticleDetailComponent,
    ArticleDialogComponent,
    ShiftSchduleListingComponent,
    ShiftSchduleDetailComponent,
    CustomerListingComponent,
    CustomerDetailComponent,
    TeamListingComponent,
    TeamDetailComponent,
    ProcessListingComponent,
    ProcessDetailComponent,
    StationListingComponent,
    StationDetailComponent,
    StationGroupListingComponent,
    StationGroupDetailComponent,
    SysRoleListingComponent,
    SysRoleDetailComponent,
    DefectListingComponent,
    DefectDetailComponent,
    GradeListingComponent,
    GradeDetailComponent,
    UomListingComponent,
    UomDetailComponent
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
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  providers: [],
  entryComponents: [ArticleDialogComponent]
})
export class MasterModule {}

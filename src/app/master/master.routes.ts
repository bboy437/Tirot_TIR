import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductsListingComponent } from './products-listing/products-listing.component';
import { ProductsDetailComponent } from './products-detail/products-detail.component';
import { RawMaterialListingComponent } from './raw-material-listing/raw-material-listing.component';
import { RawMaterialDetailComponent } from './raw-material-detail/raw-material-detail.component';
import { ArticleListingComponent } from './article-listing/article-listing.component';
import { ArticleDetailComponent } from './article-detail/article-detail.component';
import { ShiftSchduleListingComponent } from './shift-schdule-listing/shift-schdule-listing.component';
import { ShiftSchduleDetailComponent } from './shift-schdule-detail/shift-schdule-detail.component';
import { CustomerListingComponent } from './customer-listing/customer-listing.component';
import { CustomerDetailComponent } from './customer-detail/customer-detail.component';
import { TeamListingComponent } from './team-listing/team-listing.component';
import { TeamDetailComponent } from './team-detail/team-detail.component';
import { ProcessListingComponent } from './process-listing/process-listing.component';
import { ProcessDetailComponent } from './process-detail/process-detail.component';
import { StationListingComponent } from './station-listing/station-listing.component';
import { StationDetailComponent } from './station-detail/station-detail.component';
import { StationGroupListingComponent } from './stationgroup-listing/stationgroup-listing.component';
import { StationGroupDetailComponent } from './stationgroup-detail/stationgroup-detail.component';
import { SysRoleListingComponent } from './sysrole-listing/sysrole-listing.component';
import { SysRoleDetailComponent } from './sysrole-detail/sysrole-detail.component';
import { DefectListingComponent } from './defect-listing/defect-listing.component';
import { DefectDetailComponent } from './defect-detail/defect-detail.component';
import { GradeListingComponent } from './grade-listing/grade-listing.component';
import { GradeDetailComponent } from './grade-detail/grade-detail.component';
import { UomListingComponent } from './uom-listing/uom-listing.component';
import { UomDetailComponent } from './uom-detail/uom-detail.component';


const pagesRoutes: Routes = [
    { path: 'article-listing', component: ArticleListingComponent ,data: { animation: 'article-listing' } },
    { path: 'article-detail', component: ArticleDetailComponent ,data: { animation: 'article-detail' } },
    { path: 'products-listing', component: ProductsListingComponent ,data: { animation: 'products-listing' } },
    { path: 'products-detail', component: ProductsDetailComponent ,data: { animation: 'products-detail' } },
    { path: 'raw-material-listing', component: RawMaterialListingComponent ,data: { animation: 'raw-material-listing' } },
    { path: 'raw-material-detail', component: RawMaterialDetailComponent ,data: { animation: 'raw-material-detail' } },
    { path: 'shift-schdule-listing', component: ShiftSchduleListingComponent ,data: { animation: 'shift-schdule-listing' } },
    { path: 'shift-schdule-detail', component: ShiftSchduleDetailComponent ,data: { animation: 'shift-schdule-detail' } },
    { path: 'customer-listing', component: CustomerListingComponent ,data: { animation: 'customer-listing' } },
    { path: 'customer-detail', component: CustomerDetailComponent ,data: { animation: 'customer-detail' } },
    { path: 'team-listing', component: TeamListingComponent ,data: { animation: 'team-listing' } },
    { path: 'team-detail', component: TeamDetailComponent ,data: { animation: 'team-detail' } },
    { path: 'process-listing', component: ProcessListingComponent ,data: { animation: 'process-listing' } },
    { path: 'process-detail', component: ProcessDetailComponent ,data: { animation: 'process-detail' } },
    { path: 'station-listing', component: StationListingComponent ,data: { animation: 'station-listing' } },
    { path: 'station-detail', component: StationDetailComponent ,data: { animation: 'station-detail' } },
    { path: 'stationgroup-listing', component: StationGroupListingComponent ,data: { animation: 'stationgroup-listing' } },
    { path: 'stationgroup-detail', component: StationGroupDetailComponent ,data: { animation: 'stationgroup-detail' } },
    { path: 'sysrole-listing', component: SysRoleListingComponent ,data: { animation: 'sysrole-listing' } },
    { path: 'sysrole-detail', component: SysRoleDetailComponent ,data: { animation: 'sysrole-detail' } },
    { path: 'defect-listing', component: DefectListingComponent ,data: { animation: 'defect-listing' } },
    { path: 'defect-detail', component: DefectDetailComponent ,data: { animation: 'defect-detail' } },
    { path: 'grade-listing', component: GradeListingComponent ,data: { animation: 'grade-listing' } },
    { path: 'grade-detail', component: GradeDetailComponent ,data: { animation: 'grade-detail' } },
    { path: 'uom-listing', component: UomListingComponent ,data: { animation: 'uom-listing' } },
    { path: 'uom-detail', component: UomDetailComponent ,data: { animation: 'uom-detail' } },
];

@NgModule({
  imports: [
    RouterModule.forChild(pagesRoutes)
  	],
  exports: [
    RouterModule
  ]
})
export class MasterRouterModule {}
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductionPlanListComponent } from "./production-plan-list/production-plan-list.component";
import { MachineCheckListComponent } from "./machine-check-list/machine-check-list.component";
import { ProductionPlanDetailComponent } from "./production-plan-detail/production-plan-detail.component";
import { MixedSolutionEntryComponent } from "./mixed-solution-entry/mixed-solution-entry.component";
import { StandardInspectEntryComponent } from "./standard-inspect-entry/standard-inspect-entry.component";
import { InlineInspectEntryComponent } from "./inline-inspect-entry/inline-inspect-entry.component";
import { FinalInspectionListComponent } from "./final-inspection-list/final-inspection-list.component";
import { FinalInspectionDetailComponent } from "./final-inspection-detail/final-inspection-detail.component";

const pagesRoutes: Routes = [
     { path: 'production-plan-list', component: ProductionPlanListComponent ,data: { animation: 'production-plan-list' }},
     { path: 'machine-check-list', component: MachineCheckListComponent ,data: { animation: 'machine-check-list' }},
     { path: 'production-plan-detail', component: ProductionPlanDetailComponent ,data: { animation: 'production-plan-detail' }},
     { path: 'mixed-solution-entry', component: MixedSolutionEntryComponent ,data: { animation: 'mixed-solution-entry' }},
     { path: 'standard-inspect-entry', component: StandardInspectEntryComponent ,data: { animation: 'standard-inspect-entry' }},
     { path: 'inline-inspect-entry', component: InlineInspectEntryComponent ,data: { animation: 'inline-inspect-entry' }},
     { path: 'final-inspection-list', component: FinalInspectionListComponent ,data: { animation: 'final-inspection-list' }},
     { path: 'final-inspection-detail', component: FinalInspectionDetailComponent ,data: { animation: 'final-inspection-detail' }}

];

@NgModule({
  imports: [
    RouterModule.forChild(pagesRoutes)
  	],
  exports: [
    RouterModule
  ]
})
export class ProductionrecordRouterModule {}
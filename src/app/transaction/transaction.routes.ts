import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductionOrderListingComponent } from './production-order-listing/production-order-listing.component';
import { ProductionOrderDetailComponent } from './production-order-detail/production-order-detail.component';
import { ProductionPlaningComponent } from './production-planing/production-planing.component';
import { ProductionPlaningEntryComponent } from './production-planing-entry/production-planing-entry.component';
const pagesRoutes: Routes = [
     { path: 'production-order-listing', component: ProductionOrderListingComponent ,data: { animation: 'production-order-listing' } },
     { path: 'production-order-detail/:id', component: ProductionOrderDetailComponent ,data: { animation: 'production-order-detail' } },
     { path: 'production-planing', component: ProductionPlaningComponent ,data: { animation: 'production-planing' } },
     { path: 'production-planing-entry', component: ProductionPlaningEntryComponent ,data: { animation: 'production-planing-entry' } },
];

@NgModule({
  imports: [
    RouterModule.forChild(pagesRoutes)
  	],
  exports: [
    RouterModule
  ]
})
export class TransactionRouterModule {}
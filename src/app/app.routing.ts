import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

export const routes: Routes = [
  { path: '', redirectTo: 'auth/productionrecord', pathMatch: 'full' },
  { path: '**', redirectTo: 'auth/productionrecord' }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, { useHash: true });

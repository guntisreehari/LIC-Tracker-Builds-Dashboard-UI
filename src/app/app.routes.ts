import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuditComponent } from './components/audit/audit.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'audit', component: AuditComponent },
  { path: '**', redirectTo: '' }
];
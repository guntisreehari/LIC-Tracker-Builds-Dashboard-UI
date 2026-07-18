import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { interval, switchMap, startWith } from 'rxjs';
import { DashboardService } from '../../services/dashboard.service';
import { DeploymentsTable } from '../../models/env-status.model';
import { PromoteDialogComponent } from '../promote-dialog/promote-dialog.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, PromoteDialogComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  table: DeploymentsTable = { envs: [], services: [] };
  loading = true;
  errorMsg: string | null = null;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    interval(30000).pipe(
      startWith(0),
      switchMap(() => this.dashboardService.getDeployments())
    ).subscribe({
      next: (data) => {
        this.table = data;
        this.errorMsg = null;
        this.loading = false;
      },
      error: (err) => {
        this.errorMsg = err.message || 'Failed to load deployments';
        this.loading = false;
      }
    });
  }

  refresh() {
    this.dashboardService.getDeployments().subscribe({
      next: (data) => { this.table = data; this.errorMsg = null; },
      error: (err) => { this.errorMsg = err.message || 'Failed to load deployments'; }
    });
  }

  get serviceNames(): string[] {
    return this.table.services.map((s) => s.service);
  }
}
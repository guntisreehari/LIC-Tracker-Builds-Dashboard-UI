import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../services/dashboard.service';
import { AuditEntry } from '../../models/env-status.model';

@Component({
  selector: 'app-audit',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './audit.component.html',
  styleUrl: './audit.component.css'
})
export class AuditComponent implements OnInit {
  entries: AuditEntry[] = [];
  loading = true;
  errorMsg: string | null = null;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading = true;
    this.dashboardService.getAudit(50).subscribe({
      next: (data) => {
        this.entries = data;
        this.errorMsg = null;
        this.loading = false;
      },
      error: (err) => {
        this.errorMsg = err.message || 'Failed to load audit history';
        this.loading = false;
      }
    });
  }
}
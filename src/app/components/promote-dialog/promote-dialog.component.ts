import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardService } from '../../services/dashboard.service';
import { ActionsConfig } from '../../models/env-status.model';

@Component({
  selector: 'app-promote-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './promote-dialog.component.html',
  styleUrl: './promote-dialog.component.css'
})
export class PromoteDialogComponent implements OnInit, OnChanges {
  @Input() services: string[] = [];
  @Output() promoted = new EventEmitter<void>();

  actions: ActionsConfig = { deployByTagEnvs: [] };

  // Deploy-by-tag form
  deployService = '';
  deployEnv = '';
  deployTag = '';

  confirming: 'deploy' | null = null;
  submitting = false;
  errorMsg: string | null = null;
  successMsg: string | null = null;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.dashboardService.getActions().subscribe({
      next: (cfg) => {
        this.actions = cfg;
        if (!this.deployEnv && cfg.deployByTagEnvs.length) {
          this.deployEnv = cfg.deployByTagEnvs[0];
        }
      },
      error: () => { /* actions are optional - forms just stay empty */ }
    });
  }

  ngOnChanges() {
    if (!this.deployService && this.services.length) {
      this.deployService = this.services[0];
    }
  }

  get canDeploy(): boolean {
    return !!this.deployService && !!this.deployEnv && !!this.deployTag.trim() && !this.submitting;
  }

  askDeploy() { if (this.canDeploy) this.confirming = 'deploy'; }
  cancel() { this.confirming = null; }

  confirmDeploy() {
    this.submitting = true;
    this.errorMsg = null;
    this.successMsg = null;
    this.dashboardService.deployTag(this.deployService, this.deployEnv, this.deployTag.trim())
      .subscribe({
        next: (res) => this.done(res.message),
        error: (err) => this.failed(err, 'Deploy failed')
      });
  }

  private done(message: string) {
    this.successMsg = message;
    this.submitting = false;
    this.confirming = null;
    this.deployTag = '';
    this.promoted.emit();
  }

  private failed(err: any, fallback: string) {
    this.errorMsg = err?.error?.error || fallback;
    this.submitting = false;
    this.confirming = null;
  }
}
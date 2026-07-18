import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardService } from '../../services/dashboard.service';
import { ActionsConfig, Hop } from '../../models/env-status.model';

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

  actions: ActionsConfig = { promotionPaths: [], deployByTagEnvs: [] };

  // Deploy-by-tag form
  deployService = '';
  deployEnv = '';
  deployTag = '';

  // Promote form
  promoteService = '';
  selectedHopIndex = 0;

  confirming: 'deploy' | 'promote' | null = null;
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
    if (!this.promoteService && this.services.length) {
      this.promoteService = this.services[0];
    }
  }

  get selectedHop(): Hop | undefined {
    return this.actions.promotionPaths[this.selectedHopIndex];
  }

  get canDeploy(): boolean {
    return !!this.deployService && !!this.deployEnv && !!this.deployTag.trim() && !this.submitting;
  }

  get canPromote(): boolean {
    return !!this.promoteService && !!this.selectedHop && !this.submitting;
  }

  askDeploy() { if (this.canDeploy) this.confirming = 'deploy'; }
  askPromote() { if (this.canPromote) this.confirming = 'promote'; }
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

  confirmPromote() {
    const hop = this.selectedHop;
    if (!hop) return;
    this.submitting = true;
    this.errorMsg = null;
    this.successMsg = null;
    this.dashboardService.promote(this.promoteService, hop.from, hop.to)
      .subscribe({
        next: (res) => this.done(res.message),
        error: (err) => this.failed(err, 'Promote failed')
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
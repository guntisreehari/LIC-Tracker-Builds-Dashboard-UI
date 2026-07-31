import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardService } from '../../services/dashboard.service';
import { EnvVarView } from '../../models/env-status.model';

@Component({
  selector: 'app-env-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './env-editor.component.html',
  styleUrl: './env-editor.component.css'
})
export class EnvEditorComponent implements OnInit {
  services: string[] = [];
  envs: string[] = [];

  service = '';
  env = '';

  vars: EnvVarView[] = [];
  loading = false;
  loaded = false;

  /** name -> new value, for the rows actually edited. */
  edits: Record<string, string> = {};

  /** Adding a variable that does not exist yet. */
  newName = '';
  newValue = '';

  /** Held in memory only, for the length of the edit. Never persisted. */
  token = '';

  confirming = false;
  submitting = false;
  errorMsg: string | null = null;
  successMsg: string | null = null;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    // The service and environment lists are whatever the backend is configured
    // with, so this page never drifts from the deployments table.
    this.dashboardService.getDeployments().subscribe({
      next: (table) => {
        this.services = table.services.map(r => r.service);
        this.envs = table.envs;
        if (!this.service && this.services.length) { this.service = this.services[0]; }
        if (!this.env && this.envs.length) { this.env = this.envs[0]; }
      },
      error: (err) => {
        this.errorMsg = err?.error?.error || 'Could not load services';
      }
    });
  }

  load() {
    if (!this.service || !this.env) { return; }
    this.loading = true;
    this.errorMsg = null;
    this.successMsg = null;
    this.edits = {};
    this.dashboardService.getEnvVars(this.service, this.env).subscribe({
      next: (vars) => { this.vars = vars; this.loaded = true; this.loading = false; },
      error: (err) => {
        this.errorMsg = err?.error?.error || 'Could not load environment variables';
        this.vars = [];
        this.loaded = false;
        this.loading = false;
      }
    });
  }

  onEdit(name: string, event: Event) {
    this.edits[name] = (event.target as HTMLInputElement).value;
  }

  isEdited(name: string): boolean {
    return Object.prototype.hasOwnProperty.call(this.edits, name);
  }

  get pendingNames(): string[] {
    const names = Object.keys(this.edits);
    if (this.newName.trim()) { names.push(this.newName.trim()); }
    return names;
  }

  get canSubmit(): boolean {
    return !!this.pendingNames.length && !!this.token.trim() && !this.submitting;
  }

  ask() { if (this.canSubmit) { this.confirming = true; } }
  cancel() { this.confirming = false; }

  confirm() {
    const updates: Record<string, string> = { ...this.edits };
    if (this.newName.trim()) { updates[this.newName.trim()] = this.newValue; }

    this.submitting = true;
    this.errorMsg = null;
    this.successMsg = null;

    this.dashboardService.updateEnvVars(this.service, this.env, updates, this.token.trim()).subscribe({
      next: (vars) => {
        this.vars = vars;
        this.edits = {};
        this.newName = '';
        this.newValue = '';
        this.submitting = false;
        this.confirming = false;
        this.successMsg = 'Updated. Cloud Run is rolling out a new revision.';
      },
      error: (err) => {
        this.errorMsg = err?.error?.error || 'Update failed';
        this.submitting = false;
        this.confirming = false;
      }
    });
  }
}

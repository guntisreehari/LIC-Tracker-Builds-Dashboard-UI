import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ActionsConfig, AuditEntry, DeploymentsTable, PromoteResponse } from '../models/env-status.model';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getDeployments(): Observable<DeploymentsTable> {
    return this.http.get<DeploymentsTable>(`${this.baseUrl}/deployments`);
  }

  promote(service: string, sourceEnv: string, targetEnv: string): Observable<PromoteResponse> {
    return this.http.post<PromoteResponse>(`${this.baseUrl}/promote`, { service, sourceEnv, targetEnv });
  }

  getAudit(limit = 50): Observable<AuditEntry[]> {
    return this.http.get<AuditEntry[]>(`${this.baseUrl}/audit?limit=${limit}`);
  }

  getActions(): Observable<ActionsConfig> {
    return this.http.get<ActionsConfig>(`${this.baseUrl}/actions`);
  }

  deployTag(service: string, env: string, tag: string): Observable<PromoteResponse> {
    return this.http.post<PromoteResponse>(`${this.baseUrl}/deploy`, { service, env, tag });
  }
}
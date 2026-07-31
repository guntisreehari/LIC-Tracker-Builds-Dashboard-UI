import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ActionsConfig, AuditEntry, DeploymentsTable, EnvVarView, PromoteResponse } from '../models/env-status.model';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getDeployments(): Observable<DeploymentsTable> {
    return this.http.get<DeploymentsTable>(`${this.baseUrl}/deployments`);
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

  getEnvVars(service: string, env: string): Observable<EnvVarView[]> {
    return this.http.get<EnvVarView[]>(`${this.baseUrl}/env/${service}/${env}`);
  }

  // The token is held in memory for the length of the edit and sent per request;
  // storing it would leave a credential in the browser for anyone at the machine.
  updateEnvVars(service: string, env: string, updates: Record<string, string>, token: string): Observable<EnvVarView[]> {
    return this.http.post<EnvVarView[]>(`${this.baseUrl}/env`, { service, env, updates },
      { headers: { 'X-Dashboard-Token': token } });
  }
}
export interface EnvStatus {
  env: string;
  serviceName: string;
  imageTag: string | null;
  imageFull: string | null;
  serviceUrl: string | null;
  status: 'DEPLOYED' | 'NOT_FOUND' | 'ERROR';
  message: string | null;
  fetchedAt: string;
}

export interface ServiceRow {
  service: string;
  deployments: Record<string, EnvStatus>;
}

export interface DeploymentsTable {
  envs: string[];
  services: ServiceRow[];
}

export interface PromoteResponse {
  success: boolean;
  message: string;
  deployedTag: string;
}

export interface AuditEntry {
  timestamp: string;
  service: string;
  sourceEnv: string;
  targetEnv: string;
  previousImageTag: string | null;
  previousImage: string | null;
  imageTag: string | null;
  image: string | null;
  targetProject: string | null;
  targetService: string | null;
  success: boolean;
  message: string | null;
}

export interface ActionsConfig {
  deployByTagEnvs: string[];
}
export interface EnvVarView {
  name: string;
  /** null when sensitive: credential values are never sent to the browser. */
  value: string | null;
  sensitive: boolean;
}

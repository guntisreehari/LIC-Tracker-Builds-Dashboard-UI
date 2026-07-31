export const environment = {
  production: true,
  // Must end in /api: DashboardService appends paths like /deployments directly.
  // Without it every call 404s, which looks like the backend is down.
  apiUrl: 'https://deploymentdashboardservice.recordlogger.com/api'
};
